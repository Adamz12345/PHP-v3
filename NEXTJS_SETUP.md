# Flutterwave v3 SDK - Next.js 16 Implementation

This is a complete, v0.dev-compatible implementation of the Flutterwave v3 payment SDK for Next.js.

## Project Structure

```
app/
├── api/
│   └── payments/
│       ├── initiate/route.ts          # Payment initialization endpoint
│       ├── verify/route.ts            # Transaction verification endpoint
│       ├── webhook/route.ts           # Webhook handler for payment events
│       ├── bank-transfer/route.ts     # Bank transfer endpoint
│       └── transactions/route.ts      # Get transactions history
├── payment-callback/page.tsx          # Payment callback/verification page
├── transactions/page.tsx              # Transaction history dashboard
├── layout.tsx                         # Root layout
├── globals.css                        # Global styles
└── page.tsx                           # Home page with payment form

lib/
├── flutterwave.service.ts             # Flutterwave service class
├── types.ts                           # TypeScript type definitions
└── utils.ts                           # Utility functions

components/
└── PaymentForm.tsx                    # Payment form component

public/                                # Static assets
.env.example                           # Environment variables template
package.json                           # Dependencies
tsconfig.json                          # TypeScript configuration
next.config.js                         # Next.js configuration
```

## Setup Instructions

### 1. Clone or Download the Project

```bash
git clone <repo-url>
cd flutterwave-nextjs
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Flutterwave credentials:

```env
# Get these from your Flutterwave Dashboard
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-XXXXXXXXXXXXX
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-XXXXXXXXXXXXX

# Your application URL (for payment callbacks)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: Your company logo
NEXT_PUBLIC_LOGO_URL=https://your-logo-url.png
```

### 4. Get Flutterwave Credentials

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Copy your **Public Key** and **Secret Key**
5. Paste them in `.env.local`

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## API Endpoints

### 1. Payment Initiation - `POST /api/payments/initiate`

Initializes a payment with Flutterwave.

**Request Body:**
```json
{
  "amount": 5000,
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "customer_phone": "08012345678",
  "description": "Payment for order #123",
  "tx_ref": "TX-1234567890",
  "redirect_url": "http://localhost:3000/payment-callback",
  "meta": {}
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Charge Authorization URL Created",
  "data": {
    "link": "https://checkout.flutterwave.com/pay/xxxxx"
  }
}
```

### 2. Transaction Verification - `GET /api/payments/verify`

Verifies a transaction status.

**Query Parameters:**
- `transaction_id` (required): The Flutterwave transaction ID

**Response:**
```json
{
  "status": "success",
  "message": "Charge fetched successfully",
  "data": {
    "id": 1234567,
    "tx_ref": "TX-1234567890",
    "amount": 5000,
    "currency": "NGN",
    "status": "successful",
    "customer": {
      "email": "customer@example.com",
      "name": "John Doe"
    }
  }
}
```

### 3. Webhook Handler - `POST /api/payments/webhook`

Receives and processes payment events from Flutterwave.

**Webhook Events:**
- `charge.completed` - Successful payment
- `charge.failed` - Failed payment

### 4. Bank Transfer - `POST /api/payments/bank-transfer`

Creates a bank transfer payment.

**Request Body:**
```json
{
  "amount": 5000,
  "customer_email": "customer@example.com",
  "customer_name": "John Doe",
  "tx_ref": "BANK-1234567890",
  "duration": 1,
  "narration": "Payment for order"
}
```

### 5. Get Transactions - `GET /api/payments/transactions`

Retrieves payment transaction history.

**Query Parameters:**
- `from` (optional): Unix timestamp for start date
- `to` (optional): Unix timestamp for end date
- `status` (optional): Filter by status (successful, failed, pending)

## Components

### PaymentForm

A reusable payment form component.

**Props:**
```typescript
interface PaymentFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}
```

**Usage:**
```tsx
import PaymentForm from '@/components/PaymentForm';

export default function Page() {
  return (
    <PaymentForm
      onSuccess={(data) => console.log('Payment successful', data)}
      onError={(error) => console.log('Payment error', error)}
    />
  );
}
```

## Service Class - FlutterwaveService

The main service for interacting with Flutterwave API.

**Methods:**

```typescript
// Initialize payment
initializePayment(payload: PaymentPayload): Promise<ApiResponse>

// Verify transaction
verifyTransaction(transactionId: string): Promise<ApiResponse>

// Get transactions
getTransactions(params?: TransactionParams): Promise<ApiResponse>

// Create bank transfer
createBankTransfer(payload: BankTransferPayload): Promise<ApiResponse>

// Handle webhook
verifyWebhookSignature(body: any, hash: string): boolean
```

## Webhook Setup

1. Go to [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Navigate to Settings → Webhooks
3. Set Webhook URL to: `https://your-domain.com/api/payments/webhook`
4. Select events you want to receive:
   - Charge completed
   - Charge failed
5. Save

## Payment Flow

1. User fills payment form on home page
2. Form submits to `/api/payments/initiate`
3. Backend creates payment with Flutterwave
4. User is redirected to Flutterwave hosted checkout
5. User completes payment
6. User is redirected to `/payment-callback`
7. Callback page verifies transaction with Flutterwave
8. Webhook notifies backend about payment result

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add your Flutterwave keys

### Deploy to Other Platforms

The app is compatible with any Node.js hosting (Heroku, Railway, AWS, etc.).

## Testing

### Test Credentials

Use these test cards with Flutterwave test mode:

**Successful Payment:**
- Card: 4239 9999 9999 3030
- CVV: 089
- Expiry: 09/27

**Failed Payment:**
- Card: 5399 9999 9999 9995
- CVV: 589
- Expiry: 09/27

### Test Payment Flow

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000`
3. Fill payment form with test details
4. Click "Pay with Flutterwave"
5. Use test card provided above
6. Verify transaction on callback page

## Troubleshooting

### "Missing API Keys"
- Check `.env.local` file exists
- Verify `FLUTTERWAVE_PUBLIC_KEY` and `FLUTTERWAVE_SECRET_KEY` are set
- Restart dev server after changing env vars

### "Payment link not generated"
- Verify your test/live mode settings
- Check Flutterwave dashboard for API key validity
- Ensure all required fields are provided in request

### "Webhook not receiving events"
- Verify webhook URL in Flutterwave dashboard
- Check webhook logs in Flutterwave dashboard
- Ensure your domain is publicly accessible (localhost won't receive webhooks)

### "Transaction verification fails"
- Verify transaction ID is correct
- Ensure API secret key is correct
- Check transaction status in Flutterwave dashboard

## Security Notes

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Webhook Signature Verification** - Always verify webhook signatures
3. **HTTPS Only** - Use HTTPS in production
4. **Rate Limiting** - Implement rate limiting on API endpoints
5. **Input Validation** - Always validate user inputs
6. **Error Handling** - Don't expose sensitive errors to clients

## Additional Resources

- [Flutterwave Documentation](https://developer.flutterwave.com)
- [Flutterwave v3 API Reference](https://developer.flutterwave.com/reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Support

For issues or questions:
- Check Flutterwave docs: https://developer.flutterwave.com
- Create an issue on GitHub
- Contact Flutterwave support: https://flutterwave.com/contact
