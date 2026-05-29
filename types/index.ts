// ─── Plans ───────────────────────────────────────────────────────────────────

export type PlanId =
  | 'landing'
  | 'portfolio'
  | 'menu_qr'
  | 'restaurant'
  | 'wp_business'
  | 'ecommerce_store'
  | 'blog'
  | 'custom';

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  price: number;
  currency: string;
  deliveryDays: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel: string;
}

// ─── Questionnaire ────────────────────────────────────────────────────────────

export type BusinessType =
  | 'creative'
  | 'restaurant'
  | 'entrepreneur'
  | 'professional'
  | 'ecommerce'
  | 'blogger'
  | 'other';

export type BudgetRange =
  | 'under_150'
  | '150_300'
  | '300_500'
  | '500_800'
  | '800_1500'
  | 'over_1500';

export type PrimaryGoal =
  | 'more_clients'
  | 'show_work'
  | 'give_info'
  | 'credibility'
  | 'sell_online'
  | 'reservations'
  | 'grow_audience';

export type VisualStyle =
  | 'minimal'
  | 'modern'
  | 'elegant'
  | 'colorful'
  | 'rustic'
  | 'corporate'
  | 'creative'
  | 'vintage'
  | 'fun';

export interface QuestionnaireAnswers {
  // Step 1 – Contact info
  fullName: string;
  businessName: string;
  email: string;
  phone: string;
  referralSource: 'social_media' | 'referral' | 'google' | 'other' | '';

  // Step 2 – Business
  businessType: BusinessType | '';
  businessDescription: string;
  businessAge: 'new' | 'under_1' | '1_3' | '3_5' | 'over_5' | '';
  mainServices: string;
  onlinePresence: 'none' | 'social_only' | 'has_website' | '';
  targetAudience: string;

  // Step 3 – Goals (multi-select up to 3)
  primaryGoal: PrimaryGoal[];
  primaryAction: string[];
  desiredPages: string[];
  specialFeatures: string[];
  differentiation: string;

  // Step 4 – Budget & timing
  budget: BudgetRange | '';
  deadline: string;
  hasDomain: boolean;
  needsCMS: 'frequently' | 'occasionally' | 'no' | '';
  successDefinition: string;

  // Step 5 – Visual style & branding identity
  visualStyle: VisualStyle[];
  hasLogo: boolean | null;
  brandColors: string;
  referenceWebsites: string;
  visualFeeling: string;
  // Branding identity (new)
  brandEssence: string;
  brandValues: string;
  brandNoDos: string;
  logoSpecificElements: string;
  priorBrandPresence: string;
  logoWords: string;
  logoInspiration: string;

  // Step 6 – Content
  hasPhotos: boolean;
  hasTexts: boolean;
  clientContentDeadline: string;
  socialMedia: string;
  siteLanguages: string;
  priorWebExperience: 'yes' | 'no' | '';
  concerns: string;
  extraNotes: string;
}

export interface QuestionnaireResult {
  answers: QuestionnaireAnswers;
  recommendedPlan: PlanId;
  score: Record<PlanId, number>;
  createdAt: string;
}

// ─── Client ──────────────────────────────────────────────────────────────────

export interface IClient {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  businessName?: string;
  businessType?: BusinessType;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Contract ────────────────────────────────────────────────────────────────

export type ContractStatus = 'draft' | 'pending' | 'active' | 'completed' | 'cancelled';

export interface ContractService {
  name: string;
  description: string;
  price: number;
}

export interface IContract {
  _id?: string;
  clientId: string;
  clientName?: string; // populated
  planId: PlanId;
  services: ContractService[];
  totalAmount: number;
  advanceAmount: number;
  paidAmount: number;
  status: ContractStatus;
  startDate: string;
  deliveryDate: string;
  notes?: string;
  signedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Invoice ─────────────────────────────────────────────────────────────────

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'bank_transfer' | 'paypal' | 'card' | 'crypto' | 'other';

export interface IInvoice {
  _id?: string;
  invoiceNumber: string;
  clientId: string;
  clientName?: string; // populated
  contractId?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ─── Questionnaire DB ─────────────────────────────────────────────────────────

export interface IQuestionnaire {
  _id?: string;
  answers: QuestionnaireAnswers;
  recommendedPlan: PlanId;
  score: Record<string, number>;
  status: 'new' | 'reviewed' | 'contacted';
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}
