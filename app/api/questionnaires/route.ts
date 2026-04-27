import Questionnaire from '@/database/questionnaire.model';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers, recommendedPlan, score } = body;

    if (!answers || !recommendedPlan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();
    const doc = await Questionnaire.create({ answers, recommendedPlan, score: score || {} });

    return NextResponse.json({ id: doc._id.toString() }, { status: 201 });
  } catch (err) {
    console.error('[questionnaires POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
