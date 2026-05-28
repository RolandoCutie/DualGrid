'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ConvertToClientButtonProps {
  questionnaireId: string;
  currentStatus: string;
}

export default function ConvertToClientButton({
  questionnaireId,
  currentStatus,
}: ConvertToClientButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const alreadyConverted = currentStatus === 'contacted';

  async function handleConvert() {
    if (!confirm('¿Crear un cliente a partir de este cuestionario?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/questionnaires/${questionnaireId}/convert`, {
        method: 'POST',
      });
      const data = await res.json();

      if (res.status === 409) {
        setError('Ya existe un cliente con este email.');
        return;
      }
      if (!res.ok) {
        setError(data.error || 'Error al crear el cliente.');
        return;
      }

      router.push(`/admin/dashboard/clients`);
      router.refresh();
    } catch {
      setError('Error de red. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-3">
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleConvert}
        disabled={loading || alreadyConverted}
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-5 py-2 rounded-xl transition-colors text-sm"
      >
        {loading
          ? 'Creando cliente…'
          : alreadyConverted
            ? '✓ Ya convertido a cliente'
            : '👤 Convertir en cliente'}
      </button>
      {!alreadyConverted && (
        <p className="text-xs text-muted-foreground mt-1.5">
          Crea automáticamente un registro de cliente con los datos del cuestionario y marca el lead
          como contactado.
        </p>
      )}
    </div>
  );
}
