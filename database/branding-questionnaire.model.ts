import mongoose, { Document, Schema } from 'mongoose';

export type BrandingPlanId = 'essential' | 'corporate' | 'global';
export type BrandingQuestionnaireStatus = 'pending' | 'completed' | 'contacted';

export interface IBrandingAnswers {
  q1: 'A' | 'B' | 'C';
  q2: 'A' | 'B' | 'C';
  q3: 'A' | 'B' | 'C';
  q4: 'A' | 'B' | 'C';
}

export interface IBrandingQuestionnaireDoc extends Document {
  token: string;
  clientId?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  status: BrandingQuestionnaireStatus;
  answers?: IBrandingAnswers;
  score?: { essential: number; corporate: number; global: number };
  recommendedPlan?: BrandingPlanId;
  adminNotes?: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Explicit sub-schemas for answers and score (#13)
const BrandingAnswersSchema = new Schema(
  {
    q1: { type: String, enum: ['A', 'B', 'C'], required: true },
    q2: { type: String, enum: ['A', 'B', 'C'], required: true },
    q3: { type: String, enum: ['A', 'B', 'C'], required: true },
    q4: { type: String, enum: ['A', 'B', 'C'], required: true },
  },
  { _id: false },
);

const BrandingScoreSchema = new Schema(
  {
    essential: { type: Number, default: 0 },
    corporate: { type: Number, default: 0 },
    global: { type: Number, default: 0 },
  },
  { _id: false },
);

const BrandingQuestionnaireSchema = new Schema<IBrandingQuestionnaireDoc>(
  {
    token: { type: String, required: true, unique: true, trim: true },
    clientId: { type: String, trim: true },
    clientName: { type: String, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true },
    clientPhone: { type: String, trim: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'contacted'],
      default: 'pending',
    },
    answers: {
      type: BrandingAnswersSchema,
      default: null,
    },
    score: {
      type: BrandingScoreSchema,
      default: null,
    },
    recommendedPlan: {
      type: String,
      enum: ['essential', 'corporate', 'global'],
    },
    adminNotes: { type: String, default: '' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Performance indexes — token already indexed via unique:true
BrandingQuestionnaireSchema.index({ status: 1 });
BrandingQuestionnaireSchema.index({ createdAt: -1 });
BrandingQuestionnaireSchema.index({ deletedAt: 1 });

const BrandingQuestionnaire =
  mongoose.models.BrandingQuestionnaire ||
  mongoose.model<IBrandingQuestionnaireDoc>(
    'BrandingQuestionnaire',
    BrandingQuestionnaireSchema,
    'dualgrid_branding_questionnaires',
  );

export default BrandingQuestionnaire;
