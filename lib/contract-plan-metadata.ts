import { PLAN_MAP } from '@/lib/plans';

export const HOSTING_PLAN_IDS = [
  'hosting_annual',
  'hosting_biennial',
  'hosting_triennial',
  'domain',
  'hosting_domain',
] as const;

const HOSTING_PLAN_ID_SET = new Set<string>(HOSTING_PLAN_IDS);

const LEGACY_CONTRACT_PLAN_ID_ALIASES: Record<string, string> = {
  hosting: 'hosting_annual',
  hosting_anual: 'hosting_annual',
  annual: 'hosting_annual',
  hosting_bianual: 'hosting_biennial',
  biennial: 'hosting_biennial',
  hosting_trienal: 'hosting_triennial',
  triennial: 'hosting_triennial',
  domain_only: 'domain',
  dominio: 'domain',
};

const HOSTING_PLAN_QUERY_ID_SET = new Set<string>(HOSTING_PLAN_IDS);

for (const [legacyPlanId, canonicalPlanId] of Object.entries(LEGACY_CONTRACT_PLAN_ID_ALIASES)) {
  if (HOSTING_PLAN_ID_SET.has(canonicalPlanId)) {
    HOSTING_PLAN_QUERY_ID_SET.add(legacyPlanId);
  }
}

export const HOSTING_PLAN_QUERY_IDS = [...HOSTING_PLAN_QUERY_ID_SET];

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

function normalizePlanLookupKey(planId: string): string {
  return planId
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function inferHostingPlanAliasFromLabel(planLookupKey: string): string | null {
  const includesHosting = planLookupKey.includes('hosting');
  const includesDomain = planLookupKey.includes('domain') || planLookupKey.includes('dominio');

  if (includesHosting && includesDomain) return 'hosting_domain';
  if (includesDomain && !includesHosting) return 'domain';
  if (!includesHosting) return null;

  if (planLookupKey.includes('trien')) return 'hosting_triennial';
  if (planLookupKey.includes('bien')) return 'hosting_biennial';
  return 'hosting_annual';
}

export function normalizeContractPlanId(planId: string): string {
  const normalizedPlanKey = normalizePlanLookupKey(planId);
  if (!normalizedPlanKey) return planId;

  if (PLAN_MAP[normalizedPlanKey]) return normalizedPlanKey;
  if (EXTRA_CONTRACT_PLAN_NAMES[normalizedPlanKey]) return normalizedPlanKey;
  if (CONTRACT_PLAN_CATEGORIES[normalizedPlanKey]) return normalizedPlanKey;

  const canonicalPlanId = LEGACY_CONTRACT_PLAN_ID_ALIASES[normalizedPlanKey];
  if (canonicalPlanId) return canonicalPlanId;

  const inferredPlanId = inferHostingPlanAliasFromLabel(normalizedPlanKey);
  if (inferredPlanId) return inferredPlanId;

  return normalizedPlanKey;
}

export function isHostingOrDomainContractPlan(planId: string): boolean {
  const canonicalPlanId = normalizeContractPlanId(planId);
  return HOSTING_PLAN_ID_SET.has(canonicalPlanId);
}

export function getContractPlanName(planId: string): string {
  const canonicalPlanId = normalizeContractPlanId(planId);
  return PLAN_MAP[canonicalPlanId]?.name ?? EXTRA_CONTRACT_PLAN_NAMES[canonicalPlanId] ?? planId;
}

export function getContractPlanCategory(planId: string): string {
  const canonicalPlanId = normalizeContractPlanId(planId);
  return CONTRACT_PLAN_CATEGORIES[canonicalPlanId] ?? 'Otro';
}
