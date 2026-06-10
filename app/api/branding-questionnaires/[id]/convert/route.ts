import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import Client from '@/database/client.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/branding-questionnaires/[id]/convert
 * Converts a branding questionnaire into a Client record.
 * Also marks the questionnaire status as 'contacted'.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;

  const doc = await BrandingQuestionnaire.findById(id).lean();
  if (!doc) {
    return NextResponse.json({ error: 'Questionnaire not found' }, { status: 404 });
  }

  const email = doc.clientEmail ? String(doc.clientEmail) : '';

  if (email) {
    const existing = await Client.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json(
        {
          error: 'Ya existe un cliente con este email',
          clientId: String((existing as { _id: unknown })._id),
        },
        { status: 409 },
      );
    }
  }

  const client = await Client.create({
    name: doc.clientName ? String(doc.clientName) : 'Sin nombre',
    email,
    phone: doc.clientPhone ? String(doc.clientPhone) : undefined,
    notes: doc.recommendedPlan ? `Plan de branding recomendado: ${doc.recommendedPlan}` : undefined,
  });

  await BrandingQuestionnaire.findByIdAndUpdate(id, { $set: { status: 'contacted' } });

  return NextResponse.json({ clientId: client._id.toString() }, { status: 201 });
}
