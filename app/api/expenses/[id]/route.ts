import Expense from '@/database/expense.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { ExpensePatchSchema } from '@/lib/schemas';
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
  const expense = await Expense.findOne({ _id: id, deletedAt: null }).lean();
  if (!expense) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(expense);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  const body = await req.json();

  const parsed = ExpensePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
  }

  const updated = await Expense.findOneAndUpdate(
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
  await Expense.findByIdAndUpdate(id, { deletedAt: new Date() });
  return NextResponse.json({ ok: true });
}
