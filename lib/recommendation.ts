import type { PlanId, QuestionnaireAnswers } from '@/types';

/** Scoring weights for each plan based on questionnaire answers */
export function recommendPlan(answers: QuestionnaireAnswers): {
  recommended: PlanId;
  scores: Record<PlanId, number>;
} {
  const scores: Record<PlanId, number> = {
    landing: 0,
    portfolio: 0,
    menu_qr: 0,
    restaurant: 0,
    custom: 0,
  };

  // ─── Business type signals ─────────────────────────────────────────────────
  if (answers.businessType === 'creative') {
    scores.portfolio += 40;
  }
  if (answers.businessType === 'restaurant') {
    scores.menu_qr += 30;
    scores.restaurant += 40;
  }
  if (answers.businessType === 'entrepreneur') {
    scores.landing += 30;
    scores.portfolio += 10;
  }
  if (answers.businessType === 'professional') {
    scores.landing += 25;
    scores.portfolio += 20;
  }
  if (answers.businessType === 'ecommerce') {
    scores.custom += 35;
    scores.restaurant += 15;
  }

  // ─── Budget signals ────────────────────────────────────────────────────────
  const budgetScores: Record<string, Record<PlanId, number>> = {
    under_150: { landing: 40, menu_qr: 20, portfolio: 0, restaurant: 0, custom: 0 },
    '150_300': { landing: 30, menu_qr: 30, portfolio: 15, restaurant: 0, custom: 0 },
    '300_500': { landing: 10, menu_qr: 15, portfolio: 35, restaurant: 15, custom: 5 },
    '500_800': { landing: 0, menu_qr: 5, portfolio: 20, restaurant: 35, custom: 20 },
    '800_1500': { landing: 0, menu_qr: 0, portfolio: 10, restaurant: 25, custom: 40 },
    over_1500: { landing: 0, menu_qr: 0, portfolio: 5, restaurant: 15, custom: 50 },
  };
  if (answers.budget && budgetScores[answers.budget]) {
    const bs = budgetScores[answers.budget];
    (Object.keys(bs) as PlanId[]).forEach((k) => (scores[k] += bs[k]));
  }

  // ─── Primary goal signals ──────────────────────────────────────────────────
  if (answers.primaryGoal === 'show_work') scores.portfolio += 20;
  if (answers.primaryGoal === 'more_clients') scores.landing += 15;
  if (answers.primaryGoal === 'sell_online') scores.custom += 25;
  if (answers.primaryGoal === 'reservations') scores.restaurant += 20;
  if (answers.primaryGoal === 'credibility') scores.portfolio += 10;

  // ─── Desired pages signals ─────────────────────────────────────────────────
  if (answers.desiredPages.includes('menu')) {
    scores.menu_qr += 15;
    scores.restaurant += 15;
  }
  if (answers.desiredPages.includes('portfolio')) scores.portfolio += 15;
  if (answers.desiredPages.includes('shop')) scores.custom += 20;
  if (answers.desiredPages.includes('reservations')) {
    scores.restaurant += 10;
    scores.custom += 10;
  }

  // ─── Find winner ──────────────────────────────────────────────────────────
  const recommended = (Object.keys(scores) as PlanId[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b,
  );

  return { recommended, scores };
}
