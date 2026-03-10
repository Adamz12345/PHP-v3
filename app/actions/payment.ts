'use server';

import {
  initiatePayment,
  generateTransactionRef,
  verifyPayment,
} from '@/lib/flutterwave';

/**
 * Server action to initiate a payment transaction
 * Validates the amount server-side to prevent client tampering
 */
export async function initiatePaymentAction(
  email: string,
  fullName: string,
  phoneNumber: string,
  amount: number,
  currency: string = 'NGN',
  description?: string,
  meta?: Record<string, unknown>
) {
  try {
    // Server-side validation - CRITICAL for security
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }

    if (!fullName || fullName.trim().length < 2) {
      throw new Error('Invalid full name');
    }

    if (!phoneNumber || phoneNumber.trim().length < 7) {
      throw new Error('Invalid phone number');
    }

    // Validate amount
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Invalid amount');
    }

    // Prevent extremely large amounts (adjust based on your business logic)
    const MAX_TRANSACTION_AMOUNT = 999999999; // e.g., 999,999,999.99
    if (amount > MAX_TRANSACTION_AMOUNT) {
      throw new Error('Amount exceeds maximum limit');
    }

    // Round to 2 decimal places to avoid floating-point issues
    const validatedAmount = Math.round(amount * 100) / 100;

    // Generate unique transaction reference
    const transactionRef = generateTransactionRef();

    console.log('[v0] Initiating payment:', {
      transactionRef,
      amount: validatedAmount,
      email,
      fullName,
    });

    // Call Flutterwave API
    const response = await initiatePayment({
      amount: validatedAmount,
      email,
      phone_number: phoneNumber,
      full_name: fullName,
      transaction_ref: transactionRef,
      currency,
      description,
      meta,
    });

    if (response.status !== 'success') {
      throw new Error(response.message || 'Failed to initiate payment');
    }

    return {
      success: true,
      data: {
        paymentLink: response.data?.link,
        transactionRef,
      },
    };
  } catch (error) {
    console.error('[v0] Payment initiation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment initiation failed',
    };
  }
}

/**
 * Server action to verify a payment transaction
 * Called from the callback page to confirm payment status
 */
export async function verifyPaymentAction(transactionId: string) {
  try {
    if (!transactionId || typeof transactionId !== 'string') {
      throw new Error('Invalid transaction ID');
    }

    console.log('[v0] Verifying payment:', { transactionId });

    const response = await verifyPayment(transactionId);

    if (response.status !== 'success') {
      throw new Error(response.message || 'Payment verification failed');
    }

    const transactionData = response.data;

    // Map Flutterwave status to application status
    const status = mapFlutterwaveStatus(transactionData?.status);

    return {
      success: true,
      data: {
        transactionRef: transactionData?.tx_ref,
        status,
        amount: transactionData?.amount,
        currency: transactionData?.currency,
        customerEmail: transactionData?.customer?.email,
        customerName: transactionData?.customer?.name,
      },
    };
  } catch (error) {
    console.error('[v0] Payment verification error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment verification failed',
    };
  }
}

/**
 * Map Flutterwave status to application status
 */
function mapFlutterwaveStatus(flutterwaveStatus?: string): string {
  const statusMap: Record<string, string> = {
    successful: 'completed',
    failed: 'failed',
    cancelled: 'cancelled',
    pending: 'pending',
  };

  return statusMap[flutterwaveStatus?.toLowerCase() || ''] || 'unknown';
}
