'use client';

import BrandingQuestionnaireListClient, {
  type BrandingRow,
} from '@/components/admin/BrandingQuestionnaireListClient';
import CreateBrandingAssignmentModal from '@/components/admin/CreateBrandingAssignmentModal';
import { useState } from 'react';

interface Client {
  _id: string;
  name: string;
  email: string;
}

interface BrandingPageClientProps {
  initialRows: BrandingRow[];
  clients: Client[];
  baseUrl: string;
}

export default function BrandingPageClient({
  initialRows,
  clients,
  baseUrl,
}: BrandingPageClientProps) {
  const [rows, setRows] = useState<BrandingRow[]>(initialRows);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreated = (newRow: { _id: string; token: string; clientName?: string }) => {
    setRows((prev) => [
      {
        _id: newRow._id,
        token: newRow.token,
        clientName: newRow.clientName,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
        >
          + Nueva Asignación
        </button>
      </div>

      <BrandingQuestionnaireListClient rows={rows} baseUrl={baseUrl} />

      <CreateBrandingAssignmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        clients={clients}
        baseUrl={baseUrl}
        onCreated={handleCreated}
      />
    </>
  );
}
