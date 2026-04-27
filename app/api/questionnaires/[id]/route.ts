import Questionnaire from '@/database/questionnaire.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
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
  const q = await Questionnaire.findById(id).lean();
  if (!q) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(q);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  // Only allow updating status and adminNotes
  const { status, adminNotes } = body as { status?: string; adminNotes?: string };
  const updated = await Questionnaire.findByIdAndUpdate(
    id,
    { $set: { ...(status && { status }), ...(adminNotes !== undefined && { adminNotes }) } },
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
  await Questionnaire.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
