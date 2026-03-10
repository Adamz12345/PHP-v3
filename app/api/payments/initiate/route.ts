import { NextRequest, NextResponse } from 'next/server';
import FlutterwaveService from '@/lib/flutterwave.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      amount,
      customer_email,
      customer_name,
      customer_phone,
      tx_ref,
      description,
      redirect_url,
      meta,
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
      tx_ref: tx_ref || `TX-${Date.now()}`,
      amount: parseFloat(amount),
      currency: 'NGN',
      redirect_url: redirect_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment-callback`,
      meta: meta || {},
      customer: {
        email: customer_email,
        phonenumber: customer_phone || '',
        name: customer_name || 'Customer',
      },
      customizations: {
        title: 'Payment',
        description: description || 'Payment for your order',
        logo: process.env.NEXT_PUBLIC_LOGO_URL || '',
      },
    };

    const response = await service.initializePayment(payload);

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error('[v0] Payment initiation error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
}
