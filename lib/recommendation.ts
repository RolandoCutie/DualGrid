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
    wp_business: 0,
    ecommerce_store: 0,
    blog: 0,
    custom: 0,
  };

  // ─── Business type signals ─────────────────────────────────────────────────
  if (answers.businessType === 'creative') {
    scores.portfolio += 40;
    scores.blog += 10;
  }
  if (answers.businessType === 'restaurant') {
    scores.menu_qr += 30;
    scores.restaurant += 40;
  }
  if (answers.businessType === 'entrepreneur') {
    scores.landing += 20;
    scores.wp_business += 25;
    scores.portfolio += 10;
  }
  if (answers.businessType === 'professional') {
    scores.landing += 15;
    scores.wp_business += 35;
    scores.portfolio += 15;
  }
  if (answers.businessType === 'ecommerce') {
    scores.custom += 25;
    scores.ecommerce_store += 45;
    scores.restaurant += 10;
  }
  if (answers.businessType === 'blogger') {
    scores.blog += 50;
    scores.portfolio += 15;
  }
  if (answers.businessType === 'other') {
    scores.wp_business += 20;
    scores.landing += 10;
    scores.custom += 15;
  }

  // ─── Budget × business type coherence ─────────────────────────────────────
  // Restaurant with very low budget → steer toward QR menu (most affordable)
  if (
    answers.businessType === 'restaurant' &&
    (answers.budget === 'under_150' || answers.budget === '150_300')
  ) {
    scores.menu_qr += 25;
    scores.restaurant -= 15;
  }
  // Ecommerce with top budget → custom project makes more sense
  if (answers.businessType === 'ecommerce' && answers.budget === 'over_1500') {
    scores.custom += 20;
  }

  // ─── Budget signals ────────────────────────────────────────────────────────
  const budgetScores: Record<string, Record<PlanId, number>> = {
    under_150: {
      landing: 40,
      menu_qr: 20,
      portfolio: 0,
      restaurant: 0,
      wp_business: 0,
      ecommerce_store: 0,
      blog: 10,
      custom: 0,
    },
    '150_300': {
      landing: 30,
      menu_qr: 30,
      portfolio: 15,
      restaurant: 0,
      wp_business: 0,
      ecommerce_store: 0,
      blog: 20,
      custom: 0,
    },
    '300_500': {
      landing: 10,
      menu_qr: 15,
      portfolio: 35,
      restaurant: 10,
      wp_business: 10,
      ecommerce_store: 5,
      blog: 30,
      custom: 5,
    },
    '500_800': {
      landing: 0,
      menu_qr: 5,
      portfolio: 15,
      restaurant: 25,
      wp_business: 35,
      ecommerce_store: 30,
      blog: 10,
      custom: 10,
    },
    '800_1500': {
      landing: 0,
      menu_qr: 0,
      portfolio: 10,
      restaurant: 20,
      wp_business: 15,
      ecommerce_store: 25,
      blog: 5,
      custom: 40,
    },
    over_1500: {
      landing: 0,
      menu_qr: 0,
      portfolio: 5,
      restaurant: 15,
      wp_business: 5,
      ecommerce_store: 15,
      blog: 0,
      custom: 50,
    },
  };
  if (answers.budget && budgetScores[answers.budget]) {
    const bs = budgetScores[answers.budget];
    (Object.keys(bs) as PlanId[]).forEach((k) => (scores[k] += bs[k]));
  }

  // ─── Primary goal signals ──────────────────────────────────────────────────
  for (const goal of answers.primaryGoal) {
    if (goal === 'show_work') scores.portfolio += 20;
    if (goal === 'more_clients') {
      scores.landing += 15;
      scores.wp_business += 10;
    }
    if (goal === 'give_info') scores.wp_business += 25;
    if (goal === 'sell_online') {
      scores.ecommerce_store += 35;
      scores.custom += 15;
    }
    if (goal === 'reservations') scores.restaurant += 20;
    if (goal === 'credibility') scores.portfolio += 10;
    if (goal === 'grow_audience') {
      scores.blog += 40;
      scores.portfolio += 10;
    }
  }

  // ─── Desired pages signals ─────────────────────────────────────────────────
  if (answers.desiredPages.includes('menu')) {
    scores.menu_qr += 15;
    scores.restaurant += 15;
  }
  if (answers.desiredPages.includes('portfolio')) scores.portfolio += 15;
  if (answers.desiredPages.includes('services')) {
    scores.wp_business += 15;
    scores.landing += 5;
  }
  if (answers.desiredPages.includes('about')) scores.wp_business += 10;
  if (answers.desiredPages.includes('shop')) {
    scores.ecommerce_store += 30;
    scores.custom += 10;
  }
  if (answers.desiredPages.includes('reservations')) {
    scores.restaurant += 10;
    scores.custom += 10;
  }
  if (answers.desiredPages.includes('blog')) {
    scores.blog += 25;
    scores.wp_business += 5;
  }
  if (answers.desiredPages.includes('pricing')) {
    scores.landing += 10;
    scores.wp_business += 5;
  }
  if (answers.desiredPages.includes('testimonials')) {
    scores.portfolio += 5;
    scores.wp_business += 5;
    scores.landing += 5;
  }
  if (answers.desiredPages.includes('location')) {
    scores.restaurant += 10;
    scores.wp_business += 5;
  }
  if (answers.desiredPages.includes('faq')) {
    scores.wp_business += 10;
    scores.landing += 5;
  }
  if (answers.desiredPages.includes('contact')) {
    scores.wp_business += 5;
    scores.landing += 5;
  }

  // ─── Special features signals ──────────────────────────────────────────────
  if (answers.specialFeatures.includes('booking')) {
    scores.restaurant += 20;
    scores.wp_business += 10;
    scores.custom += 10;
  }
  if (answers.specialFeatures.includes('newsletter')) {
    scores.blog += 20;
    scores.wp_business += 10;
  }
  if (answers.specialFeatures.includes('multilang')) {
    scores.custom += 25;
    scores.wp_business += 10;
  }
  if (answers.specialFeatures.includes('live_chat')) {
    scores.wp_business += 10;
    scores.custom += 15;
  }
  if (answers.specialFeatures.includes('map')) {
    scores.restaurant += 10;
    scores.wp_business += 5;
  }
  if (answers.specialFeatures.includes('social_feed')) {
    scores.blog += 10;
    scores.portfolio += 10;
    scores.wp_business += 5;
  }
  if (answers.specialFeatures.includes('gallery')) {
    scores.portfolio += 15;
    scores.restaurant += 10;
    scores.blog += 5;
  }
  if (answers.specialFeatures.includes('video_banner')) {
    scores.portfolio += 10;
    scores.landing += 5;
    scores.restaurant += 5;
  }
  if (answers.specialFeatures.includes('faq')) {
    scores.wp_business += 10;
    scores.landing += 5;
  }
  if (answers.specialFeatures.includes('reviews')) {
    scores.portfolio += 10;
    scores.wp_business += 5;
    scores.landing += 5;
  }
  if (answers.specialFeatures.includes('whatsapp_btn')) {
    scores.landing += 10;
    scores.restaurant += 5;
    scores.wp_business += 5;
  }
  if (answers.specialFeatures.includes('contact_form')) {
    scores.wp_business += 5;
    scores.landing += 5;
  }

  // ─── Primary action signals ───────────────────────────────────────────────
  if (answers.primaryAction.includes('whatsapp_contact')) {
    scores.landing += 15;
    scores.restaurant += 10;
    scores.wp_business += 5;
  }
  if (answers.primaryAction.includes('contact_form')) {
    scores.wp_business += 10;
    scores.landing += 5;
  }
  if (answers.primaryAction.includes('call')) {
    scores.landing += 15;
    scores.wp_business += 10;
  }
  if (answers.primaryAction.includes('book_appointment')) {
    scores.restaurant += 15;
    scores.custom += 10;
    scores.wp_business += 5;
  }
  if (answers.primaryAction.includes('buy_product')) {
    scores.ecommerce_store += 30;
    scores.custom += 10;
  }
  if (answers.primaryAction.includes('view_portfolio')) {
    scores.portfolio += 20;
  }
  if (answers.primaryAction.includes('download')) {
    scores.landing += 10;
    scores.wp_business += 5;
    scores.restaurant += 5;
  }
  if (answers.primaryAction.includes('request_quote')) {
    scores.wp_business += 15;
    scores.landing += 10;
    scores.custom += 10;
  }
  if (answers.primaryAction.includes('subscribe')) {
    scores.blog += 20;
    scores.wp_business += 5;
  }

  // ─── Business age signals ─────────────────────────────────────────────────
  if (answers.businessAge === 'new' || answers.businessAge === 'under_1') {
    scores.landing += 15;
    scores.menu_qr += 5;
  }
  if (answers.businessAge === 'over_5') {
    scores.wp_business += 10;
    scores.custom += 5;
  }

  // ─── Site language signals ────────────────────────────────────────────────
  if (answers.siteLanguages === 'both') {
    scores.custom += 20;
    scores.wp_business += 10;
  }

  // ─── CMS need signals ─────────────────────────────────────────────────────
  if (answers.needsCMS === 'frequently') {
    scores.menu_qr += 15;
    scores.restaurant += 10;
    scores.wp_business += 15;
    scores.blog += 10;
  }
  if (answers.needsCMS === 'occasionally') {
    scores.wp_business += 5;
    scores.restaurant += 5;
  }

  // ─── Find winner ──────────────────────────────────────────────────────────
  const recommended = (Object.keys(scores) as PlanId[]).reduce((a, b) =>
    scores[a] >= scores[b] ? a : b,
  );

  return { recommended, scores };
}
