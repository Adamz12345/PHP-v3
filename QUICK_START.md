# Quick Start Guide - Flutterwave v3 Integration

Get up and running with Flutterwave in 5 minutes!

## Choose Your Path

### Path A: Next.js (Modern JavaScript/TypeScript)

Best for: Web applications, SPA, Node.js backends

#### Step 1: Clone & Install

```bash
# Clone the repository
git clone <repo-url>
cd flutterwave-nextjs

# Install dependencies
npm install
```

#### Step 2: Get API Keys

1. Visit https://dashboard.flutterwave.com
2. Log in or create account
3. Go to Settings → API Keys
4. Copy your **Public Key** and **Secret Key**

#### Step 3: Configure

```bash
# Create .env.local file
cp .env.example .env.local
```

Edit `.env.local`:
```env
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-XXXXXXXXXXXXX
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST-XXXXXXXXXXXXX
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Step 4: Run

```bash
npm run dev
```

Visit `http://localhost:3000` - Done! 🎉

#### Step 5: Test Payment

Fill the payment form with:
- **Amount:** 5000
- **Email:** test@example.com
- **Name:** Test User
- **Card:** 4239 9999 9999 3030 (test card)
- **CVV:** 089
- **Expiry:** 09/27

---

### Path B: PHP

Best for: Traditional PHP applications, shared hosting

#### Step 1: Install

```bash
# Install SDK via Composer
composer require flutterwavedev/flutterwave-v3

# Copy configuration
cp .env.example .env
```

#### Step 2: Get API Keys

Same as above - visit Flutterwave Dashboard

#### Step 3: Configure

Edit `.env`:
```env
FLW_PUBLIC_KEY=FLWPUBK_TEST-XXXXXXXXXXXXX
FLW_SECRET_KEY=FLWSECK_TEST-XXXXXXXXXXXXX
FLW_ENCRYPTION_KEY=FLWSECK_XXXXXXXXXXXXX
FLW_ENV=staging
```

#### Step 4: Autoload

In your PHP file:
```php
<?php
require 'vendor/autoload.php';
```

#### Step 5: Make a Payment

```php
<?php
require 'vendor/autoload.php';

use Flutterwave\Flutterwave;
use Flutterwave\Service\Card;

$flutterwave = new Flutterwave(
    $_ENV['FLW_PUBLIC_KEY'],
    $_ENV['FLW_SECRET_KEY']
);

$card = new Card($flutterwave);

$response = $card->initializePayment([
    'tx_ref' => 'TX-' . time(),
    'amount' => 5000,
    'currency' => 'NGN',
    'customer' => [
        'email' => 'customer@example.com',
        'name' => 'John Doe',
    ],
    'redirect_url' => 'https://yourdomain.com/callback'
]);

if ($response['status'] === 'success') {
    header('Location: ' . $response['data']['link']);
}
?>
```

---

## Project Structure

### Next.js

```
app/
├── api/
│   └── payments/
│       ├── initiate/route.ts       ← Start here
│       ├── verify/route.ts
│       ├── webhook/route.ts
│       └── transactions/route.ts
├── page.tsx                        ← Home page
├── payment-callback/page.tsx       ← After payment
└── transactions/page.tsx           ← View history

components/
└── PaymentForm.tsx                 ← Payment form

lib/
└── flutterwave.service.ts          ← API service
```

### PHP

```
vendor/
├── flutterwave/sdk/                ← Main SDK
payment.php                         ← Handle payment
callback.php                        ← After payment
webhook.php                         ← Webhook handler
```

---

## Common Tasks

### Initialize Payment (Next.js)

```typescript
// app/api/payments/initiate/route.ts
const response = await fetch('/api/payments/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 5000,
    customer_email: 'user@example.com',
    customer_name: 'John Doe',
  })
});

const data = await response.json();
window.location.href = data.data.link; // Redirect to payment
```

### Initialize Payment (PHP)

```php
<?php
$response = $card->initializePayment([
    'amount' => 5000,
    'email' => 'user@example.com',
    'tx_ref' => 'TX-' . time(),
    // ... other fields
]);

header('Location: ' . $response['data']['link']);
?>
```

### Verify Transaction (Next.js)

```typescript
const response = await fetch(
  `/api/payments/verify?transaction_id=${transactionId}`
);
const data = await response.json();
console.log(data.data.status); // 'successful', 'failed', etc.
```

### Verify Transaction (PHP)

```php
<?php
$response = $transactionController->verify($transactionId);
echo $response['data']['status'];
?>
```

### Handle Webhook (Next.js)

```typescript
// app/api/payments/webhook/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (body.event === 'charge.completed') {
    // Payment successful - update database, send email, etc.
    const { id, amount, customer } = body.data;
  }
  
  return NextResponse.json({ status: 'received' });
}
```

### Handle Webhook (PHP)

