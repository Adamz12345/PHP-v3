<p align="center">
    <img title="Flutterwave" height="200" src="https://flutterwave.com/images/logo/full.svg" width="50%"/>
</p>

# Flutterwave v3 - Complete SDK Integration

## Overview

This repository contains **two complete implementations** of the Flutterwave v3 payment gateway:

1. **Next.js 16 Implementation** - Modern, v0.dev-compatible JavaScript/TypeScript version
2. **PHP SDK Documentation** - Complete guide for the original PHP implementation

![License](https://img.shields.io/badge/License-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple)

## Features

Both implementations support:
- Payment Initialization (Card, Account, Mobile Money, Bank Transfers, USSD, etc.)
- Transaction Verification & Retrieval
- Webhook Handling with Signature Verification
- Multiple Payment Methods (Card, Bank Transfer, Mobile Money, USSD)
- Recurring Payments & Subscriptions
- Split Payments
- Refunds & Dispute Management
- Settlement Reporting
- Bill Payments (Airtime, Data, Cable, Power, etc.)
- Identity Verification (BVN, Bank Account Resolution)

## Quick Start

### Option A: Next.js Implementation (v0.dev Compatible)

Perfect for modern JavaScript/TypeScript applications and Vercel deployment.

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Add your Flutterwave keys to .env.local

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the demo.

### Option B: PHP Implementation

Perfect for existing PHP applications.

```bash
# Install via Composer
composer require flutterwavedev/flutterwave-v3

# Copy configuration
cp .env.example .env

# Add your Flutterwave keys to .env

# Start your PHP server
php -S localhost:8000
```

## Documentation

- **[Next.js Implementation Guide](./NEXTJS_SETUP.md)** - Complete setup, API routes, components, and deployment
- **[PHP Complete Setup Guide](./PHP_COMPLETE_SETUP.md)** - Full PHP SDK documentation with examples

## Requirements

### For Next.js Implementation:
- Node.js 18+
- npm, yarn, pnpm, or bun
- Modern browser with JavaScript enabled

### For PHP Implementation:
- PHP 7.4 or higher
- Composer package manager
- cURL extension enabled
- Flutterwave for Business [API Keys](https://developer.flutterwave.com/docs/integration-guides/authentication)


## Installation

### Next.js Installation

```bash
# Clone the repository
git clone <repository-url>
cd flutterwave-nextjs

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Flutterwave API keys
# FLUTTERWAVE_PUBLIC_KEY=your_key_here
# FLUTTERWAVE_SECRET_KEY=your_key_here

# Start development server
npm run dev
```

### PHP Installation

```bash
# Install via Composer
composer require flutterwavedev/flutterwave-v3

# Copy environment template
cp .env.example .env

# Edit .env with your Flutterwave API keys
# FLW_PUBLIC_KEY=your_key_here
# FLW_SECRET_KEY=your_key_here

# Install dependencies
composer install
```

## Getting API Keys

1. Visit [Flutterwave Dashboard](https://dashboard.flutterwave.com)
2. Sign up or log in
3. Go to Settings → API Keys
4. Copy your Public and Secret keys
5. Add them to your `.env` or `.env.local` file

## Usage Examples

### Next.js - Simple Payment Form

```tsx
import PaymentForm from '@/components/PaymentForm';

export default function PaymentPage() {
  return (
    <PaymentForm
      onSuccess={(data) => console.log('Payment successful!', data)}
      onError={(error) => console.error('Payment failed:', error)}
    />
  );
}
```

### Next.js - API Route for Payment

```typescript
// app/api/payments/initiate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import FlutterwaveService from '@/lib/flutterwave.service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const service = new FlutterwaveService();
  
  const response = await service.initializePayment({
    tx_ref: `TX-${Date.now()}`,
    amount: body.amount,
    currency: 'NGN',
    customer: {
      email: body.email,
      name: body.name,
    }
  });

  return NextResponse.json(response);
}
```

### PHP - Card Payment

```php
<?php
use Flutterwave\Service\CardPayment;
use Flutterwave\Flutterwave;

$flutterwave = new Flutterwave(
    $_ENV['FLW_PUBLIC_KEY'],
    $_ENV['FLW_SECRET_KEY']
);

$card = new CardPayment($flutterwave);

$response = $card->charge([
    'card_number' => '4239999999993030',
    'cvv' => '089',
    'expiry_month' => '09',
    'expiry_year' => '27',
    'amount' => 5000,
    'email' => 'customer@example.com',
    'tx_ref' => 'TX-' . time(),
]);
?>
```

### PHP - Bank Transfer

```php
<?php
use Flutterwave\Service\BankTransfer;

$bankTransfer = new BankTransfer($flutterwave);

$response = $bankTransfer->initiate([
    'account_number' => '0690000031',
    'account_bank' => '044',
    'amount' => 5000,
    'email' => 'customer@example.com',
    'tx_ref' => 'BANK-' . time(),
]);
?>
```

## API Endpoints (Next.js)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/initiate` | Initialize payment |
| GET/POST | `/api/payments/verify` | Verify transaction |
| POST | `/api/payments/webhook` | Webhook handler |
| POST | `/api/payments/bank-transfer` | Create bank transfer |
| GET | `/api/payments/transactions` | Get transactions |

## Payment Methods Supported

1. **Card Payments** - Debit/Credit cards with 3DS support
2. **Bank Transfers** - Direct bank account transfers
3. **Mobile Money** - MTN, Vodafone, AirtelTigo (Ghana, Uganda, Tanzania)
4. **USSD** - USSD payment codes (Nigeria)
5. **Account Charges** - Direct account debit
6. **ACH** - Automated Clearing House (US)
7. **Digital Wallets** - Apple Pay, Google Pay
8. **Bill Payments** - Airtime, Data, Cable, Power
9. **Crypto** - Cryptocurrency payments

## Testing

### Test Cards (Flutterwave Staging)

**Successful Payment:**
- Card: 4239 9999 9999 3030
- CVV: 089
- Expiry: 09/27

**Failed Payment:**
- Card: 5399 9999 9999 9995
- CVV: 589
- Expiry: 09/27

### Running Tests

#### Next.js Tests

```bash
npm test
```

#### PHP Tests

```bash
phpunit
```

## Deployment

### Deploy Next.js to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy PHP to Server

```bash
# Push to server via Git or FTP
git push origin main

# Run composer install
composer install --optimize-autoloader

# Set environment variables on server
```

## Debugging & Support

### Common Issues

1. **"API Key Invalid"** - Verify keys in environment variables
2. **"Signature verification failed"** - Check webhook secret key
3. **"Transaction not found"** - Verify transaction ID and API keys
4. **"Rate limited"** - Wait before making more requests

### Resources

- [Error Messages Guide](https://developer.flutterwave.com/docs/integration-guides/errors)
- [API Documentation](https://developer.flutterwave.com)
- [Dashboard](https://dashboard.flutterwave.com)

## Support

- **Email:** [developers@flutterwavego.com](mailto:developers@flutterwavego.com)
- **Slack:** [Flutterwave Community](https://bit.ly/34Vkzcg)
- **Twitter:** [@FlutterwaveEng](https://twitter.com/FlutterwaveEng)

## Contributing

We welcome contributions! Please read our [contribution guidelines](./CONTRIBUTING.md) first.

## License

MIT License - See [LICENSE](./LICENSE) file for details.

Copyright (c) 2024 Flutterwave Inc.

## References

- [Flutterwave Developer Docs](https://developer.flutterwave.com)
- [Flutterwave Dashboard](https://dashboard.flutterwave.com)
- [PHP SDK GitHub](https://github.com/Flutterwave/PHP-v3)
- [Next.js Documentation](https://nextjs.org/docs)
