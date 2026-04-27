'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessType: string;
  notes: string;
}

interface ClientFormProps {
  defaultValues?: Partial<ClientFormData>;
  clientId?: string;
}

const BUSINESS_TYPE_OPTIONS = [
  { value: '', label: 'Seleccionar tipo...' },
  { value: 'creative', label: 'Artista / Creativo' },
  { value: 'restaurant', label: 'Restaurante / Bar' },
  { value: 'entrepreneur', label: 'Emprendedor' },
  { value: 'professional', label: 'Profesional' },
  { value: 'ecommerce', label: 'Tienda / E-commerce' },
  { value: 'other', label: 'Otro' },
];

export default function ClientForm({ defaultValues, clientId }: ClientFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ClientFormData>({
    name: defaultValues?.name ?? '',
    email: defaultValues?.email ?? '',
    phone: defaultValues?.phone ?? '',
    businessName: defaultValues?.businessName ?? '',
    businessType: defaultValues?.businessType ?? '',
    notes: defaultValues?.notes ?? '',
  });

  const set =
    (key: keyof ClientFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = clientId ? `/api/clients/${clientId}` : '/api/clients';
      const method = clientId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          businessName: form.businessName || undefined,
          businessType: form.businessType || undefined,
          notes: form.notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar');
      }

      router.push('/admin/dashboard/clients');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre completo *"
          value={form.name}
          onChange={set('name')}
          required
          placeholder="Juan García"
        />
        <Input
          label="Email *"
          type="email"
          value={form.email}
          onChange={set('email')}
          required
          placeholder="juan@empresa.com"
        />
        <Input
          label="Teléfono"
          type="tel"
          value={form.phone}
          onChange={set('phone')}
          placeholder="+1 555 000 0000"
        />
        <Input
          label="Nombre del negocio"
          value={form.businessName}
          onChange={set('businessName')}
          placeholder="Mi Empresa S.A."
        />
      </div>

      <Select
        label="Tipo de negocio"
        value={form.businessType}
        onChange={set('businessType')}
        options={BUSINESS_TYPE_OPTIONS}
      />

      <Textarea
        label="Notas internas"
        value={form.notes}
        onChange={set('notes')}
        placeholder="Notas sobre el cliente, referencias, condiciones especiales..."
        rows={4}
      />

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {clientId ? 'Guardar cambios' : 'Crear cliente'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/dashboard/clients')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
