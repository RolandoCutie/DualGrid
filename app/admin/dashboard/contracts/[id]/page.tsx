import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import ContractForm from '@/components/admin/ContractForm';
import Client from '@/database/client.model';
import Contract from '@/database/contract.model';
import connectDB from '@/lib/mongodb';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Editar contrato' };

export default async function EditContractPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
}) {
  await requireAdminSession();
  const { id } = await params;
  const { back } = await searchParams;

  // Guard against non-ObjectId segments (e.g. static asset requests like logo.png)
  if (!/^[0-9a-fA-F]{24}$/.test(id)) notFound();

  await connectDB();

  const [contract, clients] = await Promise.all([
    Contract.findById(id).lean(),
    Client.find({}).sort({ name: 1 }).lean(),
  ]);

  if (!contract) notFound();

  return (
    <AdminPageLayout maxWidth="5xl">
      <AdminBackButton href={back ?? '/admin/dashboard/contracts'} label="Volver" />
      <div className="flex items-center justify-between mb-0">
        <AdminPageHeader title="Editar contrato" />
        <Link
          href={`/api/contracts/${id}/pdf`}
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
      <ContractForm
        contractId={id}
        clients={clients.map((c) => ({
          _id: c._id.toString(),
          name: c.name,
          businessName: c.businessName ?? undefined,
        }))}
        defaultValues={{
          clientId: contract.clientId.toString(),
          planId: contract.planId,
          services: (
            contract.services as Array<{ name: string; description: string; price: number }>
          ).map((s) => ({
            name: s.name,
            description: s.description,
            price: String(s.price),
          })),
          totalAmount: contract.totalAmount,
          advanceAmount: contract.advanceAmount,
          status: contract.status,
          startDate: contract.startDate.toISOString(),
          deliveryDate: contract.deliveryDate.toISOString(),
          revisionsIncluded: contract.revisionsIncluded,
          revisionsUsed: contract.revisionsUsed,
          excludedItems: (contract.excludedItems as string[] | undefined) ?? [],
          contractTerms: (contract.contractTerms as string | undefined) ?? '',
          notes: contract.notes ?? '',
        }}
      />
    </AdminPageLayout>
  );
}
