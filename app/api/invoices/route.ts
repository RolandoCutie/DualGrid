import { nextSeq } from '@/database/counter.model';
import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { InvoiceCreateSchema } from '@/lib/schemas';
import { NextRequest, NextResponse } from 'next/server';

/** Atomic invoice number — no race condition (#11) */
async function getNextInvoiceNumber(): Promise<string> {
  const seq = await nextSeq('invoice');
  return `DG-${String(seq).padStart(4, '0')}`;
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50', 10)));
  const skip = (page - 1) * limit;

  await connectDB();
  const [invoices, total] = await Promise.all([
    Invoice.find({ deletedAt: null })
      .populate('clientId', 'name email businessName')
      .populate('contractId', 'planId status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Invoice.countDocuments({ deletedAt: null }),
  ]);
  return NextResponse.json({ data: invoices, total, page, limit });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const parsed = InvoiceCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
    }
    await connectDB();
    const invoiceNumber = await getNextInvoiceNumber();
    const invoice = await Invoice.create({ ...parsed.data, invoiceNumber });
    return NextResponse.json(invoice, { status: 201 });
  } catch (err) {
    console.error('[invoices POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
