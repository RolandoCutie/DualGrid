import Contract from '@/database/contract.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const contracts = await Contract.find({})
    .populate('clientId', 'name email businessName')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(contracts);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();
    const contract = await Contract.create(body);
    return NextResponse.json(contract, { status: 201 });
  } catch (err) {
    console.error('[contracts POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
