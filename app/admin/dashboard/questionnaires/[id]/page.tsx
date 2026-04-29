import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import QuestionnaireStatusForm from '@/components/admin/QuestionnaireStatusForm';
import Badge from '@/components/ui/Badge';
import Questionnaire from '@/database/questionnaire.model';
import connectDB from '@/lib/mongodb';
import { PLAN_MAP } from '@/lib/plans';
import { requireAdminSession } from '@/lib/require-admin-session';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Detalle del cuestionario' };

// ─── Label maps ──────────────────────────────────────────────────────────────

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  creative: 'Creativo / Artista',
  restaurant: 'Restaurante / Bar',
  entrepreneur: 'Emprendedor',
  professional: 'Profesional (médico, abogado, etc.)',
  ecommerce: 'E-commerce',
  other: 'Otro',
};

const BUDGET_LABELS: Record<string, string> = {
  under_150: 'Menos de $150',
  '150_300': '$150 – $300',
  '300_500': '$300 – $500',
  '500_800': '$500 – $800',
  '800_1500': '$800 – $1,500',
  over_1500: 'Más de $1,500',
};

const GOAL_LABELS: Record<string, string> = {
  more_clients: 'Conseguir más clientes',
  show_work: 'Mostrar mi trabajo',
  give_info: 'Dar información',
  credibility: 'Generar credibilidad',
  sell_online: 'Vender online',
  reservations: 'Tomar reservaciones',
};

const STYLE_LABELS: Record<string, string> = {
  minimal: 'Minimalista',
  modern: 'Moderno',
  elegant: 'Elegante',
  colorful: 'Colorido',
  rustic: 'Rústico',
  corporate: 'Corporativo',
  creative: 'Creativo',
  vintage: 'Vintage',
  fun: 'Divertido',
};

const ONLINE_PRESENCE_LABELS: Record<string, string> = {
  none: 'Sin presencia online',
  social_only: 'Solo redes sociales',
  has_website: 'Ya tiene sitio web',
};

const STATUS_LABELS: Record<string, { label: string; variant: 'primary' | 'warning' | 'success' }> =
  {
    new: { label: 'Nuevo', variant: 'primary' },
    reviewed: { label: 'Revisado', variant: 'warning' },
    contacted: { label: 'Contactado', variant: 'success' },
  };

