import Link from 'next/link';

// ─── Label maps ───────────────────────────────────────────────────────────────

const CONTRACT_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  pending: 'Pendiente firma',
  active: 'Activo',
  completed: 'Completado',
  cancelled: 'Cancelado',
};

const CONTRACT_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-yellow-500/10 text-yellow-600',
  active: 'bg-blue-500/10 text-blue-600',
  completed: 'bg-emerald-500/10 text-emerald-600',
  cancelled: 'bg-red-500/10 text-red-600',
};

const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador',
  sent: 'Enviada',
  paid: 'Pagada',
  overdue: 'Vencida',
  cancelled: 'Cancelada',
};

const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-500/10 text-blue-600',
  paid: 'bg-emerald-500/10 text-emerald-600',
  overdue: 'bg-red-500/10 text-red-600',
  cancelled: 'bg-muted text-muted-foreground',
};

const WEB_QUESTIONNAIRE_STATUS_LABELS: Record<string, string> = {
  new: 'Nuevo',
  reviewed: 'Revisado',
  contacted: 'Contactado',
};

const WEB_QUESTIONNAIRE_STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600',
  reviewed: 'bg-yellow-500/10 text-yellow-600',
  contacted: 'bg-emerald-500/10 text-emerald-600',
};

const PLAN_LABELS: Record<string, string> = {
  landing: 'Landing Page',
  portfolio: 'Portfolio',
  menu_qr: 'Menú QR',
  restaurant: 'Restaurante',
  wp_business: 'WordPress Business',
  ecommerce_store: 'Tienda E-commerce',
  blog: 'Blog',
  custom: 'Proyecto Custom',
  essential: 'Grid Essential ($100)',
  corporate: 'Grid Corporate ($300)',
  global: 'Grid Ecosystem ($550)',
};

const BUSINESS_TYPE_LABELS: Record<string, string> = {
  creative: 'Creativo',
  restaurant: 'Restaurante',
  entrepreneur: 'Emprendedor',
  professional: 'Profesional',
  ecommerce: 'E-commerce',
  blogger: 'Blogger',
  other: 'Otro',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientData {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  businessName: string | null;
  businessType: string | null;
  notes: string | null;
  createdAt: string;
}

interface ContractRow {
  id: string;
  planId: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  startDate: string | null;
  deliveryDate: string | null;
}

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  totalAmount: number;
  status: string;
  issueDate: string | null;
  dueDate: string | null;
}

interface BrandingRow {
  id: string;
  token: string;
  status: string;
  recommendedPlan: string | null;
  createdAt: string;
}

interface WebQuestionnaireRow {
  id: string;
  fullName: string;
  status: string;
  recommendedPlan: string | null;
  createdAt: string;
}

