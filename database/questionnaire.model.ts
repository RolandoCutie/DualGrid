import type { BudgetRange, BusinessType, PlanId, PrimaryGoal, VisualStyle } from '@/types';
import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestionnaireDoc extends Document {
  answers: {
    fullName: string;
    businessName: string;
    email: string;
    phone: string;
    businessType: BusinessType | '';
    businessDescription: string;
    onlinePresence: 'none' | 'social_only' | 'has_website' | '';
    primaryGoal: PrimaryGoal[] | PrimaryGoal | ''; // array (new) or legacy string
    primaryAction: string[];
    desiredPages: string[];
    budget: BudgetRange | '';
    deadline: string;
    hasDomain: boolean;
    visualStyle: VisualStyle[];
    hasLogo: boolean;
    brandColors: string;
    referenceWebsites: string;
    hasPhotos: boolean;
    hasTexts: boolean;
    extraNotes: string;
    // Additional fields stored via Mixed schema
    referralSource?: string;
    businessAge?: string;
    mainServices?: string;
    targetAudience?: string;
    differentiation?: string;
    needsCMS?: string;
    successDefinition?: string;
    visualFeeling?: string;
    socialMedia?: string;
    siteLanguages?: string;
    priorWebExperience?: string;
    concerns?: string;
    specialFeatures?: string[];
    // Branding identity fields
    brandEssence?: string;
    brandValues?: string;
    brandNoDos?: string;
    logoSpecificElements?: string;
    priorBrandPresence?: string;
    logoWords?: string;
    logoInspiration?: string;
    // Content timeline
    clientContentDeadline?: string;
  };
  recommendedPlan: PlanId;
  selectedPlan?: PlanId | null;
  score: Record<string, number>;
  status: 'new' | 'reviewed' | 'contacted';
  adminNotes?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Explicit schema for the plan scoring object (#13)
const ScoreSchema = new Schema(
  {
    landing: { type: Number, default: 0 },
    portfolio: { type: Number, default: 0 },
    menu_qr: { type: Number, default: 0 },
    restaurant: { type: Number, default: 0 },
    wp_business: { type: Number, default: 0 },
    ecommerce_store: { type: Number, default: 0 },
    blog: { type: Number, default: 0 },
    custom: { type: Number, default: 0 },
  },
  { _id: false },
);

const QuestionnaireSchema = new Schema<IQuestionnaireDoc>(
  {
    answers: { type: Schema.Types.Mixed, required: true },
    recommendedPlan: {
      type: String,
      enum: [
        'landing',
        'portfolio',
        'menu_qr',
        'restaurant',
        'wp_business',
        'ecommerce_store',
        'blog',
        'custom',
      ],
      required: true,
    },
    selectedPlan: {
      type: String,
      enum: [
        'landing',
        'portfolio',
        'menu_qr',
        'restaurant',
        'wp_business',
        'ecommerce_store',
        'blog',
        'custom',
        null,
      ],
      default: null,
    },
    score: { type: ScoreSchema, default: {} },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'contacted'],
      default: 'new',
    },
    adminNotes: { type: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Performance indexes
QuestionnaireSchema.index({ status: 1 });
QuestionnaireSchema.index({ createdAt: -1 });
QuestionnaireSchema.index({ deletedAt: 1 });

const Questionnaire =
  mongoose.models.Questionnaire ||
  mongoose.model<IQuestionnaireDoc>(
    'Questionnaire',
    QuestionnaireSchema,
    'dualgrid_questionnaires',
  );

export default Questionnaire;
