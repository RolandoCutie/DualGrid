import Questionnaire from '@/database/questionnaire.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import QuestionnairePDF from '@/lib/pdf/QuestionnairePDF';
import { renderToBuffer } from '@react-pdf/renderer';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';

export const runtime = 'nodejs';

function safeSlug(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toLowerCase();
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;

  const doc = await Questionnaire.findById(id).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const answers = (doc.answers as Record<string, unknown>) ?? {};
  const clientName = String(answers.fullName ?? 'cuestionario');

  const pdfData = {
    answers,
    recommendedPlan: String(doc.recommendedPlan ?? ''),
    selectedPlan: doc.selectedPlan ? String(doc.selectedPlan) : null,
    status: String(doc.status ?? 'new'),
    adminNotes: doc.adminNotes ? String(doc.adminNotes) : undefined,
    createdAt: doc.createdAt ? String(doc.createdAt) : null,
  };

  const buffer = await renderToBuffer(
    React.createElement(QuestionnairePDF, pdfData) as unknown as React.ReactElement,
  );

  const filename = `cuestionario-web-${safeSlug(clientName) || 'sin-nombre'}-${id.slice(-6)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
