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
    primaryGoal: PrimaryGoal | '';
    primaryAction: string;
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
  };
  recommendedPlan: PlanId;
  score: Record<string, number>;
  status: 'new' | 'reviewed' | 'contacted';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionnaireSchema = new Schema<IQuestionnaireDoc>(
  {
    answers: { type: Schema.Types.Mixed, required: true },
    recommendedPlan: {
      type: String,
      enum: ['landing', 'portfolio', 'menu_qr', 'restaurant', 'custom'],
      required: true,
    },
    score: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'contacted'],
      default: 'new',
    },
    adminNotes: { type: String },
  },
  { timestamps: true },
);

const Questionnaire =
  mongoose.models.Questionnaire ||
  mongoose.model<IQuestionnaireDoc>('Questionnaire', QuestionnaireSchema);

export default Questionnaire;
