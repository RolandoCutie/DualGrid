export const dynamic = 'force-dynamic';

import Client from '@/database/client.model';
import Contract from '@/database/contract.model';
import Expense from '@/database/expense.model';
import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import { getContractPlanName } from '@/lib/contract-plan-metadata';
import connectDB from '@/lib/mongodb';
import { NextRequest, NextResponse } from 'next/server';

const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 80;
const MAX_RESULTS_PER_GROUP = 6;
const MAX_MATCHING_CLIENTS = 24;

const CONTRACT_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending: 'Pendiente',
  active: 'Activo',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
};

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  software: 'Software',
  hardware: 'Hardware',
  marketing: 'Marketing',
  hosting: 'Hosting',
  domain: 'Dominio',
  tools: 'Herramientas',
  services: 'Servicios externos',
  taxes: 'Impuestos',
  education: 'Educación',
  design: 'Diseño',
  photography: 'Fotografía',
  travel: 'Viajes',
  ads: 'Publicidad',
  licenses: 'Licencias',
  other: 'Otros',
};

interface SearchItem {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  meta?: string;
}

interface SearchResponse {
  query: string;
  results: {
    clients: SearchItem[];
    contracts: SearchItem[];
    invoices: SearchItem[];
    expenses: SearchItem[];
  };
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatCurrency(amount: number) {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(value: unknown) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' });
}

function createEmptyResponse(query: string): SearchResponse {
  return {
    query,
    results: {
      clients: [],
      contracts: [],
      invoices: [],
      expenses: [],
    },
  };
}

function getTextValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_session')?.value;
  if (!token || !isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rawQuery = req.nextUrl.searchParams.get('q') ?? '';
  const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH);
  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json(createEmptyResponse(query));
  }

  try {
    await connectDB();

    const searchRegex = new RegExp(escapeRegex(query), 'i');

    const matchingClients = await Client.find({
      deletedAt: null,
      $or: [
        { name: searchRegex },
        { businessName: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
      ],
    })
      .select('name businessName email phone')
      .sort({ updatedAt: -1 })
      .limit(MAX_MATCHING_CLIENTS)
      .lean();

    const matchingClientIds = matchingClients
      .map((client: Record<string, unknown>) => client._id)
      .filter(Boolean);

    const contractOrFilters: Record<string, unknown>[] = [
      { planId: searchRegex },
      { status: searchRegex },
      { 'services.name': searchRegex },
    ];
    if (matchingClientIds.length > 0) {
      contractOrFilters.unshift({ clientId: { $in: matchingClientIds } });
    }

    const invoiceOrFilters: Record<string, unknown>[] = [
      { invoiceNumber: searchRegex },
      { status: searchRegex },
      { 'items.description': searchRegex },
      { notes: searchRegex },
    ];
    if (matchingClientIds.length > 0) {
      invoiceOrFilters.unshift({ clientId: { $in: matchingClientIds } });
    }

    const expenseOrFilters: Record<string, unknown>[] = [
      { description: searchRegex },
      { category: searchRegex },
      { notes: searchRegex },
    ];
    if (matchingClientIds.length > 0) {
      expenseOrFilters.unshift({ clientId: { $in: matchingClientIds } });
    }

    const [contracts, invoices, expenses] = await Promise.all([
      Contract.find({ deletedAt: null, $or: contractOrFilters })
        .populate('clientId', 'name businessName')
        .sort({ updatedAt: -1 })
        .limit(MAX_RESULTS_PER_GROUP)
        .lean(),
      Invoice.find({ deletedAt: null, $or: invoiceOrFilters })
        .populate('clientId', 'name')
        .sort({ updatedAt: -1 })
        .limit(MAX_RESULTS_PER_GROUP)
        .lean(),
      Expense.find({ deletedAt: null, $or: expenseOrFilters })
        .populate('clientId', 'name')
        .sort({ date: -1 })
        .limit(MAX_RESULTS_PER_GROUP)
        .lean(),
    ]);

    const results: SearchResponse = {
      query,
      results: {
        clients: matchingClients.slice(0, MAX_RESULTS_PER_GROUP).map((client: Record<string, unknown>) => {
          const name = getTextValue(client.name) || 'Cliente sin nombre';
          const businessName = getTextValue(client.businessName);
          const email = getTextValue(client.email);
          const phone = getTextValue(client.phone);

          return {
            id: String(client._id),
            href: `/admin/dashboard/clients/${String(client._id)}/overview`,
            title: name,
            subtitle: [businessName, email].filter(Boolean).join(' · ') || 'Sin datos de contacto',
            meta: phone ? `Tel: ${phone}` : undefined,
          };
        }),
        contracts: contracts.map((contract: Record<string, unknown>) => {
          const client = contract.clientId as Record<string, unknown> | null;
          const clientName = getTextValue(client?.name) || 'Cliente';
          const clientBusiness = getTextValue(client?.businessName);
          const status = getTextValue(contract.status);
          const planId = getTextValue(contract.planId);
          const amount = Number(contract.totalAmount ?? 0);
          const deliveryDate = formatDate(contract.deliveryDate);

          return {
            id: String(contract._id),
            href: `/admin/dashboard/contracts/${String(contract._id)}`,
            title: `${clientName} · ${getContractPlanName(planId || 'custom')}`,
            subtitle: `${CONTRACT_STATUS_LABELS[status] ?? status} · ${formatCurrency(amount)}`,
            meta: [clientBusiness, deliveryDate ? `Entrega ${deliveryDate}` : '']
              .filter(Boolean)
              .join(' · '),
          };
        }),
        invoices: invoices.map((invoice: Record<string, unknown>) => {
          const client = invoice.clientId as Record<string, unknown> | null;
          const clientName = getTextValue(client?.name) || 'Cliente';
          const invoiceNumber = getTextValue(invoice.invoiceNumber) || 'Factura';
          const status = getTextValue(invoice.status);
          const amount = Number(invoice.totalAmount ?? 0);
          const dueDate = formatDate(invoice.dueDate);

          return {
            id: String(invoice._id),
            href: `/admin/dashboard/invoices/${String(invoice._id)}`,
            title: `${invoiceNumber} · ${clientName}`,
            subtitle: `${INVOICE_STATUS_LABELS[status] ?? status} · ${formatCurrency(amount)}`,
            meta: dueDate ? `Vence ${dueDate}` : undefined,
          };
        }),
        expenses: expenses.map((expense: Record<string, unknown>) => {
          const client = expense.clientId as Record<string, unknown> | null;
          const clientName = getTextValue(client?.name);
          const description = getTextValue(expense.description) || 'Gasto';
          const category = getTextValue(expense.category);
          const categoryLabel = EXPENSE_CATEGORY_LABELS[category] || category || 'Sin categoría';
          const amount = Number(expense.amount ?? 0);
          const expenseDate = formatDate(expense.date);

          return {
            id: String(expense._id),
            href: `/admin/dashboard/expenses/${String(expense._id)}`,
            title: description,
            subtitle: `${categoryLabel} · ${formatCurrency(amount)}`,
            meta: [expenseDate ? `Fecha ${expenseDate}` : '', clientName ? `Cliente ${clientName}` : '']
              .filter(Boolean)
              .join(' · '),
          };
        }),
      },
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('[admin/search GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
