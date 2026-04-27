import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';

// Register a standard sans-serif font
Font.register({
  family: 'Helvetica',
  fonts: [],
});

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
  // Header
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
  contractBadge: {
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
  // Two column row
  row: { flexDirection: 'row', gap: 20, marginBottom: 24 },
  col: { flex: 1 },
  // Section
  sectionLabel: {
    fontSize: 8,
    color: MUTED,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
    fontFamily: 'Helvetica-Bold',
  },
  infoBox: {
    backgroundColor: LIGHT_BG,
    borderRadius: 6,
    padding: 12,
  },
  infoLine: { marginBottom: 3, fontSize: 10 },
  infoLabel: { color: MUTED },
  infoValue: { fontFamily: 'Helvetica-Bold' },
  // Services table
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
  colName: { flex: 3, fontSize: 9 },
  colDesc: { flex: 4, fontSize: 9, color: MUTED },
  colPrice: { flex: 1, fontSize: 9, textAlign: 'right' },
  colHeader: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: '#ffffff' },
  // Totals
  totalsBox: {
    alignSelf: 'flex-end',
    width: 220,
    marginTop: 16,
  },
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
  // Footer
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
  // Status badge
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
  },
  // Notes
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
});

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
  draft: '#a1a1aa',
  pending: '#f59e0b',
  active: PRIMARY,
  completed: '#22c55e',
  cancelled: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending: 'Pendiente',
  active: 'Activo',
  completed: 'Completado',
  cancelled: 'Cancelado',
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

export default function ContractPDF({ contract, client, planName }: ContractPDFProps) {
  const balance = contract.totalAmount - contract.advanceAmount;

  return (
    <Document title={`Contrato DualGrid — ${client.name}`} author="DualGrid">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>DualGrid</Text>
            <Text style={styles.logoSub}>Diseño con propósito, código con precisión.</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Text style={styles.contractBadge}>Contrato de Servicio</Text>
            <Text style={{ fontSize: 8, color: MUTED }}>
              ID: {contract._id.toString().slice(-8).toUpperCase()}
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: STATUS_COLORS[contract.status] ?? '#a1a1aa', color: '#ffffff' },
              ]}
            >
              <Text>{STATUS_LABELS[contract.status] ?? contract.status}</Text>
            </View>
          </View>
        </View>

        {/* Client + Project info */}
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Cliente</Text>
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
            <Text style={styles.sectionLabel}>Proyecto</Text>
            <View style={styles.infoBox}>
              <Text style={[styles.infoLine]}>
                <Text style={styles.infoLabel}>Plan: </Text>
                <Text style={styles.infoValue}>{planName}</Text>
              </Text>
              <Text style={[styles.infoLine]}>
                <Text style={styles.infoLabel}>Inicio: </Text>
                <Text style={styles.infoValue}>{fmtDate(contract.startDate)}</Text>
              </Text>
              <Text style={[styles.infoLine]}>
                <Text style={styles.infoLabel}>Entrega: </Text>
                <Text style={styles.infoValue}>{fmtDate(contract.deliveryDate)}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Services table */}
        <Text style={[styles.sectionLabel, { marginBottom: 8 }]}>Servicios incluidos</Text>
        <View style={styles.tableHeader}>
          <Text style={[styles.colName, styles.colHeader]}>Servicio</Text>
          <Text style={[styles.colDesc, styles.colHeader]}>Descripción</Text>
          <Text style={[styles.colPrice, styles.colHeader]}>Precio</Text>
        </View>
        {contract.services.map((svc, i) => (
          <View key={i} style={i % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={[styles.colName, { fontFamily: 'Helvetica-Bold' }]}>{svc.name}</Text>
            <Text style={styles.colDesc}>{svc.description}</Text>
            <Text style={[styles.colPrice, { fontFamily: 'Helvetica-Bold' }]}>
              {fmt(svc.price)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{fmt(contract.totalAmount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Anticipo pagado</Text>
            <Text style={[styles.totalValue, { color: '#22c55e' }]}>
              {fmt(contract.advanceAmount)}
            </Text>
          </View>
          <View style={styles.totalRowFinal}>
            <Text style={styles.totalFinalLabel}>Saldo pendiente</Text>
            <Text style={styles.totalFinalValue}>{fmt(balance)}</Text>
          </View>
        </View>

        {/* Notes */}
        {contract.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notas del proyecto</Text>
            <Text style={styles.notesText}>{contract.notes}</Text>
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
