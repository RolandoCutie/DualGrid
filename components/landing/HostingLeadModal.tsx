'use client';

import Modal from '@/components/ui/Modal';
import { useLanguage } from '@/components/ui/LanguageProvider';
import { useEffect, useState } from 'react';

type HostingPlanId = 'annual' | 'biennial' | 'triennial' | 'domain_only' | 'hosting_domain';

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

  const planLabels: Record<HostingPlanId, string> = {
    annual: t('hosting_modal.plan_annual'),
    biennial: t('hosting_modal.plan_biennial'),
    triennial: t('hosting_modal.plan_triennial'),
    domain_only: t('hosting_modal.plan_domain_only'),
    hosting_domain: t('hosting_modal.plan_hosting_domain'),
  };

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
      setError(t('hosting_modal.error_required'));
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
      setError(t('hosting_modal.error_submit'));
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
              {t('hosting_modal.done_badge')}
            </p>
            <h2 className="text-xl font-bold text-card-foreground mb-2">
              {t('hosting_modal.done_title')}
            </h2>
            <p className="text-muted-foreground text-sm mb-6">{t('hosting_modal.done_body')}</p>
            <button
              onClick={handleClose}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}
            >
              {t('hosting_modal.done_button')}
            </button>
          </div>
        ) : (
          /* ── Form ── */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                  {t('hosting_modal.badge_title')}
                </p>
                <h2 className="text-xl font-bold text-card-foreground mt-1">
                  {t('hosting_modal.title')}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t('hosting_modal.subtitle')}
                </p>
              </div>
            </div>

            {/* Plan selector */}
            <div>
              <label className="block text-xs font-semibold text-card-foreground mb-2 uppercase tracking-wide">
                {t('hosting_modal.plan_label')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(planLabels) as HostingPlanId[]).map((id) => (
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
                    {planLabels[id]}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-card-foreground mb-1">
                  {t('hosting_modal.name_label')} *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder={t('hosting_modal.name_placeholder')}
                  className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-card-foreground mb-1">
                  {t('hosting_modal.email_label')} *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={t('hosting_modal.email_placeholder')}
                  className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-card-foreground mb-1">
                  {t('hosting_modal.phone_label')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t('hosting_modal.phone_placeholder')}
                  className="w-full rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>
            </div>

            {/* Binary questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Has website? */}
              <div>
                <p className="text-xs font-medium text-card-foreground mb-2">
                  {t('hosting_modal.has_website_label')}
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
                      {val ? t('hosting_modal.yes') : t('hosting_modal.no')}
                    </button>
                  ))}
                </div>
                {hasWebsite === true && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('hosting_modal.migration_note')}
                  </p>
                )}
              </div>

              {/* Has domain? */}
              <div>
                <p className="text-xs font-medium text-card-foreground mb-2">
                  {t('hosting_modal.has_domain_label')}
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
                      {val ? t('hosting_modal.yes') : t('hosting_modal.no')}
                    </button>
                  ))}
                </div>
                {hasDomain === false && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('hosting_modal.domain_note')}
                  </p>
                )}
              </div>
            </div>

            {/* Optional notes */}
            <div>
              <label className="block text-xs font-medium text-card-foreground mb-1">
                {t('hosting_modal.notes_label')}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={t('hosting_modal.notes_placeholder')}
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
                {submitting ? t('hosting_modal.submitting') : t('hosting_modal.submit')}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2.5 rounded-xl border-2 border-border text-sm font-medium text-muted-foreground hover:border-primary/50 transition-colors"
              >
                {t('hosting_modal.cancel')}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
