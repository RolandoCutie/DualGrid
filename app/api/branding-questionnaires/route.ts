import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/branding-questionnaires — list all (admin only)
export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const docs = await BrandingQuestionnaire.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(docs);
  } catch (err) {
    console.error('[branding-questionnaires GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/branding-questionnaires — create assignment (admin only)
export async function POST(req: NextRequest) {
  const sessionToken = req.cookies.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(sessionToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { clientId, clientName, clientEmail } = body;

    if (!clientName && !clientId) {
      return NextResponse.json({ error: 'Se requiere clientId o clientName' }, { status: 400 });
    }

    await connectDB();

    const uniqueToken = randomUUID();

    const doc = await BrandingQuestionnaire.create({
      token: uniqueToken,
      clientId: clientId ?? undefined,
      clientName: clientName ?? undefined,
      clientEmail: clientEmail ?? undefined,
      status: 'pending',
    });

    return NextResponse.json({ id: doc._id.toString(), token: uniqueToken }, { status: 201 });
  } catch (err) {
    console.error('[branding-questionnaires POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
