import Client from '@/database/client.model';
import Questionnaire from '@/database/questionnaire.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/questionnaires/[id]/convert
 * Converts a questionnaire submission into a Client record.
 * Also marks the questionnaire status as 'contacted'.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const jar = await cookies();
  const token = jar.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();
  const { id } = await params;

  const doc = await Questionnaire.findById(id).lean();
  if (!doc) {
    return NextResponse.json({ error: 'Questionnaire not found' }, { status: 404 });
  }

  const answers = doc.answers as Record<string, unknown>;

  // Check if a client with the same email already exists
  const existingClient = await Client.findOne({ email: String(answers.email || '') }).lean();
  if (existingClient) {
    return NextResponse.json(
      {
        error: 'Ya existe un cliente con este email',
        clientId: String((existingClient as { _id: unknown })._id),
      },
      { status: 409 },
    );
  }

  const client = await Client.create({
    name: String(answers.fullName || ''),
    email: String(answers.email || ''),
    phone: String(answers.phone || ''),
    businessName: answers.businessName ? String(answers.businessName) : undefined,
    businessType: answers.businessType ? String(answers.businessType) : undefined,
    notes: answers.extraNotes ? String(answers.extraNotes) : undefined,
  });

  // Mark questionnaire as contacted
  await Questionnaire.findByIdAndUpdate(id, { $set: { status: 'contacted' } });

  return NextResponse.json({ clientId: client._id.toString() }, { status: 201 });
}
