/**
 * Email sending utility using Resend.
 *
 * Required env vars:
 *   RESEND_API_KEY   — API key from resend.com (free tier: 3 000 emails/month)
 *   RESEND_FROM      — Verified sender, e.g. "DualGrid <notificaciones@tudominio.com>"
 *                      While testing you can use "DualGrid <onboarding@resend.dev>"
 */
import { Resend } from 'resend';

const FROM = process.env.RESEND_FROM ?? 'DualGrid <onboarding@resend.dev>';
const ADMIN_EMAIL = 'dualgrid.studio@gmail.com';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RenewalNotificationData {
  contractId: string;
  clientName: string;
  serviceName: string; // e.g. "Hosting anual", "Dominio"
  renewalDate: Date;
  daysLeft: number;
  amount: number;
  currency: string;
  adminUrl: string; // full URL to the contract in the admin panel
}

// ─── Templates ───────────────────────────────────────────────────────────────

function buildRenewalHtml(d: RenewalNotificationData): string {
  const fmtDate = d.renewalDate.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const fmtAmount = `${d.currency} $${d.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  const urgencyColor = d.daysLeft <= 7 ? '#ef4444' : d.daysLeft <= 15 ? '#d97706' : '#0891b2';
  const urgencyLabel =
    d.daysLeft === 0
      ? '🚨 ¡VENCE HOY!'
      : d.daysLeft === 1
        ? '⚠️ Vence mañana'
        : `⏰ Vence en ${d.daysLeft} días`;

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f7ff;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7ff;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:#0f172a;padding:28px 36px;">
            <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
              Dual<span style="color:#0891b2;">Grid</span>
            </span>
          </td>
        </tr>

        <!-- Urgency banner -->
        <tr>
          <td style="background:${urgencyColor};padding:12px 36px;">
            <p style="margin:0;font-size:14px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">
              ${urgencyLabel}
            </p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 36px;">
            <h1 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#0f172a;">
              Renovación próxima: ${d.serviceName}
            </h1>
            <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
              El servicio del cliente <strong style="color:#0f172a;">${d.clientName}</strong> está próximo a vencer.
            </p>

            <!-- Details card -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:20px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#64748b;width:160px;">Cliente</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:600;color:#0f172a;">${d.clientName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#64748b;">Servicio</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:600;color:#0f172a;">${d.serviceName}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#64748b;">Fecha de renovación</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:600;color:${urgencyColor};">${fmtDate}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#64748b;">Monto de renovación</td>
                      <td style="padding:6px 0;font-size:13px;font-weight:600;color:#0f172a;">${fmtAmount}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-size:13px;color:#64748b;">ID contrato</td>
                      <td style="padding:6px 0;font-size:12px;font-family:monospace;color:#64748b;">${d.contractId}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Action prompt -->
            <div style="background:#eff6ff;border-left:4px solid #0891b2;border-radius:4px;padding:14px 18px;margin-bottom:28px;">
              <p style="margin:0;font-size:13px;color:#1e40af;line-height:1.6;">
                <strong>Acción recomendada:</strong> Contacta a <strong>${d.clientName}</strong> para
                informarle que su servicio de <strong>${d.serviceName}</strong> vence el <strong>${fmtDate}</strong>.
                Solicita el pago de renovación por <strong>${fmtAmount}</strong> y genera la factura correspondiente.
              </p>
            </div>

            <!-- CTA Button -->
            <a href="${d.adminUrl}"
              style="display:inline-block;background:#0891b2;color:#ffffff;font-size:14px;font-weight:600;
                     padding:12px 24px;border-radius:8px;text-decoration:none;letter-spacing:0.2px;">
              Ver contrato en el panel →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 36px;">
            <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.6;">
              Este correo fue enviado automáticamente por el sistema de DualGrid.<br>
              dualgrid.studio@gmail.com · dualgrid.dev
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a renewal reminder to the admin email.
 * Returns true if the email was sent successfully.
 */
export async function sendRenewalNotification(data: RenewalNotificationData): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping email');
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject =
    data.daysLeft === 0
      ? `🚨 HOY vence el servicio de ${data.clientName} — ${data.serviceName}`
      : data.daysLeft <= 7
        ? `⚠️ En ${data.daysLeft} días vence: ${data.clientName} — ${data.serviceName}`
        : `⏰ Renovación en ${data.daysLeft} días: ${data.clientName} — ${data.serviceName}`;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject,
      html: buildRenewalHtml(data),
    });

    if (error) {
      console.error('[email] Resend error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[email] sendRenewalNotification failed:', err);
    return false;
  }
}
