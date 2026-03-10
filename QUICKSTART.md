# Quick Start Guide

## Prerequisites

- Node.js 18.17+ installed
- Flutterwave account with API keys
- A code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install dependencies
npm install
```

### 2. Get Flutterwave API Keys

1. Visit [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Sign in to your account (create one if needed)
3. Navigate to **Settings** → **API Keys**
4. Copy both **Secret Key** and **Public Key**

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example
cp .env.local.example .env.local
```

Edit `.env.local` and add your keys:

```env
NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-your_public_key_here
FLW_SECRET_KEY=FLWSECK_TEST-your_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Never commit `.env.local` to version control.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Payment Flow

### Using Test Cards

Use these credentials in the Flutterwave modal:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- CVV: `123`
- Expiry: `05/32`
- Pin: `1234`

**Failed Payment:**
- Card: `5531 8866 5490 0604`
- CVV: `564`
- Expiry: `12/33`
- Pin: `1234`

### Test Mobile Number

For OTP:
- Enter: `+234803840000001`
- OTP: `123456`

### Complete Payment Flow

1. Fill in checkout form with test data
2. Click "Proceed to Payment"
3. You'll be redirected to Flutterwave payment page
4. Complete payment with test card
5. You'll be redirected back with payment status

## Configuring Webhooks (Production)

For production, you need to receive payment callbacks:

1. Deploy your app (e.g., to Vercel)
2. Go to Flutterwave Dashboard → **Settings** → **Webhooks**
3. Add webhook URL: `https://yourdomain.com/api/webhook`
4. Select events: `charge.completed`, `charge.failed`
5. Save

## Project Structure

```
app/
├── layout.tsx                  # Root layout
├── page.tsx                    # Checkout page
├── actions/
│   └── payment.ts              # Server actions
├── api/webhook/route.ts        # Webhook handler
└── payment/callback/page.tsx   # Payment callback

lib/
└── flutterwave.ts              # API utilities

components/
└── CheckoutForm.tsx            # Form component
```

## Key Files to Customize

### 1. `app/page.tsx`
Update the checkout page title, description, and initial amount:

```typescript
<CheckoutForm
  initialAmount={5000}      // Change this
  currency="NGN"
  description="Your custom description"
/>
```

### 2. `app/actions/payment.ts`
Customize validation rules:

```typescript
const MAX_TRANSACTION_AMOUNT = 999999999; // Adjust this
```

### 3. `app/api/webhook/route.ts`
Add business logic for payment confirmation:

```typescript
async function handleChargeCompleted(payload: any) {
  // TODO: Update your database
  // TODO: Send confirmation email
  // TODO: Trigger fulfillment
}
```

## Troubleshooting

### "FLW_SECRET_KEY environment variable is not set"

**Solution:** Add `FLW_SECRET_KEY` to `.env.local`

### Payment verification fails

**Solution:**
1. Verify API keys are correct
2. Check internet connection
3. Ensure Flutterwave account is active

### Webhook not receiving events

**Solution:**
1. Ensure URL is publicly accessible
2. Check webhook URL in Flutterwave Dashboard
3. Verify `FLW_SECRET_KEY` is correct

## Deployment to Vercel

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Add Flutterwave payment integration"
   git push
   ```

2. Import to Vercel:
   - Visit [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repo

3. Add environment variables:
   - `NEXT_PUBLIC_FLW_PUBLIC_KEY`
   - `FLW_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL` (your production domain)

4. Deploy!

## Next Steps

1. **Database Integration**: Connect to store transactions
2. **Email Notifications**: Send payment confirmations
3. **User Accounts**: Track customer payments
4. **Order Fulfillment**: Automate delivery after payment
5. **Analytics**: Track payment metrics

## Need Help?

- Check the main [README.md](./README.md)
- Visit [Flutterwave Documentation](https://developer.flutterwave.com)
- Review [Next.js Docs](https://nextjs.org/docs)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Flutterwave API documentation
3. Check Next.js documentation
4. Contact Flutterwave support
