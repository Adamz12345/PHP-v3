import { NextRequest, NextResponse } from 'next/server';
import FlutterwaveService from '@/lib/flutterwave.service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const status = searchParams.get('status');

    const service = new FlutterwaveService();
    
    const params: any = {};
    if (from) params.from = parseInt(from);
    if (to) params.to = parseInt(to);
    if (status) params.status = status;

    const response = await service.getTransactions(params);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('[v0] Get transactions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
