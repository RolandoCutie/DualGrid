import type { IBrandingAnswers } from '@/database/branding-questionnaire.model';
import BrandingQuestionnaire from '@/database/branding-questionnaire.model';
import { calcBrandingScore } from '@/lib/branding-recommendation';
import connectDB from '@/lib/mongodb';
import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/branding-questionnaires/submit  — public endpoint
 * Called from the landing page BrandingQuizModal after the visitor completes
 * the 4-question quiz and fills in their contact details.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, clientPhone, answers } = body as {
      clientName?: string;
      clientEmail?: string;
      clientPhone?: string;
      answers: IBrandingAnswers;
    };

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: 'Se requiere nombre y email del cliente' },
        { status: 400 },
      );
    }

    if (!answers?.q1 || !answers?.q2 || !answers?.q3 || !answers?.q4) {
      return NextResponse.json({ error: 'Respuestas incompletas' }, { status: 400 });
    }

    const validOptions = ['A', 'B', 'C'];
    for (const key of ['q1', 'q2', 'q3', 'q4'] as const) {
      if (!validOptions.includes(answers[key])) {
        return NextResponse.json({ error: `Respuesta inválida en ${key}` }, { status: 400 });
      }
    }

    const { score, recommendedPlan } = calcBrandingScore(answers);

    await connectDB();

    const doc = await BrandingQuestionnaire.create({
      token: randomUUID(),
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: clientPhone?.trim() || undefined,
      status: 'completed',
      answers,
      score,
      recommendedPlan,
    });

    return NextResponse.json({ id: doc._id.toString(), recommendedPlan, score }, { status: 201 });
  } catch (err) {
    console.error('[branding-questionnaires/submit POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
