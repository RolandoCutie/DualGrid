import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({ family: 'Helvetica', fonts: [] });

// ─── Palette ──────────────────────────────────────────────────────────────────
const INK = '#0f172a';
const SLATE = '#334155';
const MUTED = '#94a3b8';
const BORDER = '#e2e8f0';
const BG = '#f8fafc';
const WHITE = '#ffffff';
const ACCENT = '#4f46e5';

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: INK,
    backgroundColor: WHITE,
    paddingBottom: 48,
  },
  // Header
  header: { flexDirection: 'row', height: 80 },
  headerLeft: {
    width: 180,
    backgroundColor: INK,
    paddingHorizontal: 24,
    paddingVertical: 18,
    justifyContent: 'center',
  },
  logoMark: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: WHITE },
  logoDot: { color: MUTED },
  logoTagline: { fontSize: 6, color: MUTED, marginTop: 4, letterSpacing: 0.3 },
  headerRight: {
    flex: 1,
    backgroundColor: SLATE,
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 2 },
  docSub: { fontSize: 7, color: MUTED, marginTop: 3 },
  headerMeta: { alignItems: 'flex-end' },
  metaLabel: { fontSize: 6, color: MUTED, letterSpacing: 0.8 },
  metaValue: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: WHITE, marginTop: 2 },
  metaDate: { fontSize: 6.5, color: MUTED, marginTop: 3 },
  accentBar: { height: 3, backgroundColor: ACCENT },
  // Status strip
  strip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 7,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  stripLeft: { flexDirection: 'row', gap: 20 },
  stripMeta: { fontSize: 8 },
  stripLabel: { color: MUTED },
  stripVal: { fontFamily: 'Helvetica-Bold', color: INK },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 2,
    borderWidth: 1,
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.6,
    borderColor: ACCENT,
    color: ACCENT,
  },
  // Body
  body: { paddingHorizontal: 28, paddingTop: 16 },
  section: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sectionTitle: {
    backgroundColor: BG,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: SLATE,
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowLast: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  rowLabel: { width: 160, fontSize: 8, color: MUTED, paddingRight: 8 },
  rowValue: { flex: 1, fontSize: 8, color: INK, fontFamily: 'Helvetica-Bold' },
  // Notes
  notesBox: {
    marginHorizontal: 28,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    backgroundColor: BG,
  },
  notesLabel: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: SLATE, marginBottom: 5 },
  notesText: { fontSize: 8, color: INK, lineHeight: 1.5 },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: BG,
  },
  footerText: { fontSize: 7, color: MUTED },
});

