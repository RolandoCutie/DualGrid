import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({ family: 'Helvetica', fonts: [] });

// ─── Paleta reducida — casi monocromo ────────────────────
const INK    = '#0f172a'; // negro azulado para texto y header
const SLATE  = '#334155'; // texto secundario / subtítulos
const MUTED  = '#94a3b8'; // texto terciario / labels
const BORDER = '#e2e8f0'; // bordes
const BG     = '#f8fafc'; // fondo alternativo leve
const WHITE  = '#ffffff';
const ACCENT = '#4f46e5'; // índigo — único acento de color
const GREEN  = '#16a34a'; // solo para el saldo / anticipo
const RED    = '#ef4444'; // solo para cancelado

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: INK,
    backgroundColor: WHITE,
    paddingBottom: 52,
  },

  // ─── HEADER two-panel ────────────────────────────────
  header: { flexDirection: 'row', height: 88 },
  headerLeft: {
    width: 190,
    backgroundColor: INK,
    paddingHorizontal: 26,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  logoMark: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
  },
  logoDot: { color: MUTED },
  logoTagline: { fontSize: 6.5, color: MUTED, marginTop: 5, letterSpacing: 0.3 },
  headerRight: {
    flex: 1,
    backgroundColor: SLATE,
    paddingHorizontal: 26,
    paddingVertical: 18,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    letterSpacing: 2.5,
  },
  docSubtitle: { fontSize: 7, color: '#94a3b8', marginTop: 5 },
  headerMeta: { alignItems: 'flex-end' },
  metaRefLabel: { fontSize: 6.5, color: '#94a3b8', letterSpacing: 1 },
  metaRef: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    marginTop: 3,
  },
  metaDate: { fontSize: 6.5, color: '#94a3b8', marginTop: 4 },

  // ─── Accent line ─────────────────────────────────────
  accentBar: { height: 3, backgroundColor: ACCENT },

  // ─── Status strip ────────────────────────────────────
  statusStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 8,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  statusStripLabel: { fontSize: 7.5, color: MUTED },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 2,
    borderWidth: 1,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
  },

  // ─── Body ────────────────────────────────────────────
  body: { paddingHorizontal: 32, paddingTop: 20 },

  // ─── Section label ───────────────────────────────────
  sectionLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 4,
  },

  // ─── Two-col grid ────────────────────────────────────
  row: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  col: { flex: 1 },

  // ─── Card ────────────────────────────────────────────
  card: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 7,
    gap: 5,
  },
  cardDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: ACCENT },
  cardLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    letterSpacing: 1.2,
  },
  partyName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: INK, marginBottom: 2 },
  partySub: { fontSize: 8, color: MUTED, marginBottom: 3 },
  partyLine: { fontSize: 8.5, color: SLATE, marginBottom: 2 },

  // ─── Info row inside card ─────────────────────────────
  infoRow: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
  infoLabel: { width: 88, fontSize: 8.5, color: MUTED },
  infoValue: { flex: 1, fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },

  // ─── Services table ───────────────────────────────────
  tableWrap: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: INK,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  thText: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    letterSpacing: 0.8,
  },
  colSvc: { flex: 2.5 },
  colDesc: { flex: 3.5 },
  colPrice: { flex: 1.2, textAlign: 'right' },
  tdName: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },
  tdDesc: { fontSize: 8, color: SLATE, lineHeight: 1.4 },
  tdPrice: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: SLATE, textAlign: 'right' },

  // ─── Totals box ───────────────────────────────────────
  totalsOuter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 2, marginBottom: 16 },
  totalsBox: {
    width: 230,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  totalRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: BG,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: INK,
  },
  totalLabel: { fontSize: 8.5, color: MUTED },
  totalValue: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },
  totalValueGreen: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: GREEN },
  totalFinalLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: WHITE },
  totalFinalValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: WHITE },

  // ─── Two-col info blocks ──────────────────────────────
  twoCol: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  infoBlock: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoBlockTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    letterSpacing: 1.2,
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  infoBlockLine: { fontSize: 8, color: SLATE, marginBottom: 3, lineHeight: 1.5 },

  // ─── Notes ────────────────────────────────────────────
  notesBlock: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    letterSpacing: 1.2,
    marginBottom: 5,
  },
  notesText: { fontSize: 8.5, color: SLATE, lineHeight: 1.6 },

  // ─── Signatures ───────────────────────────────────────
  sigDateRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  sigDateLabel: { fontSize: 8, color: MUTED, marginRight: 6 },
  sigDateValue: { fontSize: 8, color: INK },
  sigRow: { flexDirection: 'row', gap: 32 },
  sigCol: { flex: 1 },
  sigSpace: { height: 34 },
  sigLine: { borderTopWidth: 1, borderTopColor: INK, marginBottom: 5 },
  sigName: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },
  sigRole: { fontSize: 7, color: MUTED, marginTop: 2, letterSpacing: 0.5 },
  sigDateField: { fontSize: 7, color: MUTED, marginTop: 8 },

  // ─── Footer ──────────────────────────────────────────
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  footerAccent: { height: 2, backgroundColor: ACCENT },
  footerBottom: {
    backgroundColor: INK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 10,
  },
  footerLogo: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: WHITE },
  footerContact: { fontSize: 7, color: MUTED },
  footerPage: { fontSize: 7, color: MUTED },
});

