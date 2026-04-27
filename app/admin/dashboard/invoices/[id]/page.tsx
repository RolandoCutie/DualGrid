import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import InvoiceForm from '@/components/admin/InvoiceForm';
import Client from '@/database/client.model';
import Invoice from '@/database/invoice.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Editar factura' };

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  await connectDB();

  const [invoice, clients] = await Promise.all([
    Invoice.findById(id).lean(),
    Client.find({}).sort({ name: 1 }).lean(),
  ]);

  if (!invoice) notFound();

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href="/admin/dashboard/invoices" />
      <div className="flex items-center justify-between">
        <AdminPageHeader
          title={`Factura ${invoice.invoiceNumber}`}
          description={`Estado: ${invoice.status}`}
        />
        <Link
          href={`/api/invoices/${id}/pdf`}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-card-foreground hover:bg-muted/50 transition-colors mb-8"
          target="_blank"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          Descargar PDF
        </Link>
      </div>
      <InvoiceForm
        invoiceId={id}
        clients={clients.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          businessName: c.businessName ?? undefined,
        }))}
        defaultValues={{
          clientId: invoice.clientId.toString(),
          status: invoice.status,
          items: (
            invoice.items as Array<{ description: string; quantity: number; unitPrice: number }>
          ).map((it) => ({
            description: it.description,
            quantity: String(it.quantity),
            unitPrice: String(it.unitPrice),
          })),
          taxRate: invoice.taxRate,
          issueDate: invoice.issueDate.toISOString(),
          dueDate: invoice.dueDate.toISOString(),
          notes: invoice.notes ?? '',
        }}
      />
    </AdminPageLayout>
  );
}
