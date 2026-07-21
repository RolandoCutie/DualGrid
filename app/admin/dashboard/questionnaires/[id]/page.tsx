import AdminBackButton from '@/components/admin/AdminBackButton';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminPageLayout from '@/components/admin/AdminPageLayout';
import AIPromptGenerator from '@/components/admin/AIPromptGenerator';
import ConvertToClientButton from '@/components/admin/ConvertToClientButton';
import QuestionnaireExportButtons from '@/components/admin/QuestionnaireExportButtons';
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
  blogger: 'Blogger / Creador de contenido',
  other: 'Otro',
};

const BUSINESS_AGE_LABELS: Record<string, string> = {
  new: 'Nuevo (aún no lanzado)',
  under_1: 'Menos de 1 año',
  '1_3': '1 – 3 años',
  '3_5': '3 – 5 años',
  over_5: 'Más de 5 años',
};

const REFERRAL_LABELS: Record<string, string> = {
  social_media: 'Redes sociales',
  referral: 'Recomendación',
  google: 'Google',
  other: 'Otro',
};

const NEEDS_CMS_LABELS: Record<string, string> = {
  frequently: 'Frecuentemente (blog, productos)',
  occasionally: 'Ocasionalmente',
  no: 'No necesito editar',
};

const SPECIAL_FEATURES_LABELS: Record<string, string> = {
  whatsapp_btn: 'Botón WhatsApp',
  contact_form: 'Formulario de contacto',
  map: 'Mapa de ubicación',
  gallery: 'Galería de fotos/videos',
  video_banner: 'Video en portada',
  newsletter: 'Suscripción newsletter',
  booking: 'Reservas / citas online',
  live_chat: 'Chat en vivo',
  multilang: 'Sitio multiidioma',
  reviews: 'Reseñas / testimonios',
  social_feed: 'Feed de Instagram/redes',
  faq: 'Preguntas frecuentes',
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
  give_info: 'Dar información del negocio',
  credibility: 'Generar credibilidad',
  sell_online: 'Vender online',
  reservations: 'Gestionar reservas / citas',
  grow_audience: 'Crecer mi audiencia',
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
  portfolio: 'Portafolio / Galería',
  pricing: 'Precios',
  testimonials: 'Testimonios',
  blog: 'Blog',
  contact: 'Contacto',
  faq: 'Preguntas frecuentes',
  menu: 'Menú (restaurante)',
  shop: 'Tienda online',
  reservations: 'Reservas / Citas',
  location: 'Ubicación / Mapa',
};

const PRIMARY_ACTION_LABELS: Record<string, string> = {
  whatsapp_contact: 'Contactar por WhatsApp',
  contact_form: 'Llenar formulario de contacto',
  call: 'Llamar por teléfono',
  book_appointment: 'Reservar cita / mesa',
  buy_product: 'Comprar producto / servicio',
  view_portfolio: 'Ver portafolio',
  download: 'Descargar (menú, catálogo...)',
  request_quote: 'Solicitar cotización',
  subscribe: 'Suscribirse al newsletter',
};

const DEADLINE_LABELS: Record<string, string> = {
  urgent: 'Lo antes posible',
  '2_weeks': 'En 2 semanas',
  '1_month': 'En 1 mes',
  '2_3_months': 'En 2–3 meses',
  no_rush: 'Sin prisa / flexible',
};

