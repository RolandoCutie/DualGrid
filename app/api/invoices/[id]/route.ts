export const dynamic = 'force-dynamic';

import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { InvoicePatchSchema } from '@/lib/schemas';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

async function guard() {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isDatabaseTimeoutError(message: string) {
  const normalized = message.toLowerCase();
  return (
    normalized.includes('server selection timed out') ||
    normalized.includes('mongodb connection timeout') ||
    normalized.includes('etimeout')
  );
}

function handleRouteError(context: 'GET' | 'PATCH' | 'DELETE', error: unknown) {
  const message = getErrorMessage(error);
  console.error(`[invoices ${context}]`, error);

  if (isDatabaseTimeoutError(message)) {
    return NextResponse.json(
      { error: 'Tiempo de espera agotado al conectar con la base de datos. Intenta de nuevo.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid invoice id' }, { status: 400 });
  }

  try {
    await connectDB();
    const invoice = await Invoice.findOne({ _id: id, deletedAt: null })
      .populate('clientId', 'name businessName email')
      .populate('contractId', 'planId')
      .lean();
    if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(invoice);
  } catch (error) {
    return handleRouteError('GET', error);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid invoice id' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = InvoicePatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
    }

    await connectDB();
    const updated = await Invoice.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: parsed.data },
      { new: true, runValidators: true },
    );
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Trigger paidAmount sync via the model post-save hook by calling save()
    await updated.save();

    return NextResponse.json(updated.toObject());
  } catch (error) {
    return handleRouteError('PATCH', error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid invoice id' }, { status: 400 });
  }

  try {
    await connectDB();
    // Soft delete — the post-save hook won't run here, so manually trigger sync
    const doc = await Invoice.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
    if (doc?.contractId) {
      // Re-import to avoid circular ref; model is already registered in mongoose
      const runtimeMongoose = (await import('mongoose')).default;
      const ContractModel = runtimeMongoose.model('Contract');
      const paidAgg = await Invoice.aggregate<{ total: number }>([
        { $match: { contractId: doc.contractId, status: 'paid', deletedAt: null } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]);
      await ContractModel.findByIdAndUpdate(doc.contractId, {
        paidAmount: paidAgg[0]?.total ?? 0,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleRouteError('DELETE', error);
  }
}
