import { Document, Font, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import PDFLogoMark from './PDFLogoMark';

Font.register({ family: 'Helvetica', fonts: [] });

// ─── Paleta reducida ─────────────────────────────────────
const INK = '#0f172a';
const SLATE = '#334155';
const MUTED = '#94a3b8';
const BORDER = '#e2e8f0';
const BG = '#f8fafc';
const WHITE = '#ffffff';
const ACCENT = '#4f46e5';
const GREEN = '#16a34a';
const RED = '#ef4444';
const ORANGE = '#d97706';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: INK,
    backgroundColor: WHITE,
    paddingBottom: 52,
  },

  // ─── HEADER ──────────────────────────────────────────
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
  docSubtitle: { fontSize: 7, color: MUTED, marginTop: 5 },
  headerMeta: { alignItems: 'flex-end' },
  metaNumLabel: { fontSize: 6.5, color: MUTED, letterSpacing: 1 },
  metaNum: {
    fontSize: 15,
    fontFamily: 'Helvetica-Bold',
    color: WHITE,
    marginTop: 3,
  },
  metaDate: { fontSize: 6.5, color: MUTED, marginTop: 4 },

  // ─── Accent bar ──────────────────────────────────────
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
  statusStripLeft: { flexDirection: 'row', gap: 18 },
  statusStripMeta: { fontSize: 8 },
  statusStripLabel: { color: MUTED },
  statusStripValue: { fontFamily: 'Helvetica-Bold', color: INK },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 2,
    borderWidth: 1,
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 0.8,
  },

  // ─── Paid stamp ──────────────────────────────────────
  paidStamp: {
    position: 'absolute',
    top: 125,
    right: 32,
    borderWidth: 3,
    borderColor: GREEN,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    opacity: 0.18,
  },
  paidStampText: {
    fontSize: 26,
    fontFamily: 'Helvetica-Bold',
    color: GREEN,
    letterSpacing: 4,
  },

  // ─── Body ────────────────────────────────────────────
  body: { paddingHorizontal: 32, paddingTop: 18 },

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

  // ─── Info row ────────────────────────────────────────
  infoRow: { flexDirection: 'row', marginBottom: 5, alignItems: 'flex-start' },
  infoLabel: { width: 88, fontSize: 8.5, color: MUTED },
  infoValue: { flex: 1, fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },

  // ─── Items table ─────────────────────────────────────
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
  colDesc: { flex: 3.5 },
  colQty: { flex: 0.8, textAlign: 'center' },
  colUnit: { flex: 1.5, textAlign: 'right' },
  colTotal: { flex: 1.5, textAlign: 'right' },
  tdDesc: { fontSize: 8.5, color: SLATE, lineHeight: 1.4 },
  tdNum: { fontSize: 8.5, color: SLATE, textAlign: 'right' },
  tdNumBold: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK, textAlign: 'right' },

  // ─── Totals box ──────────────────────────────────────
  totalsOuter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2,
    marginBottom: 16,
  },
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
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: INK,
  },
  totalLabel: { fontSize: 8.5, color: MUTED },
  totalValue: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },
  totalFinalLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: WHITE },
  totalFinalValue: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: WHITE },

  // ─── Payment box ─────────────────────────────────────
  payBox: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  payBoxTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    letterSpacing: 1.2,
    marginBottom: 7,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  payBoxLine: { fontSize: 8.5, color: SLATE, marginBottom: 3, lineHeight: 1.5 },
  payBoxDue: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payBoxDueLabel: { fontSize: 8.5, color: MUTED },
  payBoxDueValue: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: INK },
  payBoxDueValueAlert: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: RED },

  // ─── Notes ───────────────────────────────────────────
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
export interface InvoicePDFProps {
  invoice: {
    _id: string;
    invoiceNumber: string;
    items: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;
    status: string;
    issueDate: string;
    dueDate: string;
    notes?: string;
  };
  client: {
    name: string;
    email: string;
    phone?: string;
    businessName?: string;
  };
  logoBase64?: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: MUTED,
  pending: ORANGE,
  paid: GREEN,
  cancelled: RED,
  overdue: RED,
};
const STATUS_LABELS: Record<string, string> = {
  draft: 'BORRADOR',
  pending: 'PENDIENTE',
  paid: 'PAGADO',
  cancelled: 'CANCELADO',
  overdue: 'VENCIDA',
};

