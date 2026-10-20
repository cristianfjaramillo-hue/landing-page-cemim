import { NextResponse } from 'next/server';
import { getAnalytics, recordMetricEvent } from '@/lib/analyticsStore';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const skipCache = searchParams.get('fresh') === 'true';
    const data = await getAnalytics(skipCache);

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { type, category } = body;

    if (!type || !['page_view', 'download'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid metric type' },
        { status: 400 }
      );
    }

    const updated = await recordMetricEvent(type, category);

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error recording metric event:', error);
    return NextResponse.json(
      { success: false, message: 'Error recording metric event' },
      { status: 500 }
    );
  }
}
