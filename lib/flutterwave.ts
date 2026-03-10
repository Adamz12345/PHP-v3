/**
 * Flutterwave API Utility
 * Handles all Flutterwave API calls with proper authentication and error handling
 */

const FLUTTERWAVE_BASE_URL = 'https://api.flutterwave.com/v3';
const SECRET_KEY = process.env.FLW_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('FLW_SECRET_KEY environment variable is not set');
}

interface FlutterwaveConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
}

interface FlutterwaveResponse<T> {
  status: string;
  message: string;
  data?: T;
}

/**
 * Make authenticated requests to Flutterwave API
 */
export async function makeFlutterwaveRequest<T>(
  endpoint: string,
  config: FlutterwaveConfig
): Promise<FlutterwaveResponse<T>> {
  const url = `${FLUTTERWAVE_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${SECRET_KEY}`,
  };

  const options: RequestInit = {
    method: config.method,
    headers,
  };

  if (config.body) {
    options.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      console.error('[v0] Flutterwave API Error:', {
        status: response.status,
        error: data,
      });
      throw new Error(`Flutterwave API error: ${data.message || 'Unknown error'}`);
    }

    return data;
  } catch (error) {
    console.error('[v0] Flutterwave Request Failed:', error);
    throw error;
  }
}

/**
 * Initiate a payment transaction
 */
export async function initiatePayment(payload: {
  amount: number;
  email: string;
  phone_number: string;
  full_name: string;
  transaction_ref: string;
  currency?: string;
  redirect_url?: string;
  meta?: Record<string, unknown>;
  description?: string;
}): Promise<FlutterwaveResponse<{ link: string }>> {
  const body = {
    tx_ref: payload.transaction_ref,
    amount: payload.amount,
    currency: payload.currency || 'NGN',
    redirect_url:
      payload.redirect_url ||
      `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`,
    meta: {
      user_id: payload.meta?.user_id,
      order_id: payload.meta?.order_id,
      ...payload.meta,
    },
    customer: {
      email: payload.email,
      phone_number: payload.phone_number,
      name: payload.full_name,
    },
    customizations: {
      title: 'Payment',
      description: payload.description || 'Secure payment',
      logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
    },
  };

  return makeFlutterwaveRequest<{ link: string }>('/payments', {
    method: 'POST',
    body,
  });
}

/**
 * Verify a payment transaction
 */
export async function verifyPayment(transactionId: string): Promise<
  FlutterwaveResponse<{
    id: number;
    tx_ref: string;
    status: string;
    amount: number;
    currency: string;
    customer: {
      id: number;
      email: string;
      name: string;
    };
    meta: Record<string, unknown>;
  }>
> {
  return makeFlutterwaveRequest(`/transactions/${transactionId}/verify`, {
    method: 'GET',
  });
}

/**
 * Generate transaction reference
 */
export function generateTransactionRef(): string {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Verify webhook signature
 * Flutterwave sends webhooks with x-flutterwave-signature header
 */
export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  const crypto = await import('crypto');
  const hash = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(body)
    .digest('hex');

  return hash === signature;
}
