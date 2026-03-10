# Flutterwave Payment Integration with Next.js

Production-ready payment gateway integration using Next.js Server Actions and secure server-side validation.

## Overview

This project implements a complete payment flow using Flutterwave's API, with:
- **Server-side validation** - Amount validation on the backend to prevent tampering
- **Secure API communication** - Bearer token authentication with Flutterwave
- **Webhook verification** - HMAC signature verification for payment callbacks
- **Professional UI** - Responsive checkout form with real-time validation
- **Error handling** - Comprehensive error management and user feedback

## Architecture

### Directory Structure

```
app/
├── layout.tsx              # Root layout with metadata
├── page.tsx                # Main checkout page
├── actions/
│   └── payment.ts          # Server actions for payment operations
├── api/
│   └── webhook/
│       └── route.ts        # Webhook endpoint for payment callbacks
└── payment/
    └── callback/
        └── page.tsx        # Payment verification callback page

lib/
└── flutterwave.ts          # Flutterwave API utility library

components/
└── CheckoutForm.tsx        # Checkout form component

globals.css                 # Global styles and design tokens
tailwind.config.js          # Tailwind CSS configuration
tsconfig.json               # TypeScript configuration
```

## Environment Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Flutterwave API Keys
NEXT_PUBLIC_FLW_PUBLIC_KEY=your_public_key_from_flutterwave_dashboard
FLW_SECRET_KEY=your_secret_key_from_flutterwave_dashboard

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Where to get your keys:**
1. Sign up at [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to Settings → API Keys
3. Copy your Secret Key and Public Key
4. Add them to `.env.local`

### 3. Get Your Keys from Flutterwave

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Click on **Settings** → **API Keys**
3. Copy both your **Secret Key** and **Public Key**
4. Paste them in your `.env.local` file

## Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
npm run build
npm start
```

## Key Components

### 1. Flutterwave Utility (`lib/flutterwave.ts`)

Handles all API communication with Flutterwave:

```typescript
// Initiate payment
const response = await initiatePayment({
  amount: 5000,
  email: 'customer@example.com',
  phone_number: '+234800000000',
  full_name: 'John Doe',
  transaction_ref: 'tx_123456789',
  currency: 'NGN',
  description: 'Payment for order #123'
});

// Verify payment
const verification = await verifyPayment(transactionId);

// Generate transaction reference
const ref = generateTransactionRef();
```

### 2. Payment Server Actions (`app/actions/payment.ts`)

Server actions that handle business logic and validation:

```typescript
// Server action for initiating payment
const result = await initiatePaymentAction(
  email,
  fullName,
  phoneNumber,
  amount,
  currency,
  description
);

// Server action for verifying payment
const verification = await verifyPaymentAction(transactionId);
```

**Security Features:**
- Email validation
- Name validation
- Phone number validation
- Amount validation with max limits
- Floating-point precision handling

### 3. Checkout Form Component (`components/CheckoutForm.tsx`)

User-friendly payment form with:
- Real-time form validation
- Loading states
- Error handling and display
- Responsive design
- Security notices

### 4. Webhook Endpoint (`app/api/webhook/route.ts`)

Handles payment confirmation callbacks from Flutterwave:

```typescript
// Webhook URL to configure in Flutterwave Dashboard:
// https://yourdomain.com/api/webhook

// Handles events:
// - charge.completed: Successful payment
// - charge.failed: Failed payment
```

### 5. Callback Page (`app/payment/callback/page.tsx`)

Displays payment verification results:
- Transaction details
- Payment status
- Customer information
- Transaction reference management

## Payment Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills checkout form and clicks "Proceed to Payment" │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CheckoutForm calls initiatePaymentAction (Server Action) │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Server validates all inputs and amount                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Call Flutterwave API to create transaction               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Return payment link to client                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Redirect user to Flutterwave payment page                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. User completes payment on Flutterwave                    │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
  [Success]                  [Failure]
        │                         │
        └────────────┬────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 8. Flutterwave redirects to callback page with transaction ID│
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 9. Callback page verifies payment with verifyPaymentAction  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ 10. Display payment status to user                          │
└─────────────────────────────────────────────────────────────┘

Parallel Flow:
┌─────────────────────────────────────────────────────────────┐
│ Flutterwave sends webhook to /api/webhook                   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Verify webhook signature using FLW_SECRET_KEY               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Process charge.completed or charge.failed event             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Update database, send emails, trigger fulfillment           │
└─────────────────────────────────────────────────────────────┘
```

## Security Best Practices

### 1. Server-Side Validation

All critical validation happens on the server:
- Email format validation
- Amount validation with limits
- Phone number validation
- Transaction reference generation

### 2. Bearer Token Authentication

All API calls use Bearer token authentication:
```typescript
Authorization: Bearer ${FLW_SECRET_KEY}
```

### 3. Webhook Signature Verification

Webhooks are verified using HMAC-SHA256:
```typescript
const hash = crypto
  .createHmac('sha256', SECRET_KEY)
  .update(body)
  .digest('hex');
```

### 4. Environment Variable Protection

- `FLW_SECRET_KEY` is server-only (never exposed to client)
- `NEXT_PUBLIC_FLW_PUBLIC_KEY` is public (used by Flutterwave SDK)
- All sensitive operations use server actions or API routes

### 5. HTTPS Requirement

Always use HTTPS in production. Update `NEXT_PUBLIC_APP_URL` accordingly.

## Configuring Webhooks in Flutterwave

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to **Settings** → **Webhooks**
3. Add your webhook URL: `https://yourdomain.com/api/webhook`
4. Select events:
   - `charge.completed`
   - `charge.failed`
5. Save

## Database Integration (Optional)

To persist transactions in your database, update `app/api/webhook/route.ts`:

```typescript
// Example with Prisma
async function handleChargeCompleted(payload: any) {
  await db.transaction.create({
    data: {
      reference: payload.data.tx_ref,
      amount: payload.data.amount,
      currency: payload.data.currency,
      status: 'completed',
      customerEmail: payload.data.customer.email,
      verifiedAt: new Date(),
    },
  });
}
```

## Email Notifications (Optional)

To send confirmation emails, update `app/api/webhook/route.ts`:

```typescript
// Example with Resend or SendGrid
async function handleChargeCompleted(payload: any) {
  await sendEmail({
    to: payload.data.customer.email,
    subject: 'Payment Confirmation',
    template: 'payment-confirmation',
    data: {
      amount: payload.data.amount,
      transactionRef: payload.data.tx_ref,
    },
  });
}
```

## Testing

### Test Cards

Use these test card numbers in Flutterwave's test environment:

| Card Number | CVV | Expiry | Status |
|---|---|---|---|
| 4242 4242 4242 4242 | 123 | 05/32 | Success |
| 5531 8866 5490 0604 | 564 | 12/33 | Success |

### Test Phone Numbers

- `+234803840000001` - Success
- `+234803840000002` - Failed OTP
- `+234803840000003` - Timeout

## Troubleshooting

### Missing Environment Variables

**Error:** `FLW_SECRET_KEY environment variable is not set`

**Solution:** Add `FLW_SECRET_KEY` to `.env.local`

### Invalid Webhook Signature

**Error:** Webhook returns 401 Unauthorized

**Solution:**
1. Verify `FLW_SECRET_KEY` matches your Flutterwave account
2. Check webhook URL is publicly accessible
3. Ensure webhook events are enabled in Flutterwave Dashboard

### Payment Verification Fails

**Error:** "Payment verification failed"

**Solution:**
1. Verify transaction ID is correct
2. Check API keys are valid
3. Ensure Flutterwave account is active
4. Check internet connectivity

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_FLW_PUBLIC_KEY`
   - `FLW_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to production domain)
