'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { getContractTemplate } from '@/lib/contract-templates';
import { PLANS } from '@/lib/plans';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ServiceRow {
  name: string;
  description: string;
  price: string;
}

interface ContractFormProps {
  clients: Array<{ _id: string; name: string; businessName?: string }>;
  contractId?: string;
  defaultValues?: {
    clientId?: string;
    planId?: string;
    services?: ServiceRow[];
    totalAmount?: number;
    advanceAmount?: number;
    status?: string;
    startDate?: string;
    deliveryDate?: string;
    revisionsIncluded?: number;
    revisionsUsed?: number;
    excludedItems?: string[];
    contractTerms?: string;
    notes?: string;
    // Renewal fields
    isRecurring?: boolean;
    renewalDate?: string;
    renewalPeriodMonths?: number;
    renewalNotificationDays?: number;
  };
}

const BRANDING_PLAN_OPTIONS = [
  { value: 'essential', label: 'Branding Essential ($100)' },
  { value: 'corporate', label: 'Branding Corporate ($300)' },
  { value: 'global', label: 'Branding Global ($550)' },
];

const HOSTING_PLAN_OPTIONS = [
  { value: 'hosting_annual', label: '🖥️ Hosting Anual ($120/año)' },
  { value: 'hosting_biennial', label: '🖥️ Hosting Bianual ($110/año)' },
  { value: 'hosting_triennial', label: '🖥️ Hosting Trienal ($100/año)' },
  { value: 'domain', label: '🌐 Dominio (desde $15/año)' },
  { value: 'hosting_domain', label: '🌐 Hosting + Dominio' },
];

const PLAN_OPTIONS = [
  { value: '', label: 'Seleccionar plan...' },
  ...PLANS.map((p) => ({ value: p.id, label: `${p.name} ($${p.price})` })),
  { value: '', label: '─── Branding ───', disabled: true },
  ...BRANDING_PLAN_OPTIONS,
  { value: '', label: '─── Hosting & Dominio ───', disabled: true },
  ...HOSTING_PLAN_OPTIONS,
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'active', label: 'Activo' },
  { value: 'completed', label: 'Completado' },
  { value: 'cancelled', label: 'Cancelado' },
];

function toDateInput(d?: string | Date): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().split('T')[0];
}

