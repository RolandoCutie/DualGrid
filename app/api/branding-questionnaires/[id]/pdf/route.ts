import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import BrandingQuestionnairePDF from '@/lib/pdf/BrandingQuestionnairePDF';
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

  const doc = await BrandingQuestionnaire.findById(id).lean();
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const buffer = await renderToBuffer(
    React.createElement(BrandingQuestionnairePDF, {
      id: String(doc._id),
      token: String(doc.token ?? ''),
      clientName: doc.clientName ? String(doc.clientName) : undefined,
      clientEmail: doc.clientEmail ? String(doc.clientEmail) : undefined,
      status: String(doc.status ?? 'pending'),
      answers: (doc.answers as Record<string, string> | undefined) ?? undefined,
      score: (doc.score as Record<string, number> | undefined) ?? undefined,
      recommendedPlan: doc.recommendedPlan ? String(doc.recommendedPlan) : undefined,
      adminNotes: doc.adminNotes ? String(doc.adminNotes) : undefined,
      createdAt: doc.createdAt ? String(doc.createdAt) : null,
    }) as unknown as React.ReactElement,
  );

  const fileBase = safeSlug(String(doc.clientName ?? 'cuestionario-branding')) || 'sin-nombre';
  const filename = `cuestionario-branding-${fileBase}-${id.slice(-6)}.pdf`;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
