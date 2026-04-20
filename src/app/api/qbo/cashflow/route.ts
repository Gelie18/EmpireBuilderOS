import { NextRequest, NextResponse } from 'next/server';
import { getCashFlow } from '@/lib/data/data-provider';
import type { Period } from '@/lib/data/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('start') || '2026-04-01';
    const endDate = searchParams.get('end') || '2026-04-30';
    const label = searchParams.get('label') || 'Apr 2026';

    const period: Period = { type: 'month', startDate, endDate, label };
    const report = await getCashFlow(period);

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cash flow data' },
      { status: 500 }
    );
  }
}