const DESIRED_PAGES_LABELS: Record<string, string> = {
  home: 'Inicio',
  about: 'Sobre mí / Nosotros',
  services: 'Servicios',
  portfolio: 'Portafolio',
  menu: 'Menú',
  contact: 'Contacto',
  blog: 'Blog',
  shop: 'Tienda',
  reservations: 'Reservaciones',
  faq: 'Preguntas frecuentes',
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | boolean | string[] | undefined | null;
}) {
  if (value === undefined || value === null || value === '') return null;

  let displayValue: string;
  if (typeof value === 'boolean') {
    displayValue = value ? 'Sí' : 'No';
  } else if (Array.isArray(value)) {
    if (value.length === 0) return null;
    displayValue = value.join(' · ');
  } else {
    displayValue = String(value);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground sm:w-52 shrink-0">{label}</span>
      <span className="text-sm text-card-foreground font-medium">{displayValue}</span>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 mb-4">
      <h3 className="font-semibold text-card-foreground mb-3">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function QuestionnaireDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdminSession('/admin/dashboard/questionnaires');
  await connectDB();

  const { id } = await params;
  const doc = await Questionnaire.findById(id).lean();
  if (!doc) notFound();

  const answers = doc.answers as Record<string, unknown>;
  const planId = doc.recommendedPlan as string;
  const plan = PLAN_MAP[planId];
  const statusInfo = STATUS_LABELS[String(doc.status)] || STATUS_LABELS.new;

  const desiredPagesRaw = Array.isArray(answers.desiredPages)
    ? (answers.desiredPages as string[]).map((p) => DESIRED_PAGES_LABELS[p] || p)
    : [];

  const visualStyleRaw = Array.isArray(answers.visualStyle)
    ? (answers.visualStyle as string[]).map((s) => STYLE_LABELS[s] || s)
    : [];

  return (
    <AdminPageLayout maxWidth="3xl">
      <AdminBackButton href="/admin/dashboard/questionnaires" />
      <AdminPageHeader
        title={String(answers.fullName || 'Cuestionario sin nombre')}
        description={`Recibido el ${doc.createdAt ? new Date(String(doc.createdAt)).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}`}
      />

      {/* Status & Plan summary */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        <span className="text-sm text-muted-foreground">Plan recomendado:</span>
        <span className="text-sm font-bold text-primary">{plan?.name || planId}</span>
      </div>

      {/* Step 1: Contacto */}
      <Section title="1. Información de contacto">
        <InfoRow label="Nombre completo" value={String(answers.fullName || '')} />
        <InfoRow label="Nombre del negocio" value={String(answers.businessName || '')} />
        <InfoRow label="Email" value={String(answers.email || '')} />
        <InfoRow label="Teléfono" value={String(answers.phone || '')} />
      </Section>

      {/* Step 2: Negocio */}
      <Section title="2. Negocio">
        <InfoRow
          label="Tipo de negocio"
          value={
            BUSINESS_TYPE_LABELS[String(answers.businessType || '')] ||
            String(answers.businessType || '')
          }
        />
        <InfoRow
          label="Descripción del negocio"
          value={String(answers.businessDescription || '')}
        />
        <InfoRow
          label="Presencia online actual"
          value={
            ONLINE_PRESENCE_LABELS[String(answers.onlinePresence || '')] ||
            String(answers.onlinePresence || '')
          }
        />
      </Section>

      {/* Step 3: Objetivos */}
      <Section title="3. Objetivos">
        <InfoRow
          label="Objetivo principal"
          value={
            GOAL_LABELS[String(answers.primaryGoal || '')] || String(answers.primaryGoal || '')
          }
        />
        <InfoRow label="Acción principal del sitio" value={String(answers.primaryAction || '')} />
        <InfoRow label="Páginas deseadas" value={desiredPagesRaw} />
      </Section>

      {/* Step 4: Presupuesto */}
      <Section title="4. Presupuesto y tiempos">
        <InfoRow
          label="Presupuesto disponible"
          value={BUDGET_LABELS[String(answers.budget || '')] || String(answers.budget || '')}
        />
        <InfoRow label="Plazo deseado" value={String(answers.deadline || '')} />
        <InfoRow
          label="¿Ya tiene dominio?"
          value={typeof answers.hasDomain === 'boolean' ? answers.hasDomain : undefined}
        />
      </Section>

      {/* Step 5: Estilo visual */}
      <Section title="5. Estilo visual">
        <InfoRow label="Estilos preferidos" value={visualStyleRaw} />
        <InfoRow
          label="¿Tiene logo?"
          value={typeof answers.hasLogo === 'boolean' ? answers.hasLogo : undefined}
        />
        <InfoRow label="Colores de marca" value={String(answers.brandColors || '')} />
        <InfoRow label="Sitios de referencia" value={String(answers.referenceWebsites || '')} />
      </Section>

      {/* Step 6: Contenido */}
      <Section title="6. Contenido disponible">
        <InfoRow
          label="¿Tiene fotos propias?"
          value={typeof answers.hasPhotos === 'boolean' ? answers.hasPhotos : undefined}
        />
        <InfoRow
          label="¿Tiene textos redactados?"
          value={typeof answers.hasTexts === 'boolean' ? answers.hasTexts : undefined}
        />
        <InfoRow label="Notas adicionales" value={String(answers.extraNotes || '')} />
      </Section>

      {/* Status management */}
      <QuestionnaireStatusForm
        id={id}
        currentStatus={String(doc.status)}
        currentNotes={doc.adminNotes || ''}
      />
    </AdminPageLayout>
  );
}
