import Client from '@/database/client.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { ClientPatchSchema } from '@/lib/schemas';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  const client = await Client.findOne({ _id: id, deletedAt: null }).lean();
  if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(client);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await req.json();
  const parsed = ClientPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
  }
  await connectDB();
  const updated = await Client.findOneAndUpdate({ _id: id, deletedAt: null }, parsed.data, {
    new: true,
  }).lean();
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  await connectDB();
  await Client.findByIdAndUpdate(id, { deletedAt: new Date() });
  return NextResponse.json({ success: true });
}
