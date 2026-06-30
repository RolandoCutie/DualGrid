import Questionnaire from '@/database/questionnaire.model';
import connectDB from '@/lib/mongodb';
import { QuestionnaireSubmitSchema } from '@/lib/schemas';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsed = QuestionnaireSubmitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 422 });
    }

    const { answers, recommendedPlan, selectedPlan, score } = parsed.data;

    await connectDB();
    const doc = await Questionnaire.create({
      answers,
      recommendedPlan,
      selectedPlan: selectedPlan ?? null,
      score: score || {},
    });

    return NextResponse.json({ id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    console.error('[questionnaires POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