// ─── Label maps ───────────────────────────────────────────────────────────────
const BT: Record<string, string> = {
  creative: 'Creativo / Artista',
  restaurant: 'Restaurante / Bar',
  entrepreneur: 'Emprendedor',
  professional: 'Profesional',
  ecommerce: 'E-commerce',
  blogger: 'Blogger / Creador de contenido',
  other: 'Otro',
};
const BA: Record<string, string> = {
  new: 'Nuevo (aún no lanzado)',
  under_1: 'Menos de 1 año',
  '1_3': '1–3 años',
  '3_5': '3–5 años',
  over_5: 'Más de 5 años',
};
const OP: Record<string, string> = {
  none: 'Sin presencia online',
  social_only: 'Solo redes sociales',
  has_website: 'Ya tiene sitio web',
};
const GOAL: Record<string, string> = {
  more_clients: 'Conseguir más clientes',
  show_work: 'Mostrar mi trabajo',
  give_info: 'Dar información del negocio',
  credibility: 'Generar credibilidad',
  sell_online: 'Vender online',
  reservations: 'Gestionar reservas / citas',
  grow_audience: 'Crecer mi audiencia',
};
const ACTION: Record<string, string> = {
  whatsapp_contact: 'Contactar por WhatsApp',
  contact_form: 'Formulario de contacto',
  call: 'Llamar por teléfono',
  book_appointment: 'Reservar cita / mesa',
  buy_product: 'Comprar producto / servicio',
  view_portfolio: 'Ver portafolio',
  download: 'Descargar',
  request_quote: 'Solicitar cotización',
  subscribe: 'Suscribirse al newsletter',
};
const PAGES: Record<string, string> = {
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
const FEAT: Record<string, string> = {
  whatsapp_btn: 'Botón WhatsApp',
  contact_form: 'Formulario de contacto',
  map: 'Mapa de ubicación',
  gallery: 'Galería',
  video_banner: 'Video en portada',
  newsletter: 'Newsletter',
  booking: 'Reservas online',
  live_chat: 'Chat en vivo',
  multilang: 'Multiidioma',
  reviews: 'Reseñas / testimonios',
  social_feed: 'Feed de redes',
  faq: 'FAQ',
};
const BUDGET: Record<string, string> = {
  under_150: 'Menos de $150',
  '150_300': '$150–$300',
  '300_500': '$300–$500',
  '500_800': '$500–$800',
  '800_1500': '$800–$1,500',
  over_1500: 'Más de $1,500',
};
const DEADLINE: Record<string, string> = {
  urgent: 'Lo antes posible',
  '2_weeks': 'En 2 semanas',
  '1_month': 'En 1 mes',
  '2_3_months': 'En 2–3 meses',
  no_rush: 'Sin prisa',
};
const CMS: Record<string, string> = {
  frequently: 'Sí, frecuentemente',
  occasionally: 'Sí, ocasionalmente',
  no: 'No necesito editar',
};
const STYLE: Record<string, string> = {
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
const LANG: Record<string, string> = {
  es: 'Solo español',
  en: 'Solo inglés',
  both: 'Bilingüe (ES + EN)',
};
const REFERRAL: Record<string, string> = {
  social_media: 'Redes sociales',
  referral: 'Recomendación',
  google: 'Google',
  other: 'Otro',
};
const PLAN_NAMES: Record<string, string> = {
  landing: 'Landing Express',
  portfolio: 'Portafolio Pro',
  menu_qr: 'Menú Digital QR',
  restaurant: 'Restaurante Pro',
  wp_business: 'Sitio Empresarial',
  ecommerce_store: 'Tienda Online',
  blog: 'Blog Profesional',
  custom: 'Plan Personalizado',
};
const STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  reviewed: 'Revisado',
  contacted: 'Contactado',
};

function l(map: Record<string, string>, key: string | undefined): string {
  if (!key) return '—';
  return map[key] ?? key;
}
function lArr(map: Record<string, string>, keys: unknown): string {
  if (!Array.isArray(keys) || keys.length === 0) return '—';
  return (keys as string[]).map((k) => map[k] ?? k).join(' · ');
}
function str(v: unknown): string {
  if (!v) return '—';
  return String(v);
}
function bool(v: unknown): string {
  return v ? 'Sí' : 'No';
}

// ─── Row helper ───────────────────────────────────────────────────────────────
function R({ label, value, last }: { label: string; value: string; last?: boolean }) {
  if (!value || value === '—') return null;
  return (
    <View style={last ? s.rowLast : s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface QuestionnairePDFProps {
  answers: Record<string, unknown>;
  recommendedPlan: string;
  selectedPlan?: string | null;
  status: string;
  adminNotes?: string;
  createdAt: string | null;
}

// ─── Document ─────────────────────────────────────────────────────────────────
export default function QuestionnairePDF({
  answers: a,
  recommendedPlan,
  selectedPlan,
  status,
  adminNotes,
  createdAt,
}: QuestionnairePDFProps) {
  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const planName = PLAN_NAMES[recommendedPlan] ?? recommendedPlan;
  const selectedPlanName = selectedPlan ? (PLAN_NAMES[selectedPlan] ?? selectedPlan) : null;

  return (
    <Document title={`Cuestionario – ${str(a.fullName)}`} author="DualGrid Studio">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.logoMark}>
              Dual<Text style={s.logoDot}>.</Text>Grid
            </Text>
            <Text style={s.logoTagline}>Design with purpose, code with precision.</Text>
          </View>
          <View style={s.headerRight}>
            <View>
              <Text style={s.docTitle}>CUESTIONARIO WEB</Text>
              <Text style={s.docSub}>{str(a.fullName)}</Text>
            </View>
            <View style={s.headerMeta}>
              <Text style={s.metaLabel}>PLAN RECOMENDADO</Text>
              <Text style={s.metaValue}>{planName}</Text>
              <Text style={s.metaDate}>{dateStr}</Text>
            </View>
          </View>
        </View>
        <View style={s.accentBar} />

        {/* Status strip */}
        <View style={s.strip}>
          <View style={s.stripLeft}>
            <View style={s.stripMeta}>
              <Text style={s.stripLabel}>Estado </Text>
              <Text style={s.stripVal}>{STATUS_LABELS[status] ?? status}</Text>
            </View>
            {selectedPlanName && selectedPlanName !== planName && (
              <View style={s.stripMeta}>
                <Text style={s.stripLabel}>Plan elegido </Text>
                <Text style={s.stripVal}>{selectedPlanName}</Text>
              </View>
            )}
          </View>
          <View style={s.badge}>
            <Text>{planName.toUpperCase()}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={s.body}>
          {/* 1. Contacto */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>1. INFORMACIÓN DE CONTACTO</Text>
            <R label="Nombre completo" value={str(a.fullName)} />
            <R label="Nombre del negocio" value={str(a.businessName)} />
            <R label="Email" value={str(a.email)} />
            <R label="Teléfono" value={str(a.phone)} />
            <R label="Cómo nos encontró" value={l(REFERRAL, str(a.referralSource))} last />
          </View>

          {/* 2. Negocio */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>2. NEGOCIO</Text>
            <R label="Tipo de negocio" value={l(BT, str(a.businessType))} />
            <R label="Antigüedad" value={l(BA, str(a.businessAge))} />
            <R label="Descripción" value={str(a.businessDescription)} />
            <R label="Servicios principales" value={str(a.mainServices)} />
            <R label="Público objetivo" value={str(a.targetAudience)} />
            <R label="Presencia online" value={l(OP, str(a.onlinePresence))} last />
          </View>

          {/* 3. Objetivos */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>3. OBJETIVOS Y FUNCIONALIDADES</Text>
            <R label="Objetivos principales" value={lArr(GOAL, a.primaryGoal)} />
            <R label="Acción principal (CTA)" value={lArr(ACTION, a.primaryAction)} />
            <R label="Páginas deseadas" value={lArr(PAGES, a.desiredPages)} />
            <R label="Funcionalidades especiales" value={lArr(FEAT, a.specialFeatures)} />
            <R label="Diferenciación" value={str(a.differentiation)} last />
          </View>

          {/* 4. Presupuesto */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>4. PRESUPUESTO Y PLAZOS</Text>
            <R label="Presupuesto aproximado" value={l(BUDGET, str(a.budget))} />
            <R label="Plazo deseado" value={l(DEADLINE, str(a.deadline))} />
            <R label="¿Tiene dominio?" value={bool(a.hasDomain)} />
            <R label="¿Necesita CMS?" value={l(CMS, str(a.needsCMS))} />
            <R label="Definición de éxito" value={str(a.successDefinition)} last />
          </View>

          {/* 5. Estilo */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>5. ESTILO Y MARCA</Text>
            <R label="Estilo visual" value={lArr(STYLE, a.visualStyle)} />
            <R label="¿Tiene logo?" value={bool(a.hasLogo)} />
            <R label="Colores de marca" value={str(a.brandColors)} />
            <R label="Sitios de referencia" value={str(a.referenceWebsites)} />
            <R label="Sensación visual" value={str(a.visualFeeling)} />
            <R label="Esencia de la marca" value={str(a.brandEssence)} />
            <R label="Valores de marca" value={str(a.brandValues)} />
            <R label="Lo que NO quiere" value={str(a.brandNoDos)} />
            <R label="Palabras en el logo" value={str(a.logoWords)} />
            <R label="Elementos para el logo" value={str(a.logoSpecificElements)} />
            <R label="Identidad visual previa" value={str(a.priorBrandPresence)} />
            <R label="Inspiración de logos" value={str(a.logoInspiration)} last />
          </View>

          {/* 6. Contenido */}
          <View style={s.section}>
            <Text style={s.sectionTitle}>6. CONTENIDO Y DETALLES FINALES</Text>
            <R label="¿Tiene fotos profesionales?" value={bool(a.hasPhotos)} />
            <R label="¿Tiene textos redactados?" value={bool(a.hasTexts)} />
            <R label="Contenido a aportar / cuándo" value={str(a.clientContentDeadline)} />
            <R label="Idioma(s) del sitio" value={l(LANG, str(a.siteLanguages))} />
            <R label="Redes sociales" value={str(a.socialMedia)} />
            <R
              label="Experiencia previa con dev"
              value={
                a.priorWebExperience === 'yes'
                  ? 'Sí'
                  : a.priorWebExperience === 'no'
                    ? 'No'
                    : str(a.priorWebExperience)
              }
            />
            <R label="Preocupaciones" value={str(a.concerns)} />
            <R label="Notas adicionales" value={str(a.extraNotes)} last />
          </View>
        </View>

        {/* Admin notes */}
        {adminNotes && (
          <View style={s.notesBox}>
            <Text style={s.notesLabel}>NOTAS DEL EQUIPO</Text>
            <Text style={s.notesText}>{adminNotes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>DualGrid Studio · dualgrid.com</Text>
          <Text style={s.footerText}>Generado el {new Date().toLocaleDateString('es')}</Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
