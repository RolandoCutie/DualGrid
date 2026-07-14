import Invoice from '@/database/invoice.model';
import { isAdminSessionTokenValid } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value ?? '';
  if (!isAdminSessionTokenValid(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()), 10);

  if (isNaN(year) || year < 2000 || year > 2100) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
  }

  await connectDB();

  const start = new Date(`${year}-01-01T00:00:00.000Z`);
  const end = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  const result = await Invoice.aggregate<{ month: number; billed: number; collected: number }>([
    {
      $match: {
        deletedAt: null,
        issueDate: { $gte: start, $lt: end },
        status: { $ne: 'cancelled' },
      },
    },
    {
      $group: {
        _id: { $month: '$issueDate' },
        billed: { $sum: '$totalAmount' },
        collected: {
          $sum: {
            $cond: [{ $eq: ['$status', 'paid'] }, '$totalAmount', 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: '$_id',
        billed: 1,
        collected: 1,
      },
    },
    { $sort: { month: 1 } },
  ]);

  return NextResponse.json(result);
}
