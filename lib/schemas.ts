/**
 * Zod validation schemas for every API route.
 * Import the schema you need directly in the route file.
 */
import { z } from 'zod';

// ─── Shared building blocks ───────────────────────────────────────────────────

const mongoId = z.string().length(24, 'ID inválido');
const isoDate = z.string().min(1, 'Fecha requerida');
const currencyEnum = z.enum(['USD', 'EUR', 'CUP', 'CAD', 'MXN', 'GBP', 'OTHER']).default('USD');

// ─── Client ──────────────────────────────────────────────────────────────────

export const ClientCreateSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(200),
  email: z.string().email('Email inválido'),
  phone: z.string().max(30).optional().default(''),
  businessName: z.string().max(200).optional(),
  businessType: z
    .enum(['creative', 'restaurant', 'entrepreneur', 'professional', 'ecommerce', 'other'])
    .optional(),
  notes: z.string().max(2000).optional(),
});

export const ClientPatchSchema = ClientCreateSchema.partial();

// ─── Contract ────────────────────────────────────────────────────────────────

const ServiceRowSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  price: z.number().min(0),
});

export const ContractCreateSchema = z.object({
  clientId: mongoId,
  planId: z.enum([
    'landing',
    'portfolio',
    'menu_qr',
    'restaurant',
    'wp_business',
    'ecommerce_store',
    'blog',
    'custom',
    'essential',
    'corporate',
    'global',
  ]),
  services: z.array(ServiceRowSchema).default([]),
  totalAmount: z.number().min(0),
  advanceAmount: z.number().min(0),
  paidAmount: z.number().min(0).optional().default(0),
  status: z
    .enum(['draft', 'pending', 'active', 'completed', 'cancelled'])
    .optional()
    .default('draft'),
  startDate: isoDate,
  deliveryDate: isoDate,
  revisionsIncluded: z.number().min(0).optional().default(0),
  revisionsUsed: z.number().min(0).optional().default(0),
  excludedItems: z.array(z.string()).optional().default([]),
  contractTerms: z.string().optional(),
  notes: z.string().max(3000).optional(),
  signedAt: z.string().optional(),
  currency: currencyEnum,
});

export const ContractPatchSchema = ContractCreateSchema.partial();

// ─── Invoice ─────────────────────────────────────────────────────────────────

const InvoiceItemSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  total: z.number().min(0),
});

export const InvoiceCreateSchema = z.object({
  clientId: mongoId,
  contractId: mongoId.optional(),
  items: z.array(InvoiceItemSchema).min(1, 'Al menos un ítem es requerido'),
  subtotal: z.number().min(0),
  taxRate: z.number().min(0).max(100).optional().default(0),
  taxAmount: z.number().min(0).optional().default(0),
  totalAmount: z.number().min(0),
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']).optional().default('draft'),
  issueDate: isoDate,
  dueDate: isoDate,
  paidAt: z.string().optional(),
  paymentMethod: z.enum(['cash', 'bank_transfer', 'paypal', 'card', 'crypto', 'other']).optional(),
  notes: z.string().max(2000).optional(),
  currency: currencyEnum,
});

export const InvoicePatchSchema = InvoiceCreateSchema.partial();

// ─── Expense ─────────────────────────────────────────────────────────────────

export const ExpenseCreateSchema = z.object({
  description: z.string().min(1, 'La descripción es requerida').max(500),
  amount: z.number().min(0, 'El monto debe ser mayor a 0'),
  category: z.enum([
    'software',
    'hardware',
    'marketing',
    'hosting',
    'tools',
    'services',
    'taxes',
    'education',
    'other',
  ]),
  date: isoDate,
  notes: z.string().max(1000).optional(),
  currency: currencyEnum,
});

export const ExpensePatchSchema = ExpenseCreateSchema.partial();

// ─── Questionnaire (status update only) ──────────────────────────────────────

export const QuestionnairePatchSchema = z.object({
  status: z.enum(['new', 'reviewed', 'contacted']).optional(),
  adminNotes: z.string().max(3000).optional(),
});

// ─── Questionnaire public submission ─────────────────────────────────────────

export const QuestionnaireSubmitSchema = z.object({
  answers: z
    .object({
      fullName: z.string().min(1, 'El nombre es requerido').max(200),
      email: z.string().email('Email inválido'),
      phone: z.string().max(30).optional().default(''),
      businessName: z.string().max(200).optional().default(''),
    })
    .passthrough(), // allow extra answer fields
  recommendedPlan: z.enum([
    'landing',
    'portfolio',
    'menu_qr',
    'restaurant',
    'wp_business',
    'ecommerce_store',
    'blog',
    'custom',
  ]),
  selectedPlan: z
    .enum([
      'landing',
      'portfolio',
      'menu_qr',
      'restaurant',
      'wp_business',
      'ecommerce_store',
      'blog',
      'custom',
    ])
    .nullable()
    .optional(),
  score: z.record(z.string(), z.number()).optional().default({}),
});
