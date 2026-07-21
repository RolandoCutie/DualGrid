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
  status: string;
  website: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  city: string;
  country: string;
  referralSource: string;
}

interface ClientFormProps {
  defaultValues?: Partial<ClientFormData>;
  clientId?: string;
  redirectTo?: string;
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

const CLIENT_STATUS_OPTIONS = [
  { value: 'prospect', label: 'Prospecto' },
  { value: 'active', label: 'Activo' },
  { value: 'inactive', label: 'Inactivo' },
  { value: 'churned', label: 'Perdido' },
];

export default function ClientForm({ defaultValues, clientId, redirectTo }: ClientFormProps) {
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
    status: defaultValues?.status ?? 'prospect',
    website: defaultValues?.website ?? '',
    instagram: defaultValues?.instagram ?? '',
    facebook: defaultValues?.facebook ?? '',
    twitter: defaultValues?.twitter ?? '',
    linkedin: defaultValues?.linkedin ?? '',
    tiktok: defaultValues?.tiktok ?? '',
    youtube: defaultValues?.youtube ?? '',
    city: defaultValues?.city ?? '',
    country: defaultValues?.country ?? '',
    referralSource: defaultValues?.referralSource ?? '',
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
          status: form.status || 'prospect',
          website: form.website || undefined,
          instagram: form.instagram || undefined,
          facebook: form.facebook || undefined,
          twitter: form.twitter || undefined,
          linkedin: form.linkedin || undefined,
          tiktok: form.tiktok || undefined,
          youtube: form.youtube || undefined,
          city: form.city || undefined,
          country: form.country || undefined,
          referralSource: form.referralSource || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Error al guardar');
      }

      router.push(redirectTo ?? '/admin/dashboard/clients');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic Info */}
      <div>
        <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider mb-4">
          Datos básicos
        </h3>
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
          <Input
            label="Ciudad"
            value={form.city}
            onChange={set('city')}
            placeholder="Ciudad de México"
          />
          <Input label="País" value={form.country} onChange={set('country')} placeholder="México" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Select
            label="Tipo de negocio"
            value={form.businessType}
            onChange={set('businessType')}
            options={BUSINESS_TYPE_OPTIONS}
          />
          <Select
            label="Estado del cliente"
            value={form.status}
            onChange={set('status')}
            options={CLIENT_STATUS_OPTIONS}
          />
        </div>
      </div>

      {/* Online Presence */}
      <div>
        <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider mb-4">
          Presencia digital
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Sitio web"
            value={form.website}
            onChange={set('website')}
            placeholder="https://miempresa.com"
          />
          <Input
            label="Instagram"
            value={form.instagram}
            onChange={set('instagram')}
            placeholder="@miempresa"
          />
          <Input
            label="Facebook"
            value={form.facebook}
            onChange={set('facebook')}
            placeholder="https://facebook.com/..."
          />
          <Input
            label="LinkedIn"
            value={form.linkedin}
            onChange={set('linkedin')}
            placeholder="https://linkedin.com/in/..."
          />
          <Input
            label="TikTok"
            value={form.tiktok}
            onChange={set('tiktok')}
            placeholder="@miempresa"
          />
          <Input
            label="YouTube"
            value={form.youtube}
            onChange={set('youtube')}
            placeholder="https://youtube.com/..."
          />
          <Input
            label="Twitter / X"
            value={form.twitter}
            onChange={set('twitter')}
            placeholder="@miempresa"
          />
          <Input
            label="¿Cómo nos encontró?"
            value={form.referralSource}
            onChange={set('referralSource')}
            placeholder="Referido, Instagram, Google..."
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider mb-4">
          Notas internas
        </h3>
        <Textarea
          label="Notas"
          value={form.notes}
          onChange={set('notes')}
          placeholder="Notas sobre el cliente, referencias, condiciones especiales..."
          rows={4}
        />
      </div>

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
