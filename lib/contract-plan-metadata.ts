import { PLAN_MAP } from '@/lib/plans';

export const HOSTING_PLAN_IDS = [
  'hosting_annual',
  'hosting_biennial',
  'hosting_triennial',
  'domain',
  'hosting_domain',
] as const;

const EXTRA_CONTRACT_PLAN_NAMES: Record<string, string> = {
  essential: 'Branding Essential',
  corporate: 'Branding Corporate',
  global: 'Branding Global',
  hosting_annual: 'Hosting Anual',
  hosting_biennial: 'Hosting Bianual',
  hosting_triennial: 'Hosting Trienal',
  domain: 'Dominio',
  hosting_domain: 'Hosting + Dominio',
  custom_design: 'Diseño Personalizado',
};

const CONTRACT_PLAN_CATEGORIES: Record<string, string> = {
  landing: 'Web',
  portfolio: 'Web',
  menu_qr: 'Web',
  restaurant: 'Web',
  wp_business: 'Web',
  ecommerce_store: 'Web',
  blog: 'Web',
  custom: 'Web',
  essential: 'Branding',
  corporate: 'Branding',
  global: 'Branding',
  hosting_annual: 'Hosting',
  hosting_biennial: 'Hosting',
  hosting_triennial: 'Hosting',
  domain: 'Dominio',
  hosting_domain: 'Hosting',
  custom_design: 'Diseño',
};

export function getContractPlanName(planId: string): string {
  return PLAN_MAP[planId]?.name ?? EXTRA_CONTRACT_PLAN_NAMES[planId] ?? planId;
}

export function getContractPlanCategory(planId: string): string {
  return CONTRACT_PLAN_CATEGORIES[planId] ?? 'Otro';
}
