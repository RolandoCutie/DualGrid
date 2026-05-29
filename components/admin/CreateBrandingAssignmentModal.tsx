'use client';

import Modal from '@/components/ui/Modal';
import { useState } from 'react';

interface Client {
  _id: string;
  name: string;
  email: string;
}

interface CreateBrandingAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  clients: Client[];
  baseUrl: string;
  onCreated: (row: { _id: string; token: string; clientName?: string }) => void;
}

export default function CreateBrandingAssignmentModal({
  open,
  onClose,
  clients,
  baseUrl,
  onCreated,
}: CreateBrandingAssignmentModalProps) {
  const [mode, setMode] = useState<'client' | 'manual'>('client');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Created state
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [createdName, setCreatedName] = useState('');
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setMode('client');
    setSelectedClientId('');
    setManualName('');
    setManualEmail('');
    setLoading(false);
    setError('');
    setCreatedToken(null);
    setCreatedName('');
    setCopied(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setError('');
    let clientId: string | undefined;
    let clientName: string | undefined;
    let clientEmail: string | undefined;

    if (mode === 'client') {
      if (!selectedClientId) {
        setError('Selecciona un cliente.');
        return;
      }
      const found = clients.find((c) => c._id === selectedClientId);
      clientId = found?._id;
      clientName = found?.name;
      clientEmail = found?.email;
    } else {
      if (!manualName.trim()) {
        setError('Ingresa el nombre del destinatario.');
        return;
      }
      clientName = manualName.trim();
      clientEmail = manualEmail.trim() || undefined;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/branding-questionnaires', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientName, clientEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al crear');

      setCreatedToken(data.token);
      setCreatedName(clientName ?? '');
      onCreated({ _id: data.id, token: data.token, clientName });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const link = createdToken ? `${baseUrl}/branding/${createdToken}` : '';

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendWhatsApp = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
    const msg = encodeURIComponent(
      `Hola ${createdName ? createdName + '!' : '!'} 👋 Te comparto el siguiente enlace para que completes el test de identidad visual de DualGrid Studio. Solo son 4 preguntas rápidas y al final verás el plan de branding que mejor se adapta a tu proyecto 🎨\n\n${link}`,
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <div className="p-6">
        {!createdToken ? (
          <>
            <h2 className="text-lg font-bold text-foreground mb-1">Nueva Asignación de Branding</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Genera un enlace único del test de identidad visual para enviárselo a un cliente.
            </p>

            {/* Mode tabs */}
            <div className="flex gap-2 mb-5">
              <button
                onClick={() => setMode('client')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  mode === 'client'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                Cliente existente
              </button>
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  mode === 'manual'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary/50'
                }`}
              >
                Datos manuales
              </button>
            </div>

            {mode === 'client' ? (
              <div className="mb-5">
                <label className="block text-sm font-medium text-foreground mb-1">
                  Seleccionar cliente
                </label>
                <select
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Elige un cliente --</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.email ? `(${c.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Nombre del destinatario"
                    className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Email (opcional)
                  </label>
                  <input
                    type="email"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    placeholder="email@ejemplo.com"
                    className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {error && <p className="text-destructive text-sm mb-3">{error}</p>}

            <div className="flex gap-2">
              <button
                onClick={handleClose}
                className="flex-1 py-2 text-sm font-medium rounded-lg border border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {loading ? 'Creando...' : 'Generar enlace'}
              </button>
            </div>
          </>
        ) : (
          /* ── Success: show link ─────────────────────────────────────────── */
          <>
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🎉</div>
              <h2 className="text-lg font-bold text-foreground mb-1">
                ¡Enlace generado para {createdName}!
              </h2>
              <p className="text-sm text-muted-foreground">
                Comparte este enlace con el cliente. Solo pueden llenarlo una vez.
              </p>
            </div>

            <div className="bg-muted rounded-lg px-3 py-2 text-xs text-muted-foreground break-all mb-4 font-mono">
              {link}
            </div>

            <div className="space-y-2">
              <button
                onClick={copyLink}
                className="w-full py-2.5 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted transition-colors"
              >
                {copied ? '✓ Enlace copiado' : '🔗 Copiar enlace'}
              </button>
              <button
                onClick={sendWhatsApp}
                className="w-full py-2.5 text-sm font-semibold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              >
                📲 Enviar por WhatsApp
              </button>
              <button
                onClick={handleClose}
                className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cerrar
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
