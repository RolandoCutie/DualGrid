import mongoose, { Document, Schema } from 'mongoose';

export type BrandingPlanId = 'essential' | 'corporate' | 'global';
export type BrandingQuestionnaireStatus = 'pending' | 'completed';

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
  status: BrandingQuestionnaireStatus;
  answers?: IBrandingAnswers;
  score?: { essential: number; corporate: number; global: number };
  recommendedPlan?: BrandingPlanId;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrandingQuestionnaireSchema = new Schema<IBrandingQuestionnaireDoc>(
  {
    token: { type: String, required: true, unique: true, trim: true },
    clientId: { type: String, trim: true },
    clientName: { type: String, trim: true },
    clientEmail: { type: String, trim: true, lowercase: true },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    answers: {
      type: Schema.Types.Mixed,
      default: null,
    },
    score: {
      type: Schema.Types.Mixed,
      default: null,
    },
    recommendedPlan: {
      type: String,
      enum: ['essential', 'corporate', 'global'],
    },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true },
);

const BrandingQuestionnaire =
  mongoose.models.BrandingQuestionnaire ||
  mongoose.model<IBrandingQuestionnaireDoc>(
    'BrandingQuestionnaire',
    BrandingQuestionnaireSchema,
    'dualgrid_branding_questionnaires',
  );

export default BrandingQuestionnaire;
