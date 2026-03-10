import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/flutterwave';

/**
 * Webhook endpoint for Flutterwave payment callbacks
 * Flutterwave sends transaction status updates here
 *
 * URL: /api/webhook
 * Method: POST
 */
export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();

    // Verify the request is from Flutterwave
    const signature = request.headers.get('verif-hash');

    if (!signature) {
      console.warn('[v0] Webhook: Missing verif-hash header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      );
    }

    const isValid = await verifyWebhookSignature(body, signature);

    if (!isValid) {
      console.warn('[v0] Webhook: Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    let payload;
    try {
      payload = JSON.parse(body);
    } catch (error) {
      console.error('[v0] Webhook: Failed to parse JSON body');
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }

    console.log('[v0] Webhook received:', {
      event: payload.event,
      transactionRef: payload.data?.tx_ref,
      status: payload.data?.status,
    });

    // Handle different webhook events
    if (payload.event === 'charge.completed') {
      return await handleChargeCompleted(payload);
    }

    if (payload.event === 'charge.failed') {
      return await handleChargeFailed(payload);
    }

    // Log unhandled events
    console.log('[v0] Webhook: Unhandled event type:', payload.event);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[v0] Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment
 */
async function handleChargeCompleted(payload: any) {
  const transactionRef = payload.data?.tx_ref;
  const amount = payload.data?.amount;
  const currency = payload.data?.currency;
  const customerEmail = payload.data?.customer?.email;
  const status = payload.data?.status;

  console.log('[v0] Processing successful payment:', {
    transactionRef,
    amount,
    status,
    email: customerEmail,
  });

  // TODO: Update your database with transaction details
  // Example:
  // await db.transactions.update({
  //   where: { reference: transactionRef },
  //   data: { status: 'completed', verifiedAt: new Date() }
  // });

  // TODO: Send confirmation email to customer
  // Example:
  // await sendPaymentConfirmationEmail(customerEmail, amount, currency);

  // TODO: Trigger any other business logic
  // Example:
  // await triggerOrderFulfillment(transactionRef);

  return NextResponse.json({
    received: true,
    message: 'Payment processed successfully',
  });
}

/**
 * Handle failed payment
 */
async function handleChargeFailed(payload: any) {
  const transactionRef = payload.data?.tx_ref;
  const reason = payload.data?.processor_response;
  const customerEmail = payload.data?.customer?.email;

  console.log('[v0] Payment failed:', {
    transactionRef,
    reason,
    email: customerEmail,
  });

  // TODO: Update your database with failure details
  // Example:
  // await db.transactions.update({
  //   where: { reference: transactionRef },
  //   data: { status: 'failed', failureReason: reason }
  // });

  // TODO: Send failure notification email
  // Example:
  // await sendPaymentFailureEmail(customerEmail, transactionRef);

  return NextResponse.json({
    received: true,
    message: 'Payment failure recorded',
  });
}
