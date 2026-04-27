'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface InvoiceItem {
  description: string;
  quantity: string;
  unitPrice: string;
}

interface InvoiceFormProps {
  clients: Array<{ _id: string; name: string; businessName?: string }>;
  invoiceId?: string;
  defaultValues?: {
    clientId?: string;
    contractId?: string;
    items?: InvoiceItem[];
    taxRate?: number;
    status?: string;
    issueDate?: string;
    dueDate?: string;
    notes?: string;
  };
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Borrador' },
  { value: 'sent', label: 'Enviada' },
  { value: 'paid', label: 'Pagada' },
  { value: 'overdue', label: 'Vencida' },
  { value: 'cancelled', label: 'Cancelada' },
];

function toDateInput(d?: string | Date): string {
  if (!d) return '';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toISOString().split('T')[0];
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}
function in30Days() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
}

export default function InvoiceForm({ clients, invoiceId, defaultValues }: InvoiceFormProps) {
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
  const [status, setStatus] = useState(defaultValues?.status ?? 'draft');
  const [taxRate, setTaxRate] = useState(String(defaultValues?.taxRate ?? '0'));
  const [issueDate, setIssueDate] = useState(toDateInput(defaultValues?.issueDate) || todayStr());
  const [dueDate, setDueDate] = useState(toDateInput(defaultValues?.dueDate) || in30Days());
  const [notes, setNotes] = useState(defaultValues?.notes ?? '');
  const [items, setItems] = useState<InvoiceItem[]>(
    defaultValues?.items?.length
      ? defaultValues.items
      : [{ description: '', quantity: '1', unitPrice: '' }],
  );

  const addItem = () => setItems((p) => [...p, { description: '', quantity: '1', unitPrice: '' }]);
  const removeItem = (i: number) => setItems((p) => p.filter((_, idx) => idx !== i));
  const updateItem = (i: number, key: keyof InvoiceItem, val: string) =>
    setItems((p) => p.map((item, idx) => (idx === i ? { ...item, [key]: val } : item)));

  // Computed totals
  const parsedItems = items.map((it) => ({
    description: it.description,
    quantity: Math.max(1, Number(it.quantity) || 1),
    unitPrice: Number(it.unitPrice) || 0,
    total: Math.max(1, Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
  }));
  const subtotal = parsedItems.reduce((sum, it) => sum + it.total, 0);
  const tax = subtotal * (Number(taxRate) / 100);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = invoiceId ? `/api/invoices/${invoiceId}` : '/api/invoices';
      const method = invoiceId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          status,
          items: parsedItems.filter((it) => it.description),
          subtotal,
          taxRate: Number(taxRate),
          taxAmount: tax,
          totalAmount: total,
          issueDate,
          dueDate,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar');
      }

      router.push('/admin/dashboard/invoices');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      {/* Header fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Cliente *"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          options={clientOptions}
          required
        />
        <Select
          label="Estado"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUS_OPTIONS}
        />
        <Input
          label="Fecha de emisión *"
          type="date"
          value={issueDate}
          onChange={(e) => setIssueDate(e.target.value)}
          required
        />
        <Input
          label="Fecha de vencimiento *"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />
        <Input
          label="IVA (%)"
          type="number"
          min={0}
          max={100}
          step={0.5}
          value={taxRate}
          onChange={(e) => setTaxRate(e.target.value)}
        />
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-card-foreground">Conceptos</h3>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            + Añadir concepto
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className="grid grid-cols-[3fr_1fr_1.5fr_auto] gap-3 items-start p-3 rounded-xl border border-border bg-muted/20"
            >
              <Input
                placeholder="Descripción del servicio"
                value={item.description}
                onChange={(e) => updateItem(i, 'description', e.target.value)}
              />
              <Input
                placeholder="Cant."
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(i, 'quantity', e.target.value)}
              />
              <Input
                placeholder="Precio unitario"
                type="number"
                min={0}
                step={0.01}
                value={item.unitPrice}
                onChange={(e) => updateItem(i, 'unitPrice', e.target.value)}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="mt-1 text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Eliminar"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Totals preview */}
        <div className="mt-4 ml-auto w-56 space-y-1 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {Number(taxRate) > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>IVA ({taxRate}%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-card-foreground border-t border-border pt-1 mt-1">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Textarea
        label="Notas"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Condiciones de pago, observaciones..."
        rows={3}
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {invoiceId ? 'Guardar cambios' : 'Crear factura'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/dashboard/invoices')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
