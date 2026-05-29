import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/branding-questionnaires/[id] — detail (admin only)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionToken = req.cookies.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(sessionToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const doc = await BrandingQuestionnaire.findById(id).lean();
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error('[branding-questionnaires/[id] GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/branding-questionnaires/[id] — update adminNotes (admin only)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const sessionToken = req.cookies.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(sessionToken)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { adminNotes } = body;

    await connectDB();
    const doc = await BrandingQuestionnaire.findByIdAndUpdate(
      id,
      { adminNotes },
      { new: true, runValidators: true },
    ).lean();

    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (err) {
    console.error('[branding-questionnaires/[id] PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
