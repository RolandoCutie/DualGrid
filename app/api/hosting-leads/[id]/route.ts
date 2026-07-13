import HostingLead from '@/database/hosting-lead.model';
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
  const { id } = await params;
  await connectDB();
  const lead = await HostingLead.findOne({ _id: id, deletedAt: null }).lean();
  if (!lead) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(lead);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json();
  const allowed = ['status', 'adminNotes'] as const;
  const update: Record<string, unknown> = {};
  for (const k of allowed) {
    if (body[k] !== undefined) update[k] = body[k];
  }
  await connectDB();
  const updated = await HostingLead.findOneAndUpdate(
    { _id: id, deletedAt: null },
    { $set: update },
    { new: true, runValidators: true },
  ).lean();
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await guard();
  if (denied) return denied;
  const { id } = await params;
  await connectDB();
  await HostingLead.findByIdAndUpdate(id, { deletedAt: new Date() });
  return NextResponse.json({ ok: true });
}