const SITE_LANGUAGE_LABELS: Record<string, string> = {
  es: 'Solo español 🇪🇸',
  en: 'Solo inglés 🇺🇸',
  both: 'Bilingüe (ES + EN) 🌐',
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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ back?: string }>;
}) {
  await requireAdminSession('/admin/dashboard/questionnaires');
  await connectDB();

  const { id } = await params;
  const { back } = await searchParams;
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
      <AdminBackButton href={back ?? '/admin/dashboard/questionnaires'} label="Volver" />
      <AdminPageHeader
        title={String(answers.fullName || 'Cuestionario sin nombre')}
        description={`Recibido el ${doc.createdAt ? new Date(String(doc.createdAt)).toLocaleDateString('es', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}`}
      />

      {/* Status & Plan summary */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        <span className="text-sm text-muted-foreground">Plan recomendado:</span>
        <span className="text-sm font-bold text-primary">{plan?.name || planId}</span>
        {doc.selectedPlan && doc.selectedPlan !== doc.recommendedPlan && (
          <>
            <span className="text-sm text-muted-foreground">· Elegido por el cliente:</span>
            <span className="text-sm font-bold text-accent-foreground">
              {PLAN_MAP[doc.selectedPlan]?.name || doc.selectedPlan}
            </span>
          </>
        )}
      </div>

      {/* Export buttons */}
      <div className="mb-6">
        <QuestionnaireExportButtons
          questionnaire={{
            answers: doc.answers as Record<string, unknown>,
            recommendedPlan: planId,
            score: doc.score as Record<string, number> | undefined,
            status: String(doc.status),
            createdAt: doc.createdAt ? String(doc.createdAt) : undefined,
          }}
          clientName={String((doc.answers as Record<string, unknown>).fullName || 'cliente')}
          planName={plan?.name ?? planId}
          questionnaireId={id}
        />
      </div>

      {/* AI Prompt Generator */}
      <div className="mb-6">
        <AIPromptGenerator
          questionnaire={{
            answers: doc.answers as Record<string, unknown>,
            recommendedPlan: planId,
            score: doc.score as Record<string, number> | undefined,
          }}
          planName={plan?.name ?? planId}
        />
      </div>

      {/* Step 1: Contacto */}
      <Section title="1. Información de contacto">
        <InfoRow label="Nombre completo" value={String(answers.fullName || '')} />
        <InfoRow label="Nombre del negocio" value={String(answers.businessName || '')} />
        <InfoRow label="Email" value={String(answers.email || '')} />
        <InfoRow label="Teléfono" value={String(answers.phone || '')} />
        <InfoRow
          label="¿Cómo nos encontró?"
          value={
            REFERRAL_LABELS[String(answers.referralSource || '')] ||
            String(answers.referralSource || '')
          }
        />
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
          label="Antigüedad del negocio"
          value={
            BUSINESS_AGE_LABELS[String(answers.businessAge || '')] ||
            String(answers.businessAge || '')
          }
        />
        <InfoRow
          label="Descripción del negocio"
          value={String(answers.businessDescription || '')}
        />
        <InfoRow label="Servicios principales" value={String(answers.mainServices || '')} />
        <InfoRow label="Público objetivo" value={String(answers.targetAudience || '')} />
        <InfoRow
          label="Presencia online actual"
          value={
            ONLINE_PRESENCE_LABELS[String(answers.onlinePresence || '')] ||
            String(answers.onlinePresence || '')
          }
        />
      </Section>

      {/* Step 3: Objetivos */}
      <Section title="3. Objetivos y funcionalidades">
        <InfoRow
          label="Objetivos principales"
          value={
            Array.isArray(answers.primaryGoal)
              ? (answers.primaryGoal as string[]).map((g) => GOAL_LABELS[g] || g)
              : answers.primaryGoal
                ? [GOAL_LABELS[String(answers.primaryGoal)] || String(answers.primaryGoal)]
                : []
          }
        />
        <InfoRow
          label="Acción principal del sitio (CTA)"
          value={
            Array.isArray(answers.primaryAction)
              ? (answers.primaryAction as string[]).map((a) => PRIMARY_ACTION_LABELS[a] || a)
              : String(answers.primaryAction || '')
          }
        />
        <InfoRow label="Páginas deseadas" value={desiredPagesRaw} />
        <InfoRow
          label="Funcionalidades especiales"
          value={
            Array.isArray(answers.specialFeatures)
              ? (answers.specialFeatures as string[]).map((f) => SPECIAL_FEATURES_LABELS[f] || f)
              : []
          }
        />
        <InfoRow
          label="Diferenciación / propuesta de valor"
          value={String(answers.differentiation || '')}
        />
      </Section>

      {/* Step 4: Presupuesto */}
      <Section title="4. Presupuesto y tiempos">
        <InfoRow
          label="Presupuesto disponible"
          value={BUDGET_LABELS[String(answers.budget || '')] || String(answers.budget || '')}
        />
        <InfoRow
          label="Plazo deseado"
          value={DEADLINE_LABELS[String(answers.deadline || '')] || String(answers.deadline || '')}
        />
        <InfoRow
          label="¿Ya tiene dominio?"
          value={typeof answers.hasDomain === 'boolean' ? answers.hasDomain : undefined}
        />
        <InfoRow
          label="Necesidad de CMS"
          value={NEEDS_CMS_LABELS[String(answers.needsCMS || '')] || String(answers.needsCMS || '')}
        />
        <InfoRow label="Definición de éxito" value={String(answers.successDefinition || '')} />
      </Section>

      {/* Step 5: Estilo visual */}
      <Section title="5. Estilo visual y marca">
        <InfoRow label="Estilos preferidos" value={visualStyleRaw} />
        <InfoRow label="Sensación deseada" value={String(answers.visualFeeling || '')} />
        <InfoRow
          label="¿Tiene logo?"
          value={typeof answers.hasLogo === 'boolean' ? answers.hasLogo : undefined}
        />
        <InfoRow label="Colores de marca" value={String(answers.brandColors || '')} />
        <InfoRow label="Sitios de referencia" value={String(answers.referenceWebsites || '')} />
      </Section>

      {/* Step 5b: Branding / Identidad Visual */}
      {(answers.brandEssence ||
        answers.brandValues ||
        answers.brandNoDos ||
        answers.logoWords ||
        answers.logoSpecificElements ||
        answers.priorBrandPresence ||
        answers.logoInspiration) && (
        <Section title="5b. Identidad Visual (Branding)">
          <InfoRow
            label="Esencia del negocio (3 palabras)"
            value={String(answers.brandEssence || '')}
          />
          <InfoRow
            label="Valores / sensaciones de marca"
            value={String(answers.brandValues || '')}
          />
          <InfoRow label="Lo que NO quiere" value={String(answers.brandNoDos || '')} />
          <InfoRow label="Palabras en el logo" value={String(answers.logoWords || '')} />
          <InfoRow
            label="Elementos específicos para el logo"
            value={String(answers.logoSpecificElements || '')}
          />
          <InfoRow
            label="Autorrepresentación previa"
            value={String(answers.priorBrandPresence || '')}
          />
          <InfoRow
            label="Logos / marcas de inspiración"
            value={String(answers.logoInspiration || '')}
          />
        </Section>
      )}

      {/* Step 6: Contenido */}
      <Section title="6. Contenido y experiencia">
        <InfoRow
          label="¿Tiene fotos propias?"
          value={typeof answers.hasPhotos === 'boolean' ? answers.hasPhotos : undefined}
        />
        <InfoRow
          label="¿Tiene textos redactados?"
          value={typeof answers.hasTexts === 'boolean' ? answers.hasTexts : undefined}
        />
        <InfoRow
          label="Contenido a aportar y plazo"
          value={String(answers.clientContentDeadline || '')}
        />
        <InfoRow label="Redes sociales" value={String(answers.socialMedia || '')} />
        <InfoRow
          label="Idioma(s) del sitio"
          value={
            SITE_LANGUAGE_LABELS[String(answers.siteLanguages || '')] ||
            String(answers.siteLanguages || '')
          }
        />
        <InfoRow
          label="Experiencia previa con web"
          value={
            answers.priorWebExperience === 'yes'
              ? 'Sí'
              : answers.priorWebExperience === 'no'
                ? 'No'
                : String(answers.priorWebExperience || '')
          }
        />
        <InfoRow label="Preocupaciones / dudas" value={String(answers.concerns || '')} />
        <InfoRow label="Notas adicionales" value={String(answers.extraNotes || '')} />
      </Section>

      {/* Score breakdown */}
      {doc.score && Object.keys(doc.score).length > 0 && (
        <Section title="Puntuación por plan">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {Object.entries(doc.score as Record<string, number>)
              .sort(([, a], [, b]) => b - a)
              .map(([pid, pts]) => (
                <div
                  key={pid}
                  className={`rounded-lg px-3 py-2 text-center ${pid === planId ? 'bg-primary/10 border border-primary' : 'bg-muted'}`}
                >
                  <p className="text-xs text-muted-foreground">{PLAN_MAP[pid]?.name || pid}</p>
                  <p
                    className={`text-lg font-bold ${pid === planId ? 'text-primary' : 'text-card-foreground'}`}
                  >
                    {pts}
                  </p>
                </div>
              ))}
          </div>
        </Section>
      )}

      {/* Status management + Convert to client */}
      <QuestionnaireStatusForm
        id={id}
        currentStatus={String(doc.status)}
        currentNotes={doc.adminNotes || ''}
      />
      <div className="rounded-xl border border-border bg-card p-5 mt-4">
        <h3 className="font-semibold text-card-foreground mb-1">Acciones rápidas</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Convierte este lead en un cliente del CRM con un solo clic.
        </p>
        <ConvertToClientButton questionnaireId={id} currentStatus={String(doc.status)} />
      </div>
    </AdminPageLayout>
  );
}
