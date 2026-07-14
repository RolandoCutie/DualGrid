import Client from '@/database/client.model';
import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import InvoicePDF from '@/lib/pdf/InvoicePDF';
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import React from 'react';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await connectDB();

    const invoice = await Invoice.findById(id).lean();
    if (!invoice) return NextResponse.json({ error: 'Factura no encontrada' }, { status: 404 });

    const clientDoc = await Client.findById(invoice.clientId).lean();
    if (!clientDoc) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 });

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

    // Optional logo — load as base64 if the file exists
    let logoBase64: string | undefined;
    try {
      const logoPath = join(process.cwd(), 'public', 'assets', 'company', 'logo.png');
      if (existsSync(logoPath)) {
        const buf = await readFile(logoPath);
        logoBase64 = `data:image/png;base64,${buf.toString('base64')}`;
      }
    } catch {
      // Logo loading failure is non-fatal — proceed without logo
    }

    const buffer = await renderToBuffer(
      React.createElement(InvoicePDF, {
        invoice: invoiceData,
        client: clientData,
        logoBase64,
      }) as unknown as React.ReactElement<DocumentProps>,
    );

    const filename = `factura-${invoice.invoiceNumber.toLowerCase()}-${clientDoc.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('[PDF Invoice]', message);
    if (message.includes('timeout') || message.includes('ETIMEOUT')) {
      return NextResponse.json(
        { error: 'Tiempo de espera agotado al conectar con la base de datos. Intenta de nuevo.' },
        { status: 503 },
      );
    }
    return NextResponse.json({ error: `Error al generar PDF: ${message}` }, { status: 500 });
  }
}
