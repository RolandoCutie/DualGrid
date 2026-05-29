import type { BrandingPlanId, IBrandingAnswers } from '@/database/branding-questionnaire.model';

const OPTION_MAP: Record<'A' | 'B' | 'C', BrandingPlanId> = {
  A: 'essential',
  B: 'corporate',
  C: 'global',
};

export function calcBrandingScore(answers: IBrandingAnswers): {
  score: { essential: number; corporate: number; global: number };
  recommendedPlan: BrandingPlanId;
} {
  const score = { essential: 0, corporate: 0, global: 0 };

  for (const q of [answers.q1, answers.q2, answers.q3, answers.q4] as const) {
    score[OPTION_MAP[q]]++;
  }

  // Q4 (budget) is a hard filter as per the tarifario spec
  if (answers.q4 === 'A') return { score, recommendedPlan: 'essential' };
  if (answers.q4 === 'C') return { score, recommendedPlan: 'global' };

  // Budget = B → Corporate, unless majority strongly says global
  if (answers.q4 === 'B') {
    const recommendedPlan: BrandingPlanId =
      score.global > score.corporate + score.essential ? 'global' : 'corporate';
    return { score, recommendedPlan };
  }

  // Fallback: majority wins
  if (score.essential > score.corporate && score.essential > score.global) {
    return { score, recommendedPlan: 'essential' };
  }
  if (score.global > score.essential && score.global > score.corporate) {
    return { score, recommendedPlan: 'global' };
  }
  return { score, recommendedPlan: 'corporate' };
}