export default function ContractForm({ clients, contractId, defaultValues }: ContractFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const clientOptions = [
    { value: '', label: 'Seleccionar cliente...' },
    ...clients.map((c) => ({
      value: c._id,
      label: c.businessName ? `${c.name} (${c.businessName})` : c.name,
    })),
  ];

  const [clientId, setClientId] = useState(defaultValues?.clientId ?? '');
  const [planId, setPlanId] = useState(defaultValues?.planId ?? '');
  const [status, setStatus] = useState(defaultValues?.status ?? 'draft');
  const [totalAmount, setTotalAmount] = useState(String(defaultValues?.totalAmount ?? ''));
  const [advanceAmount, setAdvanceAmount] = useState(String(defaultValues?.advanceAmount ?? ''));
  const [startDate, setStartDate] = useState(toDateInput(defaultValues?.startDate));
  const [deliveryDate, setDeliveryDate] = useState(toDateInput(defaultValues?.deliveryDate));
  const [revisionsIncluded, setRevisionsIncluded] = useState(
    String(defaultValues?.revisionsIncluded ?? ''),
  );
  const [revisionsUsed, setRevisionsUsed] = useState(String(defaultValues?.revisionsUsed ?? '0'));
  const [excludedItems, setExcludedItems] = useState<string[]>(defaultValues?.excludedItems ?? []);
  const [contractTerms, setContractTerms] = useState(defaultValues?.contractTerms ?? '');
  const [notes, setNotes] = useState(defaultValues?.notes ?? '');
  const [services, setServices] = useState<ServiceRow[]>(
    defaultValues?.services?.length
      ? defaultValues.services.map((s) => ({ ...s, price: String(s.price) }))
      : [{ name: '', description: '', price: '' }],
  );
  // Renewal state
  const [isRecurring, setIsRecurring] = useState(defaultValues?.isRecurring ?? false);
  const [renewalDate, setRenewalDate] = useState(toDateInput(defaultValues?.renewalDate));
  const [renewalPeriodMonths, setRenewalPeriodMonths] = useState(
    String(defaultValues?.renewalPeriodMonths ?? '12'),
  );
  const [renewalNotificationDays, setRenewalNotificationDays] = useState(
    String(defaultValues?.renewalNotificationDays ?? '30'),
  );

  const BRANDING_PRICES: Record<string, number> = { essential: 100, corporate: 300, global: 550 };
  const HOSTING_PRICES: Record<string, number> = {
    hosting_annual: 120,
    hosting_biennial: 110,
    hosting_triennial: 100,
    domain: 15,
    hosting_domain: 130,
  };
  const HOSTING_PERIODS: Record<string, number> = {
    hosting_annual: 12,
    hosting_biennial: 24,
    hosting_triennial: 36,
    domain: 12,
    hosting_domain: 12,
  };

  // When plan is selected, auto-fill from template
  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setPlanId(id);

    // Auto-mark hosting/domain plans as recurring
    const isHostingPlan = id in HOSTING_PRICES;
    if (isHostingPlan) {
      setIsRecurring(true);
      setRenewalPeriodMonths(String(HOSTING_PERIODS[id]));
      setTotalAmount(String(HOSTING_PRICES[id]));
      // Default renewal date = today + period
      const d = new Date();
      d.setMonth(d.getMonth() + HOSTING_PERIODS[id]);
      setRenewalDate(d.toISOString().split('T')[0]);
      return;
    }

    const template = getContractTemplate(id);
    if (template) {
      // Pre-fill services from template (prices at 0 — admin fills total manually)
      setServices(template.services.map((s) => ({ ...s, price: String(s.price) })));
      setRevisionsIncluded(String(template.revisionsIncluded));
      setExcludedItems(template.excludedItems);
      setContractTerms(template.contractTerms);
      // Always update total with the plan's price when a plan is selected
      const plan = PLANS.find((p) => p.id === id);
      const brandingPrice = BRANDING_PRICES[id];
      if (plan) setTotalAmount(String(plan.price));
      else if (brandingPrice) setTotalAmount(String(brandingPrice));
    } else {
      const plan = PLANS.find((p) => p.id === id);
      if (plan) setTotalAmount(String(plan.price));
    }
  };

  const addService = () =>
    setServices((prev) => [...prev, { name: '', description: '', price: '' }]);
  const removeService = (i: number) => setServices((prev) => prev.filter((_, idx) => idx !== i));
  const updateService = (i: number, key: keyof ServiceRow, val: string) =>
    setServices((prev) => prev.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = contractId ? `/api/contracts/${contractId}` : '/api/contracts';
      const method = contractId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          planId,
          status,
          services: services
            .filter((s) => s.name)
            .map((s) => ({
              name: s.name,
              description: s.description,
              price: Number(s.price) || 0,
            })),
          totalAmount: Number(totalAmount),
          advanceAmount: Number(advanceAmount),
          startDate: startDate || undefined,
          deliveryDate: deliveryDate || undefined,
          revisionsIncluded: Number(revisionsIncluded) || 0,
          revisionsUsed: Number(revisionsUsed) || 0,
          excludedItems: excludedItems.filter(Boolean),
          contractTerms: contractTerms || undefined,
          notes: notes || undefined,
          // Renewal fields
          isRecurring,
          renewalDate: isRecurring && renewalDate ? renewalDate : undefined,
          renewalPeriodMonths: isRecurring ? Number(renewalPeriodMonths) || undefined : undefined,
          renewalNotificationDays: isRecurring ? Number(renewalNotificationDays) || 30 : 30,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar');
      }

      router.push('/admin/dashboard/contracts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Basic info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Cliente *"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          options={clientOptions}
          required
        />
        <Select
          label="Plan *"
          value={planId}
          onChange={handlePlanChange}
          options={PLAN_OPTIONS}
          required
        />
        {(planId && planId.startsWith('hosting')) ||
        planId === 'domain' ||
        planId === 'hosting_domain' ? (
          <div className="sm:col-span-2 -mt-2 px-3 py-2 rounded-lg bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-800 text-xs text-cyan-700 dark:text-cyan-300">
            🔄 <strong>Servicio recurrente.</strong> Se ha marcado automáticamente como recurrente
            con la fecha y período de renovación correspondiente. Revisa la sección &quot;Servicio
            recurrente&quot; al final del formulario.
          </div>
        ) : null}
        <Input
          label="Monto total (USD) *"
          type="number"
          min={0}
          step={0.01}
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          required
        />
        <Input
          label="Anticipo (USD) *"
          type="number"
          min={0}
          step={0.01}
          value={advanceAmount}
          onChange={(e) => setAdvanceAmount(e.target.value)}
          required
        />
        <Input
          label="Fecha de inicio *"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
        <Input
          label="Fecha de entrega *"
          type="date"
          value={deliveryDate}
          onChange={(e) => setDeliveryDate(e.target.value)}
          required
        />
      </div>

      <Select
        label="Estado"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={STATUS_OPTIONS}
      />

      {/* Revisiones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Input
            label="Rondas de revisión incluidas *"
            type="number"
            min={0}
            step={1}
            value={revisionsIncluded}
            onChange={(e) => setRevisionsIncluded(e.target.value)}
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Se auto-completa al seleccionar el plan. Cada ronda adicional = $50.
          </p>
        </div>
        <div>
          <Input
            label="Rondas de revisión usadas"
            type="number"
            min={0}
            step={1}
            value={revisionsUsed}
            onChange={(e) => setRevisionsUsed(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Actualizá este número conforme el cliente solicita revisiones.
          </p>
        </div>
      </div>

      {/* Servicios */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-card-foreground">Servicios incluidos</h3>
          <Button type="button" variant="outline" size="sm" onClick={addService}>
            + Añadir servicio
          </Button>
        </div>
        {/* Column headers */}
        <div className="grid grid-cols-[2fr_3fr_1fr_auto] gap-3 px-3 mb-1">
          <span className="text-xs font-medium text-muted-foreground">Nombre</span>
          <span className="text-xs font-medium text-muted-foreground">Descripción</span>
          <span className="text-xs font-medium text-muted-foreground">Precio (USD)</span>
          <span />
        </div>
        <div className="space-y-3">
          {services.map((svc, i) => (
            <div
              key={i}
              className="grid grid-cols-[2fr_3fr_1fr_auto] gap-3 items-start p-3 rounded-xl border border-border bg-muted/20"
            >
              <Input
                placeholder="Nombre del servicio"
                value={svc.name}
                onChange={(e) => updateService(i, 'name', e.target.value)}
              />
              <Input
                placeholder="Descripción"
                value={svc.description}
                onChange={(e) => updateService(i, 'description', e.target.value)}
              />
              <Input
                placeholder="$0"
                type="number"
                min={0}
                value={svc.price}
                onChange={(e) => updateService(i, 'price', e.target.value)}
              />
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeService(i)}
                  className="mt-1 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Eliminar servicio"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Textarea
        label="Notas del contrato"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Condiciones especiales, acuerdos adicionales..."
        rows={4}
      />

      {/* Ítems excluidos */}
      {excludedItems.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-card-foreground mb-3">
            No incluido en este plan
          </h3>
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
            {excludedItems.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-destructive shrink-0 mt-0.5">✕</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...excludedItems];
                    next[i] = e.target.value;
                    setExcludedItems(next);
                  }}
                  className="flex-1 bg-transparent text-sm text-card-foreground border-none outline-none"
                />
                <button
                  type="button"
                  onClick={() => setExcludedItems((prev) => prev.filter((_, idx) => idx !== i))}
                  className="text-muted-foreground hover:text-destructive text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setExcludedItems((prev) => [...prev, ''])}
              className="text-xs text-primary mt-2"
            >
              + Añadir ítem excluido
            </button>
          </div>
        </div>
      )}

      {/* Términos del contrato */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-card-foreground">Términos del contrato</h3>
          <span className="text-xs text-muted-foreground">
            Se auto-completa con el plan seleccionado — editable si es necesario
          </span>
        </div>
        <Textarea
          value={contractTerms}
          onChange={(e) => setContractTerms(e.target.value)}
          placeholder="Los términos del contrato se cargarán automáticamente al seleccionar un plan..."
          rows={12}
        />
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>
      )}

      {/* ── Renovación recurrente ─────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-card-foreground">Servicio recurrente</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hosting, dominio, mantenimiento u otro servicio que se renueva periódicamente.
              Recibirás un email automático antes del vencimiento.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors
                            after:content-[''] after:absolute after:top-[2px] after:start-[2px]
                            after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                            peer-checked:after:translate-x-full"
            />
          </label>
        </div>

        {isRecurring && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-border">
            <Input
              label="Fecha de renovación *"
              type="date"
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              hint="¿Cuándo vence o se renueva el servicio?"
              required={isRecurring}
            />
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-card-foreground">
                Período de renovación
              </label>
              <select
                value={renewalPeriodMonths}
                onChange={(e) => setRenewalPeriodMonths(e.target.value)}
                className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">Mensual (1 mes)</option>
                <option value="3">Trimestral (3 meses)</option>
                <option value="6">Semestral (6 meses)</option>
                <option value="12">Anual (1 año)</option>
                <option value="24">Bienal (2 años)</option>
                <option value="36">Trienal (3 años)</option>
              </select>
              <p className="text-xs text-muted-foreground">Cada cuánto tiempo se renueva</p>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-card-foreground">
                Avisar con anticipación
              </label>
              <select
                value={renewalNotificationDays}
                onChange={(e) => setRenewalNotificationDays(e.target.value)}
                className="rounded-lg border border-border bg-background text-card-foreground text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="7">7 días antes</option>
                <option value="15">15 días antes</option>
                <option value="30">30 días antes</option>
                <option value="60">60 días antes</option>
                <option value="90">90 días antes</option>
              </select>
              <p className="text-xs text-muted-foreground">
                Cuándo enviar el recordatorio por email
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {contractId ? 'Guardar cambios' : 'Crear contrato'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/dashboard/contracts')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
