'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
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
    notes?: string;
  };
}

const PLAN_OPTIONS = [
  { value: '', label: 'Seleccionar plan...' },
  ...PLANS.map((p) => ({ value: p.id, label: `${p.name} ($${p.price})` })),
  { value: 'custom', label: 'Personalizado' },
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
  const [notes, setNotes] = useState(defaultValues?.notes ?? '');
  const [services, setServices] = useState<ServiceRow[]>(
    defaultValues?.services?.length
      ? defaultValues.services.map((s) => ({ ...s, price: String(s.price) }))
      : [{ name: '', description: '', price: '' }],
  );

  // When plan is selected, pre-fill total with plan price
  const handlePlanChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setPlanId(id);
    const plan = PLANS.find((p) => p.id === id);
    if (plan && !totalAmount) setTotalAmount(String(plan.price));
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
          notes: notes || undefined,
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

      {/* Services */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-card-foreground">Servicios incluidos</h3>
          <Button type="button" variant="outline" size="sm" onClick={addService}>
            + Añadir servicio
          </Button>
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

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>
      )}

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
