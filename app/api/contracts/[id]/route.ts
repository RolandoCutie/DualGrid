import Contract from '@/database/contract.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { ContractPatchSchema } from '@/lib/schemas';
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
  const contract = await Contract.findOne({ _id: id, deletedAt: null })
    .populate('clientId', 'name businessName email phone')
    .lean();
  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(contract);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const parsed = ContractPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
  }

  // Guard: revisionsUsed cannot exceed revisionsIncluded
  if (parsed.data.revisionsUsed !== undefined) {
    const existing = (await Contract.findOne({ _id: id, deletedAt: null }).lean()) as {
      revisionsIncluded?: number;
    } | null;
    const limit = parsed.data.revisionsIncluded ?? existing?.revisionsIncluded ?? Infinity;
    if (parsed.data.revisionsUsed > limit) {
      return NextResponse.json(
        { error: `El cliente solo tiene ${limit} ronda(s) de revisión incluida(s).` },
        { status: 422 },
      );
    }
  }

  const updated = await Contract.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: parsed.data },
    { new: true, runValidators: true },
  ).lean();
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  await Contract.findByIdAndUpdate(id, { deletedAt: new Date() });
  return NextResponse.json({ ok: true });
}
