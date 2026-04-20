import { NextRequest, NextResponse } from 'next/server';
import { getAppMode } from '@/lib/config';
import { isAuthenticated } from '@/lib/qbo/auth';
import { fetchAgedReceivables, fetchAgedPayables } from '@/lib/qbo/reports';
import { transformQboAging } from '@/lib/data/transformers';
import { getDemoCashFlow } from '@/lib/data/demo-data';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'ar'; // 'ar' or 'ap'
    const mode = getAppMode();

    if (mode === 'live' && isAuthenticated()) {
      const report = type === 'ar'
        ? await fetchAgedReceivables()
        : await fetchAgedPayables();
      const buckets = transformQboAging(report);
      return NextResponse.json({ buckets });
    }

    // Demo mode
    const demo = getDemoCashFlow();
    const buckets = type === 'ar' ? demo.aging.receivables : demo.aging.payables;
    return NextResponse.json({ buckets });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch aging data' },
      { status: 500 }
    );
  }
}
