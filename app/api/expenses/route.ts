import Expense from '@/database/expense.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const expenses = await Expense.find({}).sort({ date: -1 }).lean();
  return NextResponse.json(expenses);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();
    const expense = await Expense.create(body);
    return NextResponse.json(expense, { status: 201 });
  } catch (err) {
    console.error('[expenses POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
