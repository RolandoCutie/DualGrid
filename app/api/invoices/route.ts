import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

async function getNextInvoiceNumber(): Promise<string> {
  const lastInvoice = (await Invoice.findOne({}).sort({ createdAt: -1 }).lean()) as {
    invoiceNumber?: string;
  } | null;
  if (!lastInvoice?.invoiceNumber) return 'DG-0001';
  const num = parseInt(lastInvoice.invoiceNumber.replace('DG-', ''), 10);
  return `DG-${String(num + 1).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const invoices = await Invoice.find({})
    .populate('clientId', 'name email businessName')
    .populate('contractId', 'planId status')
    .sort({ createdAt: -1 })
    .lean();
  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    await connectDB();
    const invoiceNumber = await getNextInvoiceNumber();
    const invoice = await Invoice.create({ ...body, invoiceNumber });
    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error('[invoices POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