// ─── Types ───────────────────────────────────────────────
export interface ContractPDFProps {
  contract: {
    _id: string;
    planId: string;
    services: Array<{ name: string; description: string; price: number }>;
    totalAmount: number;
    advanceAmount: number;
    status: string;
    startDate: string;
    deliveryDate: string;
    notes?: string;
  };
  client: {
    name: string;
    email: string;
    phone?: string;
    businessName?: string;
  };
  planName: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: MUTED,
  pending: '#d97706',
  active: ACCENT,
  completed: GREEN,
  cancelled: RED,
};
const STATUS_LABELS: Record<string, string> = {
  draft: 'BORRADOR',
  pending: 'PENDIENTE',
  active: 'ACTIVO',
  completed: 'COMPLETADO',
  cancelled: 'CANCELADO',
};

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}
function today() {
  return new Date().toLocaleDateString('es-ES', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export default function ContractPDF({ contract, client, planName }: ContractPDFProps) {
  const balance = contract.totalAmount - contract.advanceAmount;
  const statusColor = STATUS_COLORS[contract.status] ?? MUTED;
  const statusLabel = STATUS_LABELS[contract.status] ?? contract.status.toUpperCase();
  const ref = contract._id.toString().slice(-8).toUpperCase();

  return (
    <Document title={`Contrato DualGrid — ${client.name}`} author="DualGrid">
      <Page size="A4" style={styles.page}>

        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.logoMark}>
              {'Dual'}
              <Text style={styles.logoDot}>{'Grid'}</Text>
            </Text>
            <Text style={styles.logoTagline}>
              {'Diseño con propósito · Código con precisión'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <View>
              <Text style={styles.docTitle}>{'CONTRATO DE SERVICIO'}</Text>
              <Text style={styles.docSubtitle}>
                {'Acuerdo de prestación de servicios digitales'}
              </Text>
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.metaRefLabel}>{'REF.'}</Text>
              <Text style={styles.metaRef}>{'#' + ref}</Text>
              <Text style={styles.metaDate}>{'Emitido: ' + today()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.accentBar} />

        {/* ── STATUS STRIP ── */}
        <View style={styles.statusStrip}>
          <Text style={styles.statusStripLabel}>{'Estado del contrato'}</Text>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <Text style={{ color: statusColor }}>{statusLabel}</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>

          {/* Partes */}
          <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
            {'PARTES DEL CONTRATO'}
          </Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'PRESTADOR'}</Text>
                </View>
                <Text style={styles.partyName}>{'DualGrid Studio'}</Text>
                <Text style={styles.partySub}>{'Agencia de diseño y desarrollo web'}</Text>
                <Text style={styles.partyLine}>{'hola@dualgrid.dev'}</Text>
                <Text style={styles.partyLine}>{'dualgrid.dev'}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'CLIENTE'}</Text>
                </View>
                <Text style={styles.partyName}>{client.name}</Text>
                {client.businessName
                  ? <Text style={styles.partySub}>{client.businessName}</Text>
                  : null}
                <Text style={styles.partyLine}>{client.email}</Text>
                {client.phone
                  ? <Text style={styles.partyLine}>{client.phone}</Text>
                  : null}
              </View>
            </View>
          </View>

          {/* Proyecto + Finanzas */}
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'DETALLES DEL PROYECTO'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Plan contratado'}</Text>
                  <Text style={styles.infoValue}>{planName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Fecha de inicio'}</Text>
                  <Text style={styles.infoValue}>{fmtDate(contract.startDate)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Fecha de entrega'}</Text>
                  <Text style={styles.infoValue}>{fmtDate(contract.deliveryDate)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'RESUMEN FINANCIERO'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Valor total'}</Text>
                  <Text style={styles.infoValue}>{fmt(contract.totalAmount)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Anticipo recibido'}</Text>
                  <Text style={[styles.infoValue, { color: GREEN }]}>
                    {'− ' + fmt(contract.advanceAmount)}
                  </Text>
                </View>
                <View style={[styles.infoRow, { marginTop: 4, paddingTop: 6, borderTopWidth: 1, borderTopColor: BORDER }]}>
                  <Text style={styles.infoLabel}>{'Saldo pendiente'}</Text>
                  <Text style={[styles.infoValue, { fontSize: 10 }]}>{fmt(balance)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Servicios */}
          <Text style={styles.sectionLabel}>{'ALCANCE DEL TRABAJO'}</Text>
          <View style={styles.tableWrap}>
            <View style={styles.tableHead}>
              <Text style={[styles.colSvc, styles.thText]}>{'SERVICIO'}</Text>
              <Text style={[styles.colDesc, styles.thText]}>{'DESCRIPCIÓN'}</Text>
              <Text style={[styles.colPrice, styles.thText]}>{'PRECIO'}</Text>
            </View>
            {contract.services.map((svc, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.colSvc, styles.tdName]}>{svc.name}</Text>
                <Text style={[styles.colDesc, styles.tdDesc]}>{svc.description}</Text>
                <Text style={[styles.colPrice, styles.tdPrice]}>{fmt(svc.price)}</Text>
              </View>
            ))}
          </View>

          {/* Totales */}
          <View style={styles.totalsOuter}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{'Total del contrato'}</Text>
                <Text style={styles.totalValue}>{fmt(contract.totalAmount)}</Text>
              </View>
              <View style={styles.totalRowHighlight}>
                <Text style={styles.totalLabel}>{'Anticipo abonado'}</Text>
                <Text style={styles.totalValueGreen}>{'− ' + fmt(contract.advanceAmount)}</Text>
              </View>
              <View style={styles.totalRowFinal}>
                <Text style={styles.totalFinalLabel}>{'SALDO A PAGAR'}</Text>
                <Text style={styles.totalFinalValue}>{fmt(balance)}</Text>
              </View>
            </View>
          </View>

          {/* Condiciones + Términos */}
          <View style={styles.twoCol}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>{'CONDICIONES DE PAGO'}</Text>
              <Text style={styles.infoBlockLine}>{'• El anticipo se abona antes de iniciar el proyecto.'}</Text>
              <Text style={styles.infoBlockLine}>{'• El saldo restante se paga contra entrega aprobada.'}</Text>
              <Text style={styles.infoBlockLine}>{'• Métodos: transferencia · PayPal · Zelle'}</Text>
              <Text style={styles.infoBlockLine}>{'• Pagos a: hola@dualgrid.dev'}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>{'TÉRMINOS Y CONDICIONES'}</Text>
              <Text style={styles.infoBlockLine}>{'• DualGrid puede exhibir el proyecto en portafolio.'}</Text>
              <Text style={styles.infoBlockLine}>{'• Hasta 3 rondas de revisión por entregable.'}</Text>
              <Text style={styles.infoBlockLine}>{'• Cambios fuera del alcance se cotizan aparte.'}</Text>
              <Text style={styles.infoBlockLine}>{'• No se devuelve el anticipo si se cancela iniciado.'}</Text>
            </View>
          </View>

          {/* Notas */}
          {contract.notes ? (
            <View style={styles.notesBlock}>
              <Text style={styles.notesTitle}>{'NOTAS DEL PROYECTO'}</Text>
              <Text style={styles.notesText}>{contract.notes}</Text>
            </View>
          ) : null}

          {/* Firmas */}
          <Text style={[styles.sectionLabel, { marginTop: 8 }]}>{'FIRMAS DE ACEPTACIÓN'}</Text>
          <View style={styles.sigDateRow}>
            <Text style={styles.sigDateLabel}>{'Fecha de firma:'}</Text>
            <Text style={styles.sigDateValue}>{'___________________________'}</Text>
          </View>
          <View style={styles.sigRow}>
            <View style={styles.sigCol}>
              <View style={styles.sigSpace} />
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>{'DualGrid Studio'}</Text>
              <Text style={styles.sigRole}>{'PRESTADOR DE SERVICIOS'}</Text>
              <Text style={styles.sigDateField}>{'Fecha: ___________________'}</Text>
            </View>
            <View style={styles.sigCol}>
              <View style={styles.sigSpace} />
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>{client.name}</Text>
              <Text style={styles.sigRole}>{'CLIENTE'}</Text>
              <Text style={styles.sigDateField}>{'Fecha: ___________________'}</Text>
            </View>
          </View>

        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer} fixed>
          <View style={styles.footerAccent} />
          <View style={styles.footerBottom}>
            <Text style={styles.footerLogo}>{'DualGrid'}</Text>
            <Text style={styles.footerContact}>{'hola@dualgrid.dev  ·  dualgrid.dev'}</Text>
            <Text
              style={styles.footerPage}
              render={({ pageNumber, totalPages }) =>
                'Página ' + pageNumber + ' de ' + totalPages
              }
            />
          </View>
        </View>

      </Page>
    </Document>
  );
}
