import { NextRequest, NextResponse } from 'next/server';
import FlutterwaveService from '@/lib/flutterwave.service';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify webhook signature
    const hash = request.headers.get('verif-hash');
    const secret = process.env.FLUTTERWAVE_SECRET_KEY || '';
    
    if (!hash) {
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 401 }
      );
    }

    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    if (hash !== expectedHash) {
      console.error('[v0] Webhook signature verification failed');
      return NextResponse.json(
        { error: 'Signature verification failed' },
        { status: 401 }
      );
    }

    // Process webhook event
    const { event, data } = body;

    if (event === 'charge.completed') {
      // Handle successful payment
      const { id, status, amount, currency, customer, tx_ref, meta } = data;

      console.log('[v0] Payment completed:', {
        id,
        status,
        amount,
        currency,
        tx_ref,
        customer_email: customer?.email,
      });

      // Here you would typically:
      // 1. Update your database with the transaction
      // 2. Send confirmation email
      // 3. Process the order/service

      return NextResponse.json({ status: 'success' });
    }

    if (event === 'charge.failed') {
      // Handle failed payment
      const { id, status, amount, tx_ref } = data;

      console.log('[v0] Payment failed:', { id, status, amount, tx_ref });

      // Update database with failed transaction
      return NextResponse.json({ status: 'failure' });
    }

    return NextResponse.json({ status: 'received' });
  } catch (error: any) {
    console.error('[v0] Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
