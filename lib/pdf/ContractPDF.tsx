import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({ family: 'Helvetica', fonts: [] });

// ─── Palette ─────────────────────────────────────────────
const INK = '#0f172a';
const SLATE = '#334155';
const MUTED = '#94a3b8';
const BORDER = '#e2e8f0';
const BG = '#f8fafc';
const WHITE = '#ffffff';
const ACCENT = '#4f46e5';
const ACCENT_LIGHT = '#eef2ff';
const GREEN = '#16a34a';
const GREEN_LIGHT = '#f0fdf4';
const RED = '#ef4444';
const AMBER = '#d97706';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: INK,
    backgroundColor: WHITE,
    paddingBottom: 56,
  },

  // ─── HEADER ──────────────────────────────────────────
  header: { flexDirection: 'row', height: 96 },
  headerLeft: {
    width: 200,
    backgroundColor: INK,
    paddingHorizontal: 28,
    paddingVertical: 22,
    justifyContent: 'center',
  },
  logoMark: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: WHITE },
  logoDot: { color: ACCENT },
  logoTagline: { fontSize: 6, color: MUTED, marginTop: 6, letterSpacing: 0.4 },
  headerRight: {
    flex: 1,
    backgroundColor: SLATE,
    paddingHorizontal: 28,
    paddingVertical: 18,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  docTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 2.5 },
  docSubtitle: { fontSize: 7, color: MUTED, marginTop: 5 },
  headerMeta: { alignItems: 'flex-end' },
  metaRefLabel: { fontSize: 6, color: MUTED, letterSpacing: 1.2 },
  metaRef: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: WHITE, marginTop: 2 },
  metaDate: { fontSize: 6.5, color: MUTED, marginTop: 5 },

  // ─── Accent bar ──────────────────────────────────────
  accentBar: { height: 3, backgroundColor: ACCENT },

  // ─── Status strip ────────────────────────────────────
  statusStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 9,
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
  body: { paddingHorizontal: 36, paddingTop: 18 },

  // ─── Section heading (accent left-border style) ──────
  sectionLabel: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: ACCENT,
    letterSpacing: 1.8,
    marginBottom: 9,
    marginTop: 6,
    paddingBottom: 5,
    paddingLeft: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
  },

  // ─── Two-col grid ────────────────────────────────────
  row: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  col: { flex: 1 },

  // ─── Card ────────────────────────────────────────────
  card: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  cardLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 6 },
  cardDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: ACCENT },
  cardLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: ACCENT,
    letterSpacing: 1.2,
  },
  partyName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: INK, marginBottom: 2 },
  partySub: { fontSize: 8, color: MUTED, marginBottom: 4 },
  partyLine: { fontSize: 8.5, color: SLATE, marginBottom: 2.5 },

  // ─── Info row inside card ─────────────────────────────
  infoRow: { flexDirection: 'row', marginBottom: 5.5, alignItems: 'flex-start' },
  infoLabel: { width: 95, fontSize: 8.5, color: MUTED },
  infoValue: { flex: 1, fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },

  // ─── Intro clause box ────────────────────────────────
  introBox: {
    backgroundColor: ACCENT_LIGHT,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    borderRadius: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  introText: { fontSize: 8, color: SLATE, lineHeight: 1.65 },

  // ─── Services table ───────────────────────────────────
  tableWrap: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: INK,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: BG,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  colNum: { width: 18 },
  colSvc: { flex: 2.2 },
  colDesc: { flex: 3.6 },
  colPrice: { flex: 1.2, textAlign: 'right' },
  thText: { fontSize: 6.5, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 0.9 },
  tdNum: { fontSize: 8, color: MUTED, width: 18 },
  tdName: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: INK },
  tdDesc: { fontSize: 8, color: SLATE, lineHeight: 1.45 },
  tdPrice: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: SLATE, textAlign: 'right' },
  tdIncluded: { fontSize: 8, color: GREEN, textAlign: 'right' },

  // ─── Totals box ───────────────────────────────────────
  totalsOuter: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 4, marginBottom: 16 },
  totalsBox: {
    width: 240,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  totalRowHighlight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: GREEN_LIGHT,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
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
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  infoBlockTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: ACCENT,
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  infoBlockLine: { fontSize: 8, color: SLATE, marginBottom: 3.5, lineHeight: 1.5 },

  // ─── Excluded items ───────────────────────────────────
  excludedBlock: {
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 4,
    backgroundColor: '#fff5f5',
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 14,
  },
  excludedHeader: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: RED,
    letterSpacing: 1.2,
    marginBottom: 8,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#fecaca',
  },
  excludedRow: { flexDirection: 'row', marginBottom: 4, gap: 7, alignItems: 'flex-start' },
  excludedMark: { fontSize: 7.5, color: RED },
  excludedText: { fontSize: 8, color: SLATE, flex: 1, lineHeight: 1.45 },
  excludedFootnote: { fontSize: 7, color: MUTED, marginTop: 7, lineHeight: 1.5 },

  // ─── Notes ────────────────────────────────────────────
  notesBlock: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 12,
  },
  notesTitle: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  notesText: { fontSize: 8.5, color: SLATE, lineHeight: 1.65 },

  // ─── Signature section ────────────────────────────────
  sigWrap: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 6,
  },
  sigCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  sigPartyLabel: {
    fontSize: 6.5,
    fontFamily: 'Helvetica-Bold',
    color: ACCENT,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  sigSpace: { height: 40 },
  sigLine: { borderTopWidth: 1, borderTopColor: INK, marginBottom: 6 },
  sigName: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: INK },
  sigRole: { fontSize: 7, color: MUTED, marginTop: 2, letterSpacing: 0.5 },
  sigField: { fontSize: 7, color: MUTED, marginTop: 7 },

  // ─── Footer ──────────────────────────────────────────
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  footerAccent: { height: 2, backgroundColor: ACCENT },
  footerBottom: {
    backgroundColor: INK,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingVertical: 11,
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
    revisionsIncluded?: number;
    revisionsUsed?: number;
    excludedItems?: string[];
    contractTerms?: string;
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

export default function ContractPDF({ contract, client, planName }: ContractPDFProps) {
  const balance = contract.totalAmount - contract.advanceAmount;
  const statusColor = STATUS_COLORS[contract.status] ?? MUTED;
  const statusLabel = STATUS_LABELS[contract.status] ?? contract.status.toUpperCase();
  const ref = contract._id.toString().slice(-8).toUpperCase();
  const revisionsLeft =
    contract.revisionsIncluded !== undefined && contract.revisionsUsed !== undefined
      ? contract.revisionsIncluded - contract.revisionsUsed
      : null;
  const revisionsColor =
    revisionsLeft === null
      ? MUTED
      : revisionsLeft === 0
        ? RED
        : revisionsLeft === 1
          ? AMBER
          : GREEN;

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
            <Text style={styles.logoTagline}>{'DISEÑO · DESARROLLO · MARCA'}</Text>
          </View>
          <View style={styles.headerRight}>
            <View>
              <Text style={styles.docTitle}>{'CONTRATO DE SERVICIO'}</Text>
              <Text style={styles.docSubtitle}>{'Plan: ' + planName}</Text>
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.metaRefLabel}>{'N.° DE CONTRATO'}</Text>
              <Text style={styles.metaRef}>{'#' + ref}</Text>
              <Text style={styles.metaDate}>{'Emitido: ' + today()}</Text>
            </View>
          </View>
        </View>
        <View style={styles.accentBar} />

        {/* ── STATUS STRIP ── */}
        <View style={styles.statusStrip}>
          <Text style={styles.statusStripLabel}>{'Estado actual del contrato'}</Text>
          <View style={[styles.statusBadge, { borderColor: statusColor }]}>
            <Text style={{ color: statusColor }}>{statusLabel}</Text>
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>
          {/* Objeto del contrato */}
          <View style={[styles.introBox, { marginTop: 14 }]}>
            <Text style={styles.introText}>
              {'Por medio del presente documento, DualGrid Studio (en adelante "el Prestador") y el cliente identificado en este contrato acuerdan la prestación de los servicios de diseño y desarrollo digital correspondientes al plan "' +
                planName +
                '". Ambas partes declaran conocer y aceptar íntegramente las condiciones aquí establecidas.'}
            </Text>
          </View>

          {/* Partes */}
          <Text style={styles.sectionLabel}>{'01  ·  PARTES DEL CONTRATO'}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'PRESTADOR DE SERVICIOS'}</Text>
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
                {client.businessName ? (
                  <Text style={styles.partySub}>{client.businessName}</Text>
                ) : null}
                <Text style={styles.partyLine}>{client.email}</Text>
                {client.phone ? <Text style={styles.partyLine}>{client.phone}</Text> : null}
              </View>
            </View>
          </View>

          {/* Proyecto + Finanzas */}
          <Text style={styles.sectionLabel}>{'02  ·  DETALLES DEL PROYECTO'}</Text>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.card}>
                <View style={styles.cardLabelRow}>
                  <View style={styles.cardDot} />
                  <Text style={styles.cardLabel}>{'CRONOGRAMA'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Plan'}</Text>
                  <Text style={styles.infoValue}>{planName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Inicio'}</Text>
                  <Text style={styles.infoValue}>{fmtDate(contract.startDate)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{'Entrega estimada'}</Text>
                  <Text style={styles.infoValue}>{fmtDate(contract.deliveryDate)}</Text>
                </View>
                {contract.revisionsIncluded !== undefined && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{'Revisiones incl.'}</Text>
                    <Text style={styles.infoValue}>
                      {String(contract.revisionsIncluded) +
                        ' ronda' +
                        (contract.revisionsIncluded === 1 ? '' : 's')}
                    </Text>
                  </View>
                )}
                {revisionsLeft !== null && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>{'Revisiones restantes'}</Text>
                    <Text style={[styles.infoValue, { color: revisionsColor }]}>
                      {String(revisionsLeft) + ' ronda' + (revisionsLeft === 1 ? '' : 's')}
                    </Text>
                  </View>
                )}
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
                  <Text style={styles.infoLabel}>{'Anticipo (50 %)'}</Text>
                  <Text style={[styles.infoValue, { color: GREEN }]}>
                    {'− ' + fmt(contract.advanceAmount)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.infoRow,
                    { marginTop: 5, paddingTop: 6, borderTopWidth: 1, borderTopColor: BORDER },
                  ]}
                >
                  <Text style={styles.infoLabel}>{'Saldo a pagar'}</Text>
                  <Text style={[styles.infoValue, { fontSize: 11, color: ACCENT }]}>
                    {fmt(balance)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Servicios */}
          <Text style={styles.sectionLabel}>{'03  ·  ALCANCE DEL TRABAJO — ENTREGABLES'}</Text>
          <View style={styles.tableWrap}>
            <View style={styles.tableHead}>
              <Text style={[styles.colNum, styles.thText]}>{'#'}</Text>
              <Text style={[styles.colSvc, styles.thText]}>{'ENTREGABLE / SERVICIO'}</Text>
              <Text style={[styles.colDesc, styles.thText]}>{'DESCRIPCIÓN DETALLADA'}</Text>
              <Text style={[styles.colPrice, styles.thText]}>{'VALOR'}</Text>
            </View>
            {contract.services.map((svc, i) => (
              <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.colNum, styles.tdNum]}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={[styles.colSvc, styles.tdName]}>{svc.name}</Text>
                <Text style={[styles.colDesc, styles.tdDesc]}>{svc.description}</Text>
                <Text
                  style={[styles.colPrice, svc.price === 0 ? styles.tdIncluded : styles.tdPrice]}
                >
                  {svc.price === 0 ? 'INCLUIDO' : fmt(svc.price)}
                </Text>
              </View>
            ))}
          </View>

          {/* Totales */}
          <View style={styles.totalsOuter}>
            <View style={styles.totalsBox}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{'Subtotal de servicios'}</Text>
                <Text style={styles.totalValue}>{fmt(contract.totalAmount)}</Text>
              </View>
              <View style={styles.totalRowHighlight}>
                <Text style={styles.totalLabel}>{'Anticipo recibido'}</Text>
                <Text style={styles.totalValueGreen}>{'− ' + fmt(contract.advanceAmount)}</Text>
              </View>
              <View style={styles.totalRowFinal}>
                <Text style={styles.totalFinalLabel}>{'SALDO A PAGAR'}</Text>
                <Text style={styles.totalFinalValue}>{fmt(balance)}</Text>
              </View>
            </View>
          </View>

          {/* No incluido */}
          {contract.excludedItems && contract.excludedItems.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>{'04  ·  NO INCLUIDO EN ESTE PLAN'}</Text>
              <View style={styles.excludedBlock}>
                <Text style={styles.excludedHeader}>{'ÍTEMS FUERA DEL ALCANCE'}</Text>
                {contract.excludedItems.map((item, i) => (
                  <View key={i} style={styles.excludedRow}>
                    <Text style={styles.excludedMark}>{'✕'}</Text>
                    <Text style={styles.excludedText}>{item}</Text>
                  </View>
                ))}
                <Text style={styles.excludedFootnote}>
                  {
                    'Cualquier servicio no listado en la sección "Alcance del trabajo" constituye un cambio de alcance y será cotizado por separado antes de ejecutarse.'
                  }
                </Text>
              </View>
            </>
          )}

          {/* Condiciones + Revisiones */}
          <Text style={styles.sectionLabel}>{'05  ·  CONDICIONES GENERALES'}</Text>
          <View style={styles.twoCol}>
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>{'CONDICIONES DE PAGO'}</Text>
              <Text style={styles.infoBlockLine}>
                {'• Anticipo del 50 % antes de iniciar el proyecto.'}
              </Text>
              <Text style={styles.infoBlockLine}>
                {'• Saldo restante contra entrega y aprobación final.'}
              </Text>
              <Text style={styles.infoBlockLine}>
                {'• Métodos aceptados: transferencia · PayPal · Zelle'}
              </Text>
              <Text style={styles.infoBlockLine}>{'• Pagos a: hola@dualgrid.dev'}</Text>
              <Text style={styles.infoBlockLine}>
                {'• Ningún archivo final se entrega sin pago total.'}
              </Text>
            </View>
            <View style={styles.infoBlock}>
              <Text style={styles.infoBlockTitle}>{'REVISIONES Y CAMBIOS'}</Text>
              {contract.revisionsIncluded !== undefined && (
                <Text style={styles.infoBlockLine}>
                  {'• Este plan incluye ' +
                    String(contract.revisionsIncluded) +
                    ' ronda' +
                    (contract.revisionsIncluded === 1 ? '' : 's') +
                    ' de revisión.'}
                </Text>
              )}
              <Text style={styles.infoBlockLine}>{'• Rondas adicionales: USD $50 por ronda.'}</Text>
              <Text style={styles.infoBlockLine}>
                {'• Cambios de alcance se cotizan por separado.'}
              </Text>
              <Text style={styles.infoBlockLine}>
                {'• Anticipo no reembolsable una vez iniciado.'}
              </Text>
              <Text style={styles.infoBlockLine}>
                {'• Retrasos por materiales pendientes = plazo extendido.'}
              </Text>
            </View>
          </View>

          {/* Notas */}
          {contract.notes ? (
            <View style={styles.notesBlock}>
              <Text style={styles.notesTitle}>{'NOTAS Y ACUERDOS ADICIONALES'}</Text>
              <Text style={styles.notesText}>{contract.notes}</Text>
            </View>
          ) : null}

          {/* Firmas */}
          <Text style={[styles.sectionLabel, { marginTop: 10 }]}>
            {'06  ·  FIRMAS DE ACEPTACIÓN'}
          </Text>
          <View style={styles.sigWrap}>
            <View style={styles.sigCol}>
              <Text style={styles.sigPartyLabel}>{'PRESTADOR DE SERVICIOS'}</Text>
              <View style={styles.sigSpace} />
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>{'DualGrid Studio'}</Text>
              <Text style={styles.sigRole}>{'Agencia de Diseño y Desarrollo Web'}</Text>
              <Text style={styles.sigField}>{'Email: hola@dualgrid.dev'}</Text>
              <Text style={styles.sigField}>{'Fecha: ___________________________'}</Text>
            </View>
            <View style={styles.sigCol}>
              <Text style={styles.sigPartyLabel}>{'CLIENTE'}</Text>
              <View style={styles.sigSpace} />
              <View style={styles.sigLine} />
              <Text style={styles.sigName}>{client.name}</Text>
              {client.businessName ? (
                <Text style={styles.sigRole}>{client.businessName}</Text>
              ) : null}
              <Text style={styles.sigField}>{'Email: ' + client.email}</Text>
              <Text style={styles.sigField}>{'Fecha: ___________________________'}</Text>
              <Text style={styles.sigField}>{'ID / Pasaporte: ___________________'}</Text>
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
              render={({ pageNumber, totalPages }) => 'Página ' + pageNumber + ' de ' + totalPages}
            />
          </View>
        </View>
      </Page>

      {/* ── PÁGINA 2+: TÉRMINOS Y CONDICIONES COMPLETOS ── */}
      {contract.contractTerms ? (
        <Page size="A4" style={styles.page}>
          {/* Header compacto */}
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
                <Text style={styles.docTitle}>{'TÉRMINOS Y CONDICIONES'}</Text>
                <Text style={styles.docSubtitle}>
                  {'Condiciones generales del contrato — Ref. #' + ref}
                </Text>
              </View>
              <View style={styles.headerMeta}>
                <Text style={styles.metaRefLabel}>{'PLAN'}</Text>
                <Text style={[styles.metaRef, { fontSize: 9 }]}>{planName.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          <View style={styles.accentBar} />

          <View style={[styles.body, { paddingTop: 18 }]}>
            <Text style={[styles.sectionLabel, { marginTop: 0 }]}>
              {'CONDICIONES GENERALES DEL CONTRATO'}
            </Text>
            <View style={[styles.notesBlock, { marginBottom: 20 }]}>
              {contract.contractTerms.split('\n').map((line, i) => {
                const isSectionTitle =
                  line.startsWith('CONTRATO') ||
                  line.endsWith(':') ||
                  (line === line.toUpperCase() && line.trim().length > 0 && !line.startsWith('•'));
                return (
                  <Text
                    key={i}
                    style={{
                      fontSize: isSectionTitle ? 8 : 7.5,
                      fontFamily: isSectionTitle ? 'Helvetica-Bold' : 'Helvetica',
                      color: isSectionTitle ? INK : SLATE,
                      marginBottom: isSectionTitle ? 5 : 2,
                      marginTop: isSectionTitle ? 8 : 0,
                      lineHeight: 1.55,
                    }}
                  >
                    {line || ' '}
                  </Text>
                );
              })}
            </View>

            {/* Firma de aceptación en página de términos */}
            <Text style={[styles.sectionLabel, { marginTop: 4 }]}>
              {'DECLARACIÓN DE ACEPTACIÓN'}
            </Text>
            <View style={[styles.notesBlock, { marginBottom: 16 }]}>
              <Text style={[styles.notesText, { fontSize: 8 }]}>
                {
                  'Al firmar este documento, ambas partes declaran haber leído, comprendido y aceptado íntegramente todos los términos y condiciones establecidos en el presente contrato, incluyendo el alcance del trabajo, la política de revisiones, las condiciones de pago y las cláusulas generales aquí detalladas.'
                }
              </Text>
            </View>
            <View style={styles.sigWrap}>
              <View style={styles.sigCol}>
                <Text style={styles.sigPartyLabel}>{'PRESTADOR DE SERVICIOS'}</Text>
                <View style={styles.sigSpace} />
                <View style={styles.sigLine} />
                <Text style={styles.sigName}>{'DualGrid Studio'}</Text>
                <Text style={styles.sigRole}>{'ACEPTA LOS TÉRMINOS'}</Text>
                <Text style={styles.sigField}>{'Fecha: ___________________________'}</Text>
              </View>
              <View style={styles.sigCol}>
                <Text style={styles.sigPartyLabel}>{'CLIENTE'}</Text>
                <View style={styles.sigSpace} />
                <View style={styles.sigLine} />
                <Text style={styles.sigName}>{client.name}</Text>
                <Text style={styles.sigRole}>{'ACEPTA LOS TÉRMINOS'}</Text>
                <Text style={styles.sigField}>{'Fecha: ___________________________'}</Text>
                <Text style={styles.sigField}>{'ID / Pasaporte: ___________________'}</Text>
              </View>
            </View>
          </View>

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
      ) : null}
    </Document>
  );
}