4. Deploy

### Other Platforms

Follow the platform's documentation for:
- Environment variable configuration
- Node.js version compatibility (18.17+)
- Build command: `npm run build`
- Start command: `npm start`

## API Reference

### `initiatePayment(payload)`

Initiates a payment transaction with Flutterwave.

**Parameters:**
- `amount` (number): Payment amount in base currency
- `email` (string): Customer email address
- `phone_number` (string): Customer phone number
- `full_name` (string): Customer full name
- `transaction_ref` (string): Unique transaction reference
- `currency` (string, optional): Currency code (default: 'NGN')
- `redirect_url` (string, optional): Redirect after payment
- `description` (string, optional): Payment description
- `meta` (object, optional): Additional metadata

**Returns:**
```typescript
{
  status: 'success',
  message: string,
  data: {
    link: string  // Payment page URL
  }
}
```

### `verifyPayment(transactionId)`

Verifies a payment transaction.

**Parameters:**
- `transactionId` (string): Flutterwave transaction ID

**Returns:**
```typescript
{
  status: 'success',
  data: {
    id: number,
    tx_ref: string,
    status: 'successful' | 'failed' | 'cancelled' | 'pending',
    amount: number,
    currency: string,
    customer: {
      id: number,
      email: string,
      name: string
    },
    meta: object
  }
}
```

### `generateTransactionRef()`

Generates a unique transaction reference.

**Returns:** `string` - Unique reference (e.g., `tx_1234567890_abc123def`)

### `verifyWebhookSignature(body, signature)`

Verifies webhook authenticity using HMAC-SHA256.

**Parameters:**
- `body` (string): Raw webhook request body
- `signature` (string): Signature from `verif-hash` header

**Returns:** `Promise<boolean>`

## Support & Resources

- [Flutterwave Documentation](https://developer.flutterwave.com)
- [Flutterwave API Reference](https://developer.flutterwave.com/reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Server Actions Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions)

## License

This project is provided as-is for reference and educational purposes.
