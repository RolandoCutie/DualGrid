import Client from '@/database/client.model';
import Contract from '@/database/contract.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import ContractPDF from '@/lib/pdf/ContractPDF';
import { PLAN_MAP } from '@/lib/plans';
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

  const contract = await Contract.findById(id).lean();
  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const clientDoc = await Client.findById(contract.clientId).lean();
  if (!clientDoc) return NextResponse.json({ error: 'Client not found' }, { status: 404 });

  const plan = PLAN_MAP[contract.planId];

  const contractData = {
    _id: contract._id.toString(),
    planId: contract.planId,
    services: contract.services as Array<{ name: string; description: string; price: number }>,
    totalAmount: contract.totalAmount,
    advanceAmount: contract.advanceAmount,
    status: contract.status,
    startDate: contract.startDate.toISOString(),
    deliveryDate: contract.deliveryDate.toISOString(),
    notes: contract.notes,
  };

  const clientData = {
    name: clientDoc.name,
    email: clientDoc.email,
    phone: clientDoc.phone ?? undefined,
    businessName: clientDoc.businessName ?? undefined,
  };

  const buffer = await renderToBuffer(
    React.createElement(ContractPDF, {
      contract: contractData,
      client: clientData,
      planName: plan?.name ?? contract.planId,
    }),
  );

  const filename = `contrato-${clientDoc.name.replace(/\s+/g, '-').toLowerCase()}-${contract._id.toString().slice(-6)}.pdf`;

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