interface Props {
  client: ClientData;
  summary: { totalContracted: number; totalCollected: number; totalPending: number };
  contracts: ContractRow[];
  invoices: InvoiceRow[];
  brandingQuestionnaires: BrandingRow[];
  webQuestionnaires: WebQuestionnaireRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(n);

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClientOverview({
  client,
  summary,
  contracts,
  invoices,
  brandingQuestionnaires,
  webQuestionnaires,
}: Props) {
  return (
    <div className="space-y-8">
      {/* ── Client header ─────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
          {client.businessName && (
            <p className="text-sm font-medium text-muted-foreground">{client.businessName}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
            <span>{client.email}</span>
            {client.phone && <span>{client.phone}</span>}
            {client.businessType && (
              <span className="px-2 py-0.5 rounded-full bg-muted text-xs font-medium">
                {BUSINESS_TYPE_LABELS[client.businessType] ?? client.businessType}
              </span>
            )}
          </div>
          {client.notes && (
            <p className="text-xs text-muted-foreground mt-2 max-w-xl">{client.notes}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Cliente desde {fmtDate(client.createdAt)}
          </p>
        </div>
        <Link
          href={`/admin/dashboard/clients/${client.id}`}
          className="shrink-0 px-4 py-2 text-sm font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
        >
          Editar datos
        </Link>
      </div>

      {/* ── Financial summary ─────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Total contratado
          </p>
          <p className="text-2xl font-bold text-foreground">{fmt(summary.totalContracted)}</p>
          <p className="text-xs text-muted-foreground">{contracts.length} contrato(s)</p>
        </div>
        <div className="bg-card border border-emerald-500/20 rounded-xl p-5 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Cobrado
          </p>
          <p className="text-2xl font-bold text-emerald-500">{fmt(summary.totalCollected)}</p>
          <p className="text-xs text-muted-foreground">
            {invoices.filter((i) => i.status === 'paid').length} factura(s) pagada(s)
          </p>
        </div>
        <div className="bg-card border border-yellow-500/20 rounded-xl p-5 space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
            Pendiente de cobro
          </p>
          <p className="text-2xl font-bold text-yellow-500">{fmt(summary.totalPending)}</p>
          <p className="text-xs text-muted-foreground">
            {invoices.filter((i) => i.status === 'sent' || i.status === 'overdue').length}{' '}
            factura(s)
          </p>
        </div>
      </div>

      {/* ── Contracts ─────────────────────────────────────────── */}
      <Section
        title="Contratos"
        count={contracts.length}
        newHref={`/admin/dashboard/contracts/new`}
        newLabel="+ Nuevo contrato"
      >
        {contracts.length === 0 ? (
          <Empty text="No hay contratos registrados para este cliente." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Plan</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Cobrado</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Entrega</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contracts.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {PLAN_LABELS[c.planId] ?? c.planId}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={CONTRACT_STATUS_LABELS[c.status] ?? c.status}
                      color={CONTRACT_STATUS_COLORS[c.status] ?? 'bg-muted text-muted-foreground'}
                    />
                  </td>
                  <td className="px-4 py-3 text-card-foreground">{fmt(c.totalAmount)}</td>
                  <td className="px-4 py-3 text-emerald-500">{fmt(c.paidAmount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(c.deliveryDate)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/dashboard/contracts/${c.id}?back=/admin/dashboard/clients/${client.id}/overview`}
                      className="text-primary text-xs hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* ── Invoices ──────────────────────────────────────────── */}
      <Section
        title="Facturas"
        count={invoices.length}
        newHref={`/admin/dashboard/invoices/new`}
        newLabel="+ Nueva factura"
      >
        {invoices.length === 0 ? (
          <Empty text="No hay facturas registradas para este cliente." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Nº</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Total</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Emisión</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                  Vencimiento
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-card-foreground">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={INVOICE_STATUS_LABELS[inv.status] ?? inv.status}
                      color={INVOICE_STATUS_COLORS[inv.status] ?? 'bg-muted text-muted-foreground'}
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground">
                    {fmt(inv.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(inv.issueDate)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(inv.dueDate)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/dashboard/invoices/${inv.id}?back=/admin/dashboard/clients/${client.id}/overview`}
                      className="text-primary text-xs hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* ── Branding questionnaires ───────────────────────────── */}
      <Section
        title="Cuestionarios de Branding"
        count={brandingQuestionnaires.length}
        newHref="/admin/dashboard/branding-questionnaires"
        newLabel="+ Nuevo cuestionario"
      >
        {brandingQuestionnaires.length === 0 ? (
          <Empty text="No hay cuestionarios de branding asignados a este cliente." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                  Plan recomendado
                </th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {brandingQuestionnaires.map((bq) => (
                <tr key={bq.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={bq.status === 'completed' ? 'Completado' : 'Pendiente'}
                      color={
                        bq.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-yellow-500/10 text-yellow-600'
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {bq.recommendedPlan
                      ? (PLAN_LABELS[bq.recommendedPlan] ?? bq.recommendedPlan)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(bq.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/dashboard/branding-questionnaires/${bq.id}?back=/admin/dashboard/clients/${client.id}/overview`}
                      className="text-primary text-xs hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>

      {/* ── Web questionnaires ────────────────────────────────── */}
      <Section
        title="Cuestionarios Web"
        count={webQuestionnaires.length}
        newHref="/admin/dashboard/questionnaires"
        newLabel="Ver todos"
      >
        {webQuestionnaires.length === 0 ? (
          <Empty text="No hay cuestionarios web asociados a este correo." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">
                  Plan recomendado
                </th>
                <th className="text-left px-4 py-3 font-semibold text-card-foreground">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {webQuestionnaires.map((wq) => (
                <tr key={wq.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={WEB_QUESTIONNAIRE_STATUS_LABELS[wq.status] ?? wq.status}
                      color={
                        WEB_QUESTIONNAIRE_STATUS_COLORS[wq.status] ??
                        'bg-muted text-muted-foreground'
                      }
                    />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {wq.recommendedPlan
                      ? (PLAN_LABELS[wq.recommendedPlan] ?? wq.recommendedPlan)
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fmtDate(wq.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/dashboard/questionnaires/${wq.id}?back=/admin/dashboard/clients/${client.id}/overview`}
                      className="text-primary text-xs hover:underline"
                    >
                      Ver
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({
  title,
  count,
  newHref,
  newLabel,
  children,
}: {
  title: string;
  count: number;
  newHref: string;
  newLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">{title}</h2>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {count}
          </span>
        </div>
        <Link href={newHref} className="text-xs text-primary hover:underline">
          {newLabel}
        </Link>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="px-5 py-6 text-sm text-muted-foreground">{text}</p>;
}
