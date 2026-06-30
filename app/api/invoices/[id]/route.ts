import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { InvoicePatchSchema } from '@/lib/schemas';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

async function guard() {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  const invoice = await Invoice.findOne({ _id: id, deletedAt: null })
    .populate('clientId', 'name businessName email')
    .populate('contractId', 'planId')
    .lean();
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const parsed = InvoicePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
  }

  const updated = await Invoice.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: parsed.data },
    { new: true, runValidators: true },
  );
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Trigger paidAmount sync via the model post-save hook by calling save()
  await updated.save();

  return NextResponse.json(updated.toObject());
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  // Soft delete — the post-save hook won't run here, so manually trigger sync
  const doc = await Invoice.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
  if (doc?.contractId) {
    // Re-import to avoid circular ref; model is already registered in mongoose
    const mongoose = (await import('mongoose')).default;
    const ContractModel = mongoose.model('Contract');
    const paidAgg = await Invoice.aggregate<{ total: number }>([
      { $match: { contractId: doc.contractId, status: 'paid', deletedAt: null } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    await ContractModel.findByIdAndUpdate(doc.contractId, {
      paidAmount: paidAgg[0]?.total ?? 0,
    });
  }
  return NextResponse.json({ ok: true });
}
