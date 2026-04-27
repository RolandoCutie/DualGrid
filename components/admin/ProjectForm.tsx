'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProjectFormData {
  name: string;
  slug: string;
  description: string;
  technologies: string; // comma-separated in UI
  images: string; // comma-separated in UI
  link: string;
  featured: boolean;
  order: string;
}

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData & { technologies: string[]; images: string[] }>;
  projectId?: string;
}

function toCommaSeparated(val: string | string[] | undefined): string {
  if (!val) return '';
  if (Array.isArray(val)) return val.join(', ');
  return val;
}

export default function ProjectForm({ defaultValues, projectId }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<ProjectFormData>({
    name: defaultValues?.name ?? '',
    slug: defaultValues?.slug ?? '',
    description: defaultValues?.description ?? '',
    technologies: toCommaSeparated(defaultValues?.technologies),
    images: toCommaSeparated(defaultValues?.images),
    link: defaultValues?.link ?? '',
    featured: defaultValues?.featured ?? false,
    order: String(defaultValues?.order ?? 0),
  });

  const set =
    (key: keyof ProjectFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    setForm((prev) => ({ ...prev, name, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      technologies: form.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      images: form.images
        .split(',')
        .map((i) => i.trim())
        .filter(Boolean),
      link: form.link,
      featured: form.featured,
      order: Number(form.order) || 0,
    };

    try {
      const url = projectId ? `/api/admin/projects/${projectId}` : '/api/admin/projects';
      const method = projectId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push('/admin/dashboard/projects');
      router.refresh();
    } catch {
      setError('Error al guardar el proyecto. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      <Input
        label="Nombre del proyecto *"
        value={form.name}
        onChange={handleNameChange}
        required
        placeholder="Mi Proyecto"
      />
      <Input
        label="Slug (URL) *"
        value={form.slug}
        onChange={set('slug')}
        required
        placeholder="mi-proyecto"
        hint="Se genera automáticamente desde el nombre."
      />
      <Textarea
        label="Descripción *"
        value={form.description}
        onChange={set('description')}
        required
        rows={4}
        placeholder="Descripción del proyecto..."
      />
      <Input
        label="Tecnologías (separadas por coma)"
        value={form.technologies}
        onChange={set('technologies')}
        placeholder="Next.js, Tailwind CSS, MongoDB"
      />
      <Input
        label="Imágenes (URLs separadas por coma)"
        value={form.images}
        onChange={set('images')}
        placeholder="https://res.cloudinary.com/..."
        hint="Pega las URLs de Cloudinary separadas por coma."
      />
      <Input
        label="Enlace al sitio"
        value={form.link}
        onChange={set('link')}
        type="url"
        placeholder="https://ejemplo.com"
      />
      <div className="flex items-center gap-3">
        <input
          id="featured"
          type="checkbox"
          checked={form.featured}
          onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
          className="w-4 h-4 accent-primary"
        />
        <label htmlFor="featured" className="text-sm font-medium text-card-foreground">
          Proyecto destacado
        </label>
      </div>
      <Input
        label="Orden (menor número = primero)"
        value={form.order}
        onChange={set('order')}
        type="number"
        min={0}
        placeholder="0"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : projectId ? 'Actualizar proyecto' : 'Crear proyecto'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/dashboard/projects')}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
