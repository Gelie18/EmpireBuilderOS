import { NextRequest, NextResponse } from 'next/server';
import { getPnlReport } from '@/lib/data/data-provider';
import type { Period } from '@/lib/data/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start') || '2026-10-01';
    const endDate = searchParams.get('end') || '2026-10-31';
    const label = searchParams.get('label') || 'Oct 2026';

    const period: Period = { type: 'month', startDate, endDate, label };
    const report = await getPnlReport(period);

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch P&L data' },
      { status: 500 }
    );
  }
}