```php
<?php
// webhook.php
$data = json_decode(file_get_contents('php://input'), true);

if ($data['event'] === 'charge.completed') {
    $transactionId = $data['data']['id'];
    $amount = $data['data']['amount'];
    // Update database, send email, etc.
}

echo json_encode(['status' => 'received']);
?>
```

---

## Environment Variables

### Required

| Variable | Example | Description |
|----------|---------|-------------|
| FLUTTERWAVE_PUBLIC_KEY | FLWPUBK_TEST-XXXXX | Flutterwave public key |
| FLUTTERWAVE_SECRET_KEY | FLWSECK_TEST-XXXXX | Flutterwave secret key |
| NEXT_PUBLIC_APP_URL | http://localhost:3000 | Your app URL |

### Optional

| Variable | Example | Description |
|----------|---------|-------------|
| NEXT_PUBLIC_LOGO_URL | https://cdn.../logo.png | Company logo |
| DATABASE_URL | postgresql://... | Database connection |
| FLW_ENV | staging | Staging or production |

---

## API Endpoints (Next.js)

### Initialize Payment

```
POST /api/payments/initiate
Content-Type: application/json

{
  "amount": 5000,
  "customer_email": "user@example.com",
  "customer_name": "John Doe",
  "customer_phone": "08012345678",
  "description": "Payment description",
  "tx_ref": "TX-123456"
}

Response:
{
  "status": "success",
  "data": {
    "link": "https://checkout.flutterwave.com/pay/xxxxx"
  }
}
```

### Verify Transaction

```
GET /api/payments/verify?transaction_id=1234567

Response:
{
  "status": "success",
  "data": {
    "id": 1234567,
    "tx_ref": "TX-123456",
    "amount": 5000,
    "status": "successful",
    "customer": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
}
```

### Get Transactions

```
GET /api/payments/transactions?status=successful

Response:
{
  "status": "success",
  "data": [
    {
      "id": 1234567,
      "amount": 5000,
      "status": "successful",
      ...
    }
  ]
}
```

---

## Test Cards

Use these in staging mode:

| Card Type | Number | CVV | Expiry |
|-----------|--------|-----|--------|
| Visa Success | 4239 9999 9999 3030 | 089 | 09/27 |
| Visa Failed | 5399 9999 9999 9995 | 589 | 09/27 |

---

## Deployment

### Deploy Next.js to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables in dashboard
```

### Deploy PHP to Server

```bash
# Via FTP: Upload files
# Via Git: git push to server

# Run on server
php -S localhost:8000

# Or configure with Apache/Nginx
```

---

## Troubleshooting

### "API Key Invalid"
- ✓ Check .env.local / .env file
- ✓ Verify keys from Flutterwave Dashboard
- ✓ Restart development server

### "Payment link not generated"
- ✓ Verify all required fields provided
- ✓ Check internet connection
- ✓ Verify Flutterwave is not down

### "Transaction verification fails"
- ✓ Check transaction ID is correct
- ✓ Verify API keys are correct
- ✓ Check transaction exists in dashboard

### "Webhook not receiving events"
- ✓ Domain must be publicly accessible (localhost won't work)
- ✓ Configure webhook URL in Flutterwave Dashboard
- ✓ Check webhook logs in dashboard

---

## Next Steps

1. **Read Full Documentation**
   - Next.js: [NEXTJS_SETUP.md](./NEXTJS_SETUP.md)
   - PHP: [PHP_COMPLETE_SETUP.md](./PHP_COMPLETE_SETUP.md)

2. **Implement Features**
   - Payment processing
   - Transaction verification
   - Webhook handling
   - Error handling

3. **Integrate with Database**
   - Store transactions
   - Manage customer data
   - Track order status

4. **Test Thoroughly**
   - Payment flow
   - Edge cases
   - Error scenarios

5. **Deploy**
   - Vercel for Next.js
   - Server/VPS for PHP

---

## Support Resources

- **Official Docs:** https://developer.flutterwave.com
- **Dashboard:** https://dashboard.flutterwave.com
- **Email:** developers@flutterwavego.com
- **Slack:** https://bit.ly/34Vkzcg

---

## File Structure Cheat Sheet

### Find Payment Form
- **Next.js:** `components/PaymentForm.tsx`
- **PHP:** `paymentForm.php`

### Find Payment Handler
- **Next.js:** `app/api/payments/initiate/route.ts`
- **PHP:** `processPayment.php`

### Find Verification
- **Next.js:** `app/api/payments/verify/route.ts`
- **PHP:** `callback.php`

### Find Webhook
- **Next.js:** `app/api/payments/webhook/route.ts`
- **PHP:** `webhook.php`

---

## Quick Command Reference

### Next.js
```bash
npm install                # Install dependencies
npm run dev               # Start dev server
npm run build             # Build for production
npm start                 # Start production server
npm test                  # Run tests
npm run lint              # Run linter
```

### PHP
```bash
composer install          # Install dependencies
composer update           # Update dependencies
php -S localhost:8000    # Start dev server
```

---

Good luck! 🚀

For detailed information, see the full documentation files.
