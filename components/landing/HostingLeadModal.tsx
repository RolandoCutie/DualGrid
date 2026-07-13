'use client';

import { useLanguage } from '@/components/ui/LanguageProvider';
import Modal from '@/components/ui/Modal';
import { useEffect, useState } from 'react';

type HostingPlanId = 'annual' | 'biennial' | 'triennial' | 'domain_only' | 'hosting_domain';

const PLAN_LABELS: Record<HostingPlanId, string> = {
  annual: 'Hosting Anual – $120 USD',
  biennial: 'Hosting Bianual – $110 USD/año',
  triennial: 'Hosting Trienal – $100 USD/año',
  domain_only: 'Solo dominio – $25 USD/año',
  hosting_domain: 'Hosting + Dominio',
};

interface Props {
  open: boolean;
  initialPlan: HostingPlanId | null;
  onClose: () => void;
}

export default function HostingLeadModal({ open, initialPlan, onClose }: Props) {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasWebsite, setHasWebsite] = useState<boolean | null>(null);
  const [hasDomain, setHasDomain] = useState<boolean | null>(null);
  const [planId, setPlanId] = useState<HostingPlanId>(initialPlan ?? 'annual');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Sync planId only when the modal opens (or when a different plan is clicked from outside)
  // This allows the user to freely change the plan inside the modal without it resetting.
  useEffect(() => {
    if (open && initialPlan) {
      setPlanId(initialPlan);
    }
  }, [open, initialPlan]);

  const reset = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setHasWebsite(null);
    setHasDomain(null);
    setPlanId(initialPlan ?? 'annual');
    setNotes('');
    setSubmitting(false);
    setDone(false);
    setError('');
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasWebsite === null || hasDomain === null) {
      setError('Por favor responde todas las preguntas.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/hosting-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, hasWebsite, hasDomain, planId, notes }),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setDone(true);
    } catch {
      setError('Hubo un problema al enviar. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <div className="p-6 sm:p-8">
        {done ? (
          /* ── Success screen ── */
          <div className="text-center py-6">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              ¡Listo!
            </p>
            <h2 className="text-xl font-bold text-card-foreground mb-2">¡Solicitud recibida!</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Te contactaremos en menos de 24 horas para coordinar los detalles de tu plan de
              hosting.
            </p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              Perfecto, gracias
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  🌐 Servicio de Hosting
                </p>
                <h2 className="text-xl font-bold text-card-foreground mt-1">
                  Solicitar información
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Completa estos datos y te contactamos en menos de 24 horas.
                </p>
              </div>
            </div>

            {/* Plan selector */}
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-2 uppercase tracking-wide">
                Plan de interés
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(PLAN_LABELS) as HostingPlanId[]).map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPlanId(id)}
                    className={`text-left px-3 py-2.5 rounded-xl border-2 text-xs font-medium transition-all duration-200 ${
                      planId === id
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50'
                    }`}
                  >
                    {PLAN_LABELS[id]}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-card-foreground mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="Juan García"
                  className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-card-foreground mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="juan@ejemplo.com"
                  className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-card-foreground mb-1">
                  WhatsApp / Teléfono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 809 000 0000"
                  className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Binary questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Has website? */}
              <div>
                <p className="text-xs font-medium text-card-foreground mb-2">
                  ¿Ya tienes un sitio web?
                </p>
                <div className="flex gap-2">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setHasWebsite(val)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                        hasWebsite === val
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50'
                      }`}
                    >
                      {val ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>
                {hasWebsite === true && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Podemos migrar tu web actual sin costo.
                  </p>
                )}
              </div>

              {/* Has domain? */}
              <div>
                <p className="text-xs font-medium text-card-foreground mb-2">
                  ¿Ya tienes un dominio?
                </p>
                <div className="flex gap-2">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      type="button"
                      onClick={() => setHasDomain(val)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                        hasDomain === val
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/50'
                      }`}
                    >
                      {val ? 'Sí' : 'No'}
                    </button>
                  ))}
                </div>
                {hasDomain === false && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Te ayudamos a registrar el dominio ideal.
                  </p>
                )}
              </div>
            </div>

            {/* Optional notes */}
            <div>
              <label className="block text-xs font-medium text-card-foreground mb-1">
                ¿Algo que quieras comentarnos? (opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Nombre de dominio actual, tipo de sitio, dudas..."
                className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
              >
                {submitting ? 'Enviando…' : 'Solicitar información'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border-2 border-border text-sm font-medium text-muted-foreground hover:border-primary/50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
