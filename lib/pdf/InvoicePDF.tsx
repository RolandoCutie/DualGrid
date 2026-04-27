import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

Font.register({ family: 'Helvetica', fonts: [] });

const PRIMARY = '#6366f1';
const DARK = '#18181b';
const MUTED = '#71717a';
const LIGHT_BG = '#f4f4f5';
const BORDER = '#e4e4e7';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: DARK,
    backgroundColor: '#ffffff',
    padding: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: PRIMARY,
  },
  logo: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: PRIMARY },
  logoSub: { fontSize: 9, color: MUTED, marginTop: 2 },
  invoiceBadge: {
    backgroundColor: PRIMARY,
    color: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  invoiceNumber: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: PRIMARY, marginTop: 6 },
  row: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  col: { flex: 1 },
  sectionLabel: {
    fontSize: 8,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  infoBox: { backgroundColor: LIGHT_BG, borderRadius: 6, padding: 12 },
  infoLine: { marginBottom: 3, fontSize: 10 },
  infoLabel: { color: MUTED },
  infoValue: { fontFamily: 'Helvetica-Bold' },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: PRIMARY,
    color: '#ffffff',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  tableRowAlt: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: LIGHT_BG,
  },
  colDesc: { flex: 4, fontSize: 9 },
  colQty: { flex: 1, fontSize: 9, textAlign: 'center' },
  colUnit: { flex: 2, fontSize: 9, textAlign: 'right' },
  colTotal: { flex: 2, fontSize: 9, textAlign: 'right' },
  colHeader: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  totalsBox: { alignSelf: 'flex-end', width: 220, marginTop: 16 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginTop: 4,
  },
  totalLabel: { color: MUTED, fontSize: 9 },
  totalValue: { fontFamily: 'Helvetica-Bold', fontSize: 9 },
  totalFinalLabel: { color: '#ffffff', fontSize: 11, fontFamily: 'Helvetica-Bold' },
  totalFinalValue: { color: '#ffffff', fontSize: 11, fontFamily: 'Helvetica-Bold' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  notesBox: {
    marginTop: 20,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
    backgroundColor: LIGHT_BG,
    borderRadius: 4,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: MUTED,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  notesText: { fontSize: 9, color: DARK, lineHeight: 1.4 },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingTop: 10,
  },
  footerText: { fontSize: 8, color: MUTED },
});

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
}

const STATUS_COLORS: Record<string, string> = {
  draft: '#a1a1aa',
  sent: '#3b82f6',
  paid: '#22c55e',
  overdue: '#ef4444',
  cancelled: '#71717a',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
};

function fmt(n: number) {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function InvoicePDF({ invoice, client }: InvoicePDFProps) {
  return (
    <Document title={`Factura ${invoice.invoiceNumber} — DualGrid`} author="DualGrid">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>DualGrid</Text>
            <Text style={styles.logoSub}>Diseño con propósito, código con precisión.</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <Text style={styles.invoiceBadge}>Factura</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[invoice.status] ?? '#a1a1aa', color: '#ffffff' },
              ]}
            >
              <Text>{STATUS_LABELS[invoice.status] ?? invoice.status}</Text>
            </View>
          </View>
        </View>

        {/* Client + Dates */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Facturado a</Text>
            <View style={styles.infoBox}>
              <Text style={[styles.infoLine, { fontFamily: 'Helvetica-Bold', fontSize: 11 }]}>
                {client.name}
              </Text>
              {client.businessName && (
                <Text style={[styles.infoLine, { color: MUTED }]}>{client.businessName}</Text>
              )}
              <Text style={styles.infoLine}>{client.email}</Text>
              {client.phone && <Text style={styles.infoLine}>{client.phone}</Text>}
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Detalles</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoLine}>
                <Text style={styles.infoLabel}>Fecha de emisión: </Text>
                <Text style={styles.infoValue}>{fmtDate(invoice.issueDate)}</Text>
              </Text>
              <Text style={styles.infoLine}>
                <Text style={styles.infoLabel}>Fecha de vencimiento: </Text>
                <Text style={styles.infoValue}>{fmtDate(invoice.dueDate)}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Items table */}
        <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>Conceptos</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.colDesc, styles.colHeader]}>Descripción</Text>
          <Text style={[styles.colQty, styles.colHeader]}>Cant.</Text>
          <Text style={[styles.colUnit, styles.colHeader]}>P. Unit.</Text>
          <Text style={[styles.colTotal, styles.colHeader]}>Total</Text>
        </View>
        {invoice.items.map((item, i) => (
          <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={[styles.colDesc, { fontFamily: 'Helvetica-Bold' }]}>
              {item.description}
            </Text>
            <Text style={[styles.colQty, { color: MUTED }]}>{item.quantity}</Text>
            <Text style={styles.colUnit}>{fmt(item.unitPrice)}</Text>
            <Text style={[styles.colTotal, { fontFamily: 'Helvetica-Bold' }]}>
              {fmt(item.total)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{fmt(invoice.subtotal)}</Text>
          </View>
          {invoice.taxRate > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IVA ({invoice.taxRate}%)</Text>
              <Text style={styles.totalValue}>{fmt(invoice.taxAmount)}</Text>
            </View>
          )}
          <View style={styles.totalRowFinal}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValue}>{fmt(invoice.totalAmount)}</Text>
          </View>
        </View>

        {/* Notes */}
        {invoice.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notas</Text>
            <Text style={styles.notesText}>{invoice.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>DualGrid · hola@dualgrid.dev</Text>
          <Text style={styles.footerText}>
            Generado el {new Date().toLocaleDateString('es-ES')}
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}
