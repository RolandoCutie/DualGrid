import type { IBrandingAnswers } from '@/database/branding-questionnaire.model';
import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import { calcBrandingScore } from '@/lib/branding-recommendation';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/branding/[token] — load questionnaire by token (public)
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    await connectDB();
    const doc = await BrandingQuestionnaire.findOne({ token }).lean();
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Only expose safe fields to the public
    return NextResponse.json({
      status: doc.status,
      clientName: doc.clientName ?? null,
    });
  } catch (err) {
    console.error('[branding/[token] GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/branding/[token] — submit answers (public)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params;
    const body = await req.json();
    const answers = body.answers as IBrandingAnswers;

    if (!answers?.q1 || !answers?.q2 || !answers?.q3 || !answers?.q4) {
      return NextResponse.json({ error: 'Respuestas incompletas' }, { status: 400 });
    }

    const validOptions = ['A', 'B', 'C'];
    for (const key of ['q1', 'q2', 'q3', 'q4'] as const) {
      if (!validOptions.includes(answers[key])) {
        return NextResponse.json({ error: `Respuesta inválida en ${key}` }, { status: 400 });
      }
    }

    await connectDB();
    const doc = await BrandingQuestionnaire.findOne({ token });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (doc.status === 'completed') {
      return NextResponse.json({ error: 'Ya completado' }, { status: 409 });
    }

    const { score, recommendedPlan } = calcBrandingScore(answers);

    doc.answers = answers;
    doc.score = score;
    doc.recommendedPlan = recommendedPlan;
    doc.status = 'completed';
    await doc.save();

    return NextResponse.json({ recommendedPlan, score });
  } catch (err) {
    console.error('[branding/[token] PUT]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
