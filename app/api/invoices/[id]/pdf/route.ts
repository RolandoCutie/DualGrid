import Client from '@/database/client.model';
import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import InvoicePDF from '@/lib/pdf/InvoicePDF';
import { renderToBuffer } from '@react-pdf/renderer';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;

  const invoice = await Invoice.findById(id).lean();
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const clientDoc = await Client.findById(invoice.clientId).lean();
  if (!clientDoc) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const invoiceData = {
    _id: invoice._id.toString(),
    invoiceNumber: invoice.invoiceNumber,
    items: invoice.items as Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>,
    subtotal: invoice.subtotal,
    taxRate: invoice.taxRate,
    taxAmount: invoice.taxAmount,
    totalAmount: invoice.totalAmount,
    status: invoice.status,
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    notes: invoice.notes,
  };

  const clientData = {
    name: clientDoc.name,
    email: clientDoc.email,
    phone: clientDoc.phone ?? undefined,
    businessName: clientDoc.businessName ?? undefined,
  };

  const buffer = await renderToBuffer(
    React.createElement(InvoicePDF, { invoice: invoiceData, client: clientData }),
  );

  const filename = `factura-${invoice.invoiceNumber.toLowerCase()}-${clientDoc.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
