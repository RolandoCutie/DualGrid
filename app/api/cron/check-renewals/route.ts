/**
 * GET /api/cron/check-renewals
 *
 * Called daily by Vercel Cron (see vercel.json).
 * Finds all recurring contracts whose renewalDate falls within the configured
 * notification window and sends an email alert to the admin.
 *
 * Security: requests must include the header
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Required env vars:
 *   CRON_SECRET         — random secret string (set in Vercel dashboard)
 *   RESEND_API_KEY      — Resend API key
 *   NEXT_PUBLIC_BASE_URL — canonical base URL (for contract links)
 */
import Contract from '@/database/contract.model';
import { sendRenewalNotification } from '@/lib/email';
import connectDB from '@/lib/mongodb';
import type { Types } from 'mongoose';
import { NextRequest, NextResponse } from 'next/server';

type ContractWithClient = {
  _id: Types.ObjectId;
  clientId: { name: string; email: string; businessName?: string };
  planId: string;
  services?: Array<{ name: string; description: string; price: number }>;
  totalAmount: number;
  currency?: string;
  renewalDate?: Date;
  renewalNotificationDays: number;
  lastRenewalNotificationAt?: Date;
};

// Minimum hours between notifications for the same contract (avoids duplicates
// when rerunning the cron after a failure)
const MIN_HOURS_BETWEEN_NOTIFICATIONS = 20;

export async function GET(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const auth = req.headers.get('authorization') ?? '';
  const secret = process.env.CRON_SECRET;

  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const now = new Date();

    // Find recurring contracts that are not deleted and have a renewalDate set
    const renewingContracts = (await Contract.find({
      isRecurring: true,
      renewalDate: { $exists: true, $ne: null },
      deletedAt: null,
    })
      .populate('clientId', 'name email businessName')
      .lean()) as ContractWithClient[];

    const results: { contractId: string; sent: boolean; reason: string }[] = [];

    for (const contract of renewingContracts) {
      const renewalDate = new Date(contract.renewalDate!);
      const notificationDays = contract.renewalNotificationDays ?? 30;

      // Calculate days until renewal
      const msLeft = renewalDate.getTime() - now.getTime();
      const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));

      // Skip if not yet within the notification window
      if (daysLeft > notificationDays) {
        results.push({
          contractId: String(contract._id),
          sent: false,
          reason: `${daysLeft} days left — outside ${notificationDays}-day window`,
        });
        continue;
      }

      // Skip if already notified recently
      if (contract.lastRenewalNotificationAt) {
        const hoursSinceLast =
          (now.getTime() - new Date(contract.lastRenewalNotificationAt).getTime()) /
          (1000 * 60 * 60);
        if (hoursSinceLast < MIN_HOURS_BETWEEN_NOTIFICATIONS) {
          results.push({
            contractId: String(contract._id),
            sent: false,
            reason: `Already notified ${Math.floor(hoursSinceLast)}h ago`,
          });
          continue;
        }
      }

      // Build the service name from the first service or the planId
      const serviceName = contract.services?.[0]?.name || contract.planId || 'Servicio recurrente';

      const clientData = contract.clientId as {
        name: string;
        email: string;
        businessName?: string;
      };
      const clientName = clientData?.businessName
        ? `${clientData.name} (${clientData.businessName})`
        : (clientData?.name ?? 'Cliente desconocido');

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dualgrid.dev';
      const adminUrl = `${baseUrl}/admin/dashboard/contracts/${String(contract._id)}`;

      const sent = await sendRenewalNotification({
        contractId: String(contract._id),
        clientName,
        serviceName,
        renewalDate,
        daysLeft: Math.max(0, daysLeft),
        amount: contract.totalAmount,
        currency: contract.currency ?? 'USD',
        adminUrl,
      });

      if (sent) {
        // Update lastRenewalNotificationAt so we don't spam
        await Contract.findByIdAndUpdate(contract._id, {
          lastRenewalNotificationAt: now,
        });
      }

      results.push({
        contractId: String(contract._id),
        sent,
        reason: sent ? `Email sent (${daysLeft} days left)` : 'Email failed',
      });
    }

    const sentCount = results.filter((r) => r.sent).length;
    return NextResponse.json({
      ok: true,
      checked: renewingContracts.length,
      notified: sentCount,
      results,
    });
  } catch (err) {
    console.error('[cron/check-renewals]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
