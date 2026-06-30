import mongoose, { Document, Schema } from 'mongoose';

export type ExpenseCategory =
  | 'software'
  | 'hardware'
  | 'marketing'
  | 'hosting'
  | 'tools'
  | 'services'
  | 'taxes'
  | 'education'
  | 'other';

export interface IExpenseDoc extends Document {
  description: string;
  amount: number;
  category: ExpenseCategory;
  date: Date;
  notes?: string;
  currency: string;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSchema = new Schema<IExpenseDoc>(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        'software',
        'hardware',
        'marketing',
        'hosting',
        'tools',
        'services',
        'taxes',
        'education',
        'other',
      ],
      default: 'other',
    },
    date: { type: Date, required: true },
    notes: { type: String, trim: true },
    currency: { type: String, default: 'USD' },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// Performance indexes
ExpenseSchema.index({ date: -1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ deletedAt: 1 });

const Expense = mongoose.models.Expense ?? mongoose.model<IExpenseDoc>('Expense', ExpenseSchema);
export default Expense;
