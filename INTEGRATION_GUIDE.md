# Flutterwave Integration Guide

Complete guide for integrating Flutterwave payments into your Next.js application.

## Table of Contents

1. [Overview](#overview)
2. [Security Architecture](#security-architecture)
3. [API Integration](#api-integration)
4. [Frontend Implementation](#frontend-implementation)
5. [Backend Implementation](#backend-implementation)
6. [Webhook Handling](#webhook-handling)
7. [Testing & Debugging](#testing--debugging)
8. [Production Checklist](#production-checklist)

## Overview

This integration implements the **Flutterwave Standard Redirect** flow, which:

1. User submits payment form
2. Server validates and creates transaction
3. User redirected to Flutterwave hosted page
4. User completes payment
5. Flutterwave redirects back with status
6. Webhook confirms payment asynchronously

### Architecture Diagram

```
Client (Browser)
    ↓
CheckoutForm.tsx (Client Component)
    ↓
initiatePaymentAction() (Server Action)
    ↓
lib/flutterwave.ts (API Client)
    ↓
Flutterwave API
    ├→ Returns payment link
    └→ Later sends webhook
    ↓
User completes payment
    ↓
Redirect to /payment/callback
    ↓
verifyPaymentAction() (Server Action)
    ↓
Display status

(Parallel) Webhook → /api/webhook → Process payment
```

## Security Architecture

### Environment Variables

```
NEXT_PUBLIC_FLW_PUBLIC_KEY  → Browser (safe)
FLW_SECRET_KEY              → Server only (secret)
NEXT_PUBLIC_APP_URL         → Browser (public)
```

### Security Layers

1. **Server-Side Validation**
   - All amounts validated on server
   - Email, phone, name validated
   - Floating-point precision handled
   - No client-submitted amounts trusted

2. **Bearer Token Auth**
   - All API calls use `Authorization: Bearer ${FLW_SECRET_KEY}`
   - Secret key never exposed to client

3. **Webhook Verification**
   - HMAC-SHA256 signature verification
   - Uses `verif-hash` header
   - Payload integrity confirmed

4. **HTTPS Requirement**
   - Production must use HTTPS
   - Webhooks require HTTPS endpoint
   - Environment: `NEXT_PUBLIC_APP_URL=https://...`

## API Integration

### Making API Calls

All API communication goes through `lib/flutterwave.ts`:

```typescript
import {
  initiatePayment,
  verifyPayment,
  generateTransactionRef,
  verifyWebhookSignature,
} from '@/lib/flutterwave';

// Initiate payment
const response = await initiatePayment({
  amount: 5000,
  email: 'customer@example.com',
  phone_number: '+234800000000',
  full_name: 'John Doe',
  transaction_ref: 'tx_1234567890',
  currency: 'NGN',
  description: 'Order #123',
});

// Verify payment
const verification = await verifyPayment(transactionId);

// Generate reference
const ref = generateTransactionRef(); // tx_1234567890_abc123
```

### Error Handling

API errors are caught and logged:

```typescript
try {
  const response = await makeFlutterwaveRequest(endpoint, config);
} catch (error) {
  console.error('[v0] Flutterwave Request Failed:', error);
  // Error is re-thrown for caller to handle
}
```

## Frontend Implementation

### CheckoutForm Component

Located in `components/CheckoutForm.tsx`:

```typescript
export default function CheckoutForm({
  initialAmount = 5000,
  currency = 'NGN',
  description = 'Payment for your order',
}: CheckoutFormProps)
```

**Features:**
- Real-time form validation
- Loading states during submission
- Error message display
- Amount input with currency formatting
- Security notice footer

**Form Fields:**
- Full Name (required)
- Email Address (required)
- Phone Number (required)
- Amount (required, > 0)

### Form Submission Flow

```typescript
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // 1. Client-side validation
  // 2. Call initiatePaymentAction
  // 3. Get payment link from response
  // 4. Redirect: window.location.href = paymentLink
};
```

## Backend Implementation

### Server Actions

Located in `app/actions/payment.ts`:

#### `initiatePaymentAction()`

```typescript
export async function initiatePaymentAction(
  email: string,
  fullName: string,
  phoneNumber: string,
  amount: number,
  currency?: string,
  description?: string,
  meta?: Record<string, unknown>
)
```

**Validation:**
- Email format check
- Name length check (minimum 2 characters)
- Phone number length check (minimum 7 characters)
- Amount validation (> 0, finite, ≤ MAX_AMOUNT)
- Floating-point precision (rounded to 2 decimals)

**Response:**
```typescript
{
  success: true,
  data: {
    paymentLink: string,
    transactionRef: string
  }
}
// or
{
  success: false,
  error: string
}
```

#### `verifyPaymentAction()`

```typescript
export async function verifyPaymentAction(transactionId: string)
```

**Returns:**
```typescript
{
  success: true,
  data: {
    transactionRef: string,
    status: 'completed' | 'failed' | 'cancelled' | 'pending',
    amount: number,
    currency: string,
    customerEmail: string,
    customerName: string
  }
}
```

## Webhook Handling

### Webhook Endpoint

Located in `app/api/webhook/route.ts`:

**Configuration in Flutterwave Dashboard:**
1. Settings → Webhooks
2. Add URL: `https://yourdomain.com/api/webhook`
3. Events: `charge.completed`, `charge.failed`

### Webhook Flow

```typescript
POST /api/webhook

Headers:
  verif-hash: <HMAC-SHA256 signature>
  Content-Type: application/json

Body:
{
  event: "charge.completed" | "charge.failed",
  data: {
    tx_ref: "tx_1234567890",
    amount: 5000,
    currency: "NGN",
    status: "successful" | "failed",
    customer: {
      email: "customer@example.com",
      name: "John Doe"
    }
  }
}
```

### Signature Verification

```typescript
const body = await request.text();
const signature = request.headers.get('verif-hash');

const isValid = await verifyWebhookSignature(body, signature);

if (!isValid) {
  return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
}
```

### Event Handlers

**charge.completed:**
```typescript
async function handleChargeCompleted(payload: any) {
  const { tx_ref, amount, currency, customer } = payload.data;
  
  // TODO: Database operations
  // TODO: Send confirmation email
  // TODO: Trigger fulfillment
}
```

**charge.failed:**
```typescript
async function handleChargeFailed(payload: any) {
  const { tx_ref, reason, customer } = payload.data;
  
  // TODO: Record failure
  // TODO: Send failure notification
}
```

## Testing & Debugging

### Test Credentials

**Test Cards (Flutterwave Dashboard → Test Mode):**

| Card | CVV | Expiry | Status |
|------|-----|--------|--------|
| 4242 4242 4242 4242 | 123 | 05/32 | Success |
| 5531 8866 5490 0604 | 564 | 12/33 | Success |
| 4531 6753 0604 9154 | 123 | 09/32 | Failed |

**Test Phone Numbers:**
- `+234803840000001` - Success
- `+234803840000002` - Failed OTP
- `+234803840000003` - Timeout

**Test Email:**
- Any email (confirmation emails sent to test account)

### Debug Logging

Enable debug logs with `console.log("[v0] ...")`:

```typescript
// In lib/flutterwave.ts
console.log('[v0] Flutterwave API Error:', { status, error });

// In app/actions/payment.ts
console.log('[v0] Initiating payment:', { transactionRef, amount, email });

// In app/api/webhook/route.ts
console.log('[v0] Webhook received:', { event, transactionRef, status });

// In components/CheckoutForm.tsx
console.log('[v0] Submitting payment form:', formData);
```

### Common Issues

**Issue:** "Invalid Amount"
```typescript
// Wrong
const amount = formData.amount; // May be 5000.333333

// Right
const amount = Math.round(amount * 100) / 100; // 5000.33
```

**Issue:** "Invalid Email"
```typescript
// Wrong
if (!email) throw new Error('Email required');

// Right
if (!email || !email.includes('@')) throw new Error('Invalid email');
```

**Issue:** Webhook Returns 401
```typescript
// Check 1: Secret key matches
// Check 2: Webhook URL is public
// Check 3: Signature calculation correct
const isValid = crypto
  .createHmac('sha256', SECRET_KEY)
  .update(body)
  .digest('hex') === signature;
```

## Production Checklist

### Before Deploying

- [ ] Replace test API keys with production keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Verify HTTPS is enabled
- [ ] Configure webhook URL in Flutterwave Dashboard
- [ ] Test webhook delivery (Flutterwave provides test webhooks)
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Configure email notifications
- [ ] Set up database transaction logging
- [ ] Test payment flow end-to-end
- [ ] Create runbook for payment issues

### Environment Variables (Production)

```env
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_LIVE-your_production_public_key
FLW_SECRET_KEY=FLWSECK_LIVE-your_production_secret_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Database Schema (Example)

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  reference VARCHAR(255) UNIQUE NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  failed_reason TEXT
);
```

### Email Template (Example)

```html
<h1>Payment Confirmation</h1>
<p>Thank you for your payment!</p>
<ul>
  <li>Amount: NGN {{ amount }}</li>
  <li>Reference: {{ transactionRef }}</li>
  <li>Date: {{ date }}</li>
</ul>
```

## Advanced Features

### Custom Metadata

Pass custom data through the payment:

```typescript
await initiatePaymentAction(
  email,
  fullName,
  phoneNumber,
  amount,
  currency,
  description,
  {
    user_id: '123',
    order_id: 'ORD-456',
    plan: 'premium'
  }
);
```

Retrieved in webhook:
```typescript
const meta = payload.data.meta; // { user_id, order_id, plan }
```

### Multiple Payment Types

Create separate checkout pages:
- `/checkout/membership` - Monthly subscription
- `/checkout/course` - One-time course purchase
- `/checkout/donation` - Flexible amount donation

### Subscription Handling

For recurring payments:
```typescript
// After first payment succeeds
const subscription = await setupSubscription({
  transactionRef: paymentResult.transactionRef,
  amount: 5000,
  interval: 'monthly'
});
```

### Split Payments

Distribute payments:
```typescript
const payment = await initiatePayment({
  amount: 10000,
  split_code: 'your_split_code' // Set up in Flutterwave
});
```

## Resources

- [Flutterwave API Docs](https://developer.flutterwave.com)
- [Flutterwave Webhooks](https://developer.flutterwave.com/docs/webhooks)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## Support

For issues:
1. Check [Flutterwave Status Page](https://status.flutterwave.com)
2. Review [API Error Codes](https://developer.flutterwave.com/docs/integration-guides/errors)
3. Contact [Flutterwave Support](mailto:support@flutterwave.com)