function fmt(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
function today() {
  return new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function InvoicePDF({ invoice, client, logoBase64 }: InvoicePDFProps) {
  const isPaid = invoice.status === 'paid';
  const isOverdue =
    invoice.status === 'overdue' ||
    (invoice.status === 'pending' && new Date(invoice.dueDate) < new Date());
  const statusColor = STATUS_COLORS[invoice.status] ?? MUTED;
  const statusLabel = STATUS_LABELS[invoice.status] ?? invoice.status.toUpperCase();

  return (
    <Document title={'Factura ' + invoice.invoiceNumber + ' — DualGrid'} author="DualGrid">
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {logoBase64 ? (
              <Image
                src={logoBase64}
                style={{ maxWidth: 120, maxHeight: 48, objectFit: 'contain' }}
              />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <PDFLogoMark size={36} />
                <View>
                  <Text style={styles.logoMark}>
                    {'Dual'}
                    <Text style={styles.logoDot}>{'Grid'}</Text>
                  </Text>
                  <Text style={styles.logoTagline}>
                    {'Diseño con propósito · Código con precisión'}
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.headerRight}>
            <View>
              <Text style={styles.docTitle}>{'FACTURA'}</Text>
              <Text style={styles.docSubtitle}>{'Documento de cobro por servicios digitales'}</Text>
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.metaNumLabel}>{'N°'}</Text>
              <Text style={styles.metaNum}>{invoice.invoiceNumber}</Text>
              <Text style={styles.metaDate}>{'Emitido: ' + today()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.accentBar} />

        {/* ── STATUS STRIP ── */}
        <View style={styles.statusStrip}>
          <View style={styles.statusStripLeft}>
            <Text style={styles.statusStripMeta}>
              <Text style={styles.statusStripLabel}>{'Emisión: '}</Text>
              <Text style={styles.statusStripValue}>{fmtDate(invoice.issueDate)}</Text>
            </Text>
            <Text style={styles.statusStripMeta}>
              <Text style={styles.statusStripLabel}>{'Vencimiento: '}</Text>
              <Text style={[styles.statusStripValue, isOverdue ? { color: RED } : {}]}>
                {fmtDate(invoice.dueDate)}
              </Text>
            </Text>
          </View>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <Text style={{ color: statusColor }}>{statusLabel}</Text>
          </View>
        </View>

        {/* ── PAID STAMP ── */}
        {isPaid ? (
          <View style={styles.paidStamp}>
            <Text style={styles.paidStampText}>{'PAGADO'}</Text>
          </View>
        ) : null}

        {/* ── BODY ── */}
        <View style={styles.body}>
          {/* Partes */}
          <Text style={[styles.sectionLabel, { marginTop: 14 }]}>{'PARTES'}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'PROVEEDOR'}</Text>
                </View>
                <Text style={styles.partyName}>{'DualGrid Studio'}</Text>
                <Text style={styles.partySub}>{'Agencia de diseño y desarrollo web'}</Text>
                <Text style={styles.partyLine}>{'dualgrid.studio@gmail.com'}</Text>
                <Text style={styles.partyLine}>{'dualgrid.dev'}</Text>
              </View>
            </View>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'FACTURADO A'}</Text>
                </View>
                <Text style={styles.partyName}>{client.name}</Text>
                {client.businessName ? (
                  <Text style={styles.partySub}>{client.businessName}</Text>
                ) : null}
                <Text style={styles.partyLine}>{client.email}</Text>
                {client.phone ? <Text style={styles.partyLine}>{client.phone}</Text> : null}
              </View>
            </View>
          </View>

          {/* Items */}
          <Text style={styles.sectionLabel}>{'DETALLE DE SERVICIOS'}</Text>
          <View style={styles.tableWrap}>
            <View style={styles.tableHead}>
              <Text style={[styles.colDesc, styles.thText]}>{'DESCRIPCIÓN'}</Text>
              <Text style={[styles.colQty, styles.thText, { textAlign: 'center' }]}>{'CANT.'}</Text>
              <Text style={[styles.colUnit, styles.thText, { textAlign: 'right' }]}>
                {'PRECIO UNIT.'}
              </Text>
              <Text style={[styles.colTotal, styles.thText, { textAlign: 'right' }]}>
                {'TOTAL'}
              </Text>
            </View>
            {invoice.items.map((item, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.colDesc, styles.tdDesc]}>{item.description}</Text>
                <Text style={[styles.colQty, styles.tdNum, { textAlign: 'center' }]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.colUnit, styles.tdNum]}>{fmt(item.unitPrice)}</Text>
                <Text style={[styles.colTotal, styles.tdNumBold]}>{fmt(item.total)}</Text>
              </View>
            ))}
          </View>

          {/* Totales */}
          <View style={styles.totalsOuter}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{'Subtotal'}</Text>
                <Text style={styles.totalValue}>{fmt(invoice.subtotal)}</Text>
              </View>
              {invoice.taxRate > 0 ? (
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>{'IVA (' + invoice.taxRate + '%)'}</Text>
                  <Text style={styles.totalValue}>{fmt(invoice.taxAmount)}</Text>
                </View>
              ) : null}
              <View style={styles.totalRowFinal}>
                <Text style={styles.totalFinalLabel}>{'TOTAL'}</Text>
                <Text style={styles.totalFinalValue}>{fmt(invoice.totalAmount)}</Text>
              </View>
            </View>
          </View>

          {/* Instrucciones de pago */}
          {!isPaid ? (
            <View style={styles.payBox}>
              <Text style={styles.payBoxTitle}>{'INSTRUCCIONES DE PAGO'}</Text>
              <Text style={styles.payBoxLine}>{'Transferencia bancaria · PayPal · Zelle'}</Text>
              <Text style={styles.payBoxLine}>
                {'Cuenta/email de pago: dualgrid.studio@gmail.com'}
              </Text>
              <Text style={styles.payBoxLine}>{'Referencia: ' + invoice.invoiceNumber}</Text>
              <View style={styles.payBoxDue}>
                <Text style={styles.payBoxDueLabel}>{'Fecha límite de pago'}</Text>
                <Text style={isOverdue ? styles.payBoxDueValueAlert : styles.payBoxDueValue}>
                  {fmtDate(invoice.dueDate)}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Notas */}
          {invoice.notes ? (
            <View style={styles.notesBlock}>
              <Text style={styles.notesTitle}>{'NOTAS'}</Text>
              <Text style={styles.notesText}>{invoice.notes}</Text>
            </View>
          ) : null}

          {/* Agradecimiento */}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: BORDER,
              marginTop: 10,
              paddingTop: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 8.5, color: MUTED }}>
              {'Gracias por confiar en DualGrid — dualgrid.studio@gmail.com'}
            </Text>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer} fixed>
          <View style={styles.footerAccent} />
          <View style={styles.footerBottom}>
            <Text style={styles.footerLogo}>{'DualGrid'}</Text>
            <Text style={styles.footerContact}>{'dualgrid.studio@gmail.com  ·  dualgrid.dev'}</Text>
            <Text
              style={styles.footerPage}
              render={({ pageNumber, totalPages }) => 'Página ' + pageNumber + ' de ' + totalPages}
            />
          </View>
        </View>
      </Page>
    </Document>
  );
}
