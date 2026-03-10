import { NextRequest, NextResponse } from 'next/server';
import FlutterwaveService from '@/lib/flutterwave.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      amount,
      customer_email,
      customer_name,
      tx_ref,
      duration,
      narration,
    } = body;

    // Validation
    if (!amount || !customer_email || !tx_ref) {
      return NextResponse.json(
        { error: 'Missing required fields: amount, customer_email, tx_ref' },
        { status: 400 }
      );
    }

    const service = new FlutterwaveService();

    const payload = {
      tx_ref: tx_ref || `BANK-${Date.now()}`,
      amount: parseFloat(amount),
      duration: duration || 1,
      currency: 'NGN',
      narration: narration || 'Bank Transfer Payment',
      customer: {
        email: customer_email,
        name: customer_name || 'Customer',
      },
    };

    const response = await service.createBankTransfer(payload);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('[v0] Bank transfer error:', error);
    return NextResponse.json(
      { error: error.message || 'Bank transfer creation failed' },
      { status: 500 }
    );
  }
}
