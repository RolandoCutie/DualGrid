import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({ family: 'Helvetica', fonts: [] });

const INK = '#0f172a';
const SLATE = '#334155';
const MUTED = '#94a3b8';
const BORDER = '#e2e8f0';
const BG = '#f8fafc';
const WHITE = '#ffffff';
const ACCENT = '#4f46e5';

const s = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: INK,
    backgroundColor: WHITE,
    paddingBottom: 48,
  },
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
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowLast: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rowLabel: { width: 180, fontSize: 8, color: MUTED, paddingRight: 8 },
  rowValue: { flex: 1, fontSize: 8, color: INK, fontFamily: 'Helvetica-Bold' },
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

const Q_LABELS: Record<string, string> = {
  q1: '¿En qué etapa se encuentra tu proyecto o empresa?',
  q2: 'Más allá del logotipo, ¿qué elementos visuales son indispensables?',
  q3: '¿Quién diseñará los contenidos del día a día de la marca?',
  q4: '¿Qué rango de inversión tienes para identidad visual?',
};

const OPTION_LABELS: Record<'A' | 'B' | 'C', Record<string, string>> = {
  A: {
    q1: 'Idea nueva / proyecto personal / negocio local',
    q2: 'Logo, colores y tipografías básicas',
    q3: 'Yo mismo con guía rápida',
    q4: 'Alrededor de $100 USD',
  },
  B: {
    q1: 'PYME establecida buscando diferenciarse',
    q2: 'Universo visual completo + aplicaciones iniciales',
    q3: 'Diseñador o agencia externa',
    q4: 'Entre $300 y $500 USD',
  },
  C: {
    q1: 'Negocio complejo con múltiples subdivisiones',
    q2: 'Sistema completo + submarcas + guías avanzadas',
    q3: 'Múltiples equipos y producción a gran escala',
    q4: 'Más de $550 USD',
  },
};

const PLAN_LABELS: Record<string, string> = {
  essential: 'Grid Essential ($100)',
  corporate: 'Grid Corporate ($300)',
  global: 'Grid Ecosystem ($550)',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  completed: 'Completado',
};

function row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  if (!value || value === '—') return null;
  return (
    <View style={last ? s.rowLast : s.row}>
      <Text style={s.rowLabel}>{label}</Text>
      <Text style={s.rowValue}>{value}</Text>
    </View>
  );
}

export interface BrandingQuestionnairePDFProps {
  id: string;
  token: string;
  clientName?: string;
  clientEmail?: string;
  status: string;
  answers?: Record<string, string>;
  score?: Record<string, number>;
  recommendedPlan?: string;
  adminNotes?: string;
  createdAt: string | null;
}

export default function BrandingQuestionnairePDF({
  id,
  token,
  clientName,
  clientEmail,
  status,
  answers,
  score,
  recommendedPlan,
  adminNotes,
  createdAt,
}: BrandingQuestionnairePDFProps) {
  const dateStr = createdAt
    ? new Date(createdAt).toLocaleDateString('es', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const planLabel = recommendedPlan ? (PLAN_LABELS[recommendedPlan] ?? recommendedPlan) : '—';

  return (
    <Document
      title={`Branding Questionnaire – ${clientName ?? 'Sin nombre'}`}
      author="DualGrid Studio"
    >
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.logoMark}>
              Dual<Text style={s.logoDot}>.</Text>Grid
            </Text>
            <Text style={s.logoTagline}>Design with purpose, code with precision.</Text>
          </View>
          <View style={s.headerRight}>
            <View>
              <Text style={s.docTitle}>CUESTIONARIO BRANDING</Text>
              <Text style={s.docSub}>{clientName ?? 'Sin nombre'}</Text>
            </View>
            <View style={s.headerMeta}>
              <Text style={s.metaLabel}>PLAN RECOMENDADO</Text>
              <Text style={s.metaValue}>{planLabel}</Text>
              <Text style={s.metaDate}>{dateStr}</Text>
            </View>
          </View>
        </View>
        <View style={s.accentBar} />

        <View style={s.strip}>
          <View style={s.stripLeft}>
            <View style={s.stripMeta}>
              <Text style={s.stripLabel}>Estado </Text>
              <Text style={s.stripVal}>{STATUS_LABELS[status] ?? status}</Text>
            </View>
            <View style={s.stripMeta}>
              <Text style={s.stripLabel}>Token </Text>
              <Text style={s.stripVal}>{token}</Text>
            </View>
          </View>
          <View style={s.badge}>
            <Text>BRANDING</Text>
          </View>
        </View>

        <View style={s.body}>
          <View style={s.section}>
            <Text style={s.sectionTitle}>DATOS GENERALES</Text>
            {row({ label: 'ID', value: id })}
            {row({ label: 'Nombre', value: clientName ?? '—' })}
            {row({ label: 'Email', value: clientEmail ?? '—' })}
            {row({ label: 'Plan recomendado', value: planLabel, last: true })}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>RESPUESTAS DEL TEST</Text>
            {row({
              label: Q_LABELS.q1,
              value: answers?.q1
                ? (OPTION_LABELS[answers.q1 as 'A' | 'B' | 'C']?.q1 ?? answers.q1)
                : '—',
            })}
            {row({
              label: Q_LABELS.q2,
              value: answers?.q2
                ? (OPTION_LABELS[answers.q2 as 'A' | 'B' | 'C']?.q2 ?? answers.q2)
                : '—',
            })}
            {row({
              label: Q_LABELS.q3,
              value: answers?.q3
                ? (OPTION_LABELS[answers.q3 as 'A' | 'B' | 'C']?.q3 ?? answers.q3)
                : '—',
            })}
            {row({
              label: Q_LABELS.q4,
              value: answers?.q4
                ? (OPTION_LABELS[answers.q4 as 'A' | 'B' | 'C']?.q4 ?? answers.q4)
                : '—',
              last: true,
            })}
          </View>

          <View style={s.section}>
            <Text style={s.sectionTitle}>PUNTAJE POR PLAN</Text>
            {row({
              label: 'Grid Essential',
              value: score?.essential !== undefined ? String(score.essential) : '—',
            })}
            {row({
              label: 'Grid Corporate',
              value: score?.corporate !== undefined ? String(score.corporate) : '—',
            })}
            {row({
              label: 'Grid Ecosystem',
              value: score?.global !== undefined ? String(score.global) : '—',
              last: true,
            })}
          </View>
        </View>

        {adminNotes && (
          <View style={s.notesBox}>
            <Text style={s.notesLabel}>NOTAS DEL EQUIPO</Text>
            <Text style={s.notesText}>{adminNotes}</Text>
          </View>
        )}

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
