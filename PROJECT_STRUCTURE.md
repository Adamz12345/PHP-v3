# Project Structure Overview

This document explains the complete project structure for both Next.js and PHP implementations.

## Directory Tree

```
flutterwave-complete/
├── app/                                 # Next.js app directory
│   ├── api/                            # API routes
│   │   └── payments/
│   │       ├── initiate/route.ts       # Payment initialization endpoint
│   │       ├── verify/route.ts         # Transaction verification endpoint
│   │       ├── webhook/route.ts        # Webhook handler
│   │       ├── bank-transfer/route.ts  # Bank transfer endpoint
│   │       └── transactions/route.ts   # Get transactions endpoint
│   ├── payment-callback/
│   │   └── page.tsx                    # Payment callback page
│   ├── transactions/
│   │   └── page.tsx                    # Transactions dashboard
│   ├── layout.tsx                      # Root layout
│   ├── globals.css                     # Global styles
│   ├── page.tsx                        # Home page
│   └── favicon.ico
│
├── components/                          # React components
│   └── PaymentForm.tsx                 # Payment form component
│
├── lib/                                # Utilities and services
│   ├── flutterwave.service.ts          # Flutterwave service class
│   ├── types.ts                        # TypeScript types
│   └── utils.ts                        # Utility functions
│
├── public/                             # Static assets
│   └── (images, logos, etc.)
│
├── .env.example                        # Environment variables template
├── .env.local                          # Local environment variables (git ignored)
├── .gitignore                          # Git ignore rules
├── next.config.js                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
├── tailwind.config.ts                  # Tailwind CSS configuration
├── package.json                        # Dependencies and scripts
├── package-lock.json                   # Dependency lock file
│
├── NEXTJS_SETUP.md                     # Next.js setup guide
├── PHP_COMPLETE_SETUP.md               # PHP implementation guide
├── PROJECT_STRUCTURE.md                # This file
└── README.md                           # Main documentation

## File Descriptions

### Next.js Application Files

#### app/layout.tsx
Root layout component that wraps all pages. Configures:
- HTML structure
- Metadata
- Fonts
- Global providers

#### app/page.tsx
Home page with:
- Payment form component
- Feature information
- Setup instructions
- Quick links to other pages

#### app/globals.css
Global styles including:
- Tailwind CSS imports
- CSS variables for theming
- Custom utility classes

#### app/payment-callback/page.tsx
Handles payment completion:
- Verifies transaction with Flutterwave
- Displays success/failure status
- Shows transaction details
- Provides next actions

#### app/transactions/page.tsx
Transaction history dashboard:
- Fetches transactions from API
- Displays in table format
- Shows status badges
- Links to create new payment

### API Routes

#### app/api/payments/initiate/route.ts
POST endpoint for payment initialization.

**Input:**
```json
{
  "amount": 5000,
  "customer_email": "user@example.com",
  "customer_name": "John Doe",
  "customer_phone": "08012345678",
  "description": "Payment description"
}
```

**Output:**
```json
{
  "status": "success",
  "data": {
    "link": "https://checkout.flutterwave.com/pay/xxxxx"
  }
}
```

#### app/api/payments/verify/route.ts
GET/POST endpoint for transaction verification.

**Query/Body:**
```json
{
  "transaction_id": "1234567"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1234567,
    "amount": 5000,
    "status": "successful",
    "tx_ref": "TX-123456"
  }
}
```

#### app/api/payments/webhook/route.ts
POST endpoint for Flutterwave webhooks.

**Events handled:**
- `charge.completed` - Successful payment
- `charge.failed` - Failed payment

#### app/api/payments/bank-transfer/route.ts
POST endpoint for bank transfer creation.

**Input:**
```json
{
  "amount": 5000,
  "customer_email": "user@example.com",
  "customer_name": "John Doe",
  "tx_ref": "BANK-123456",
  "narration": "Payment description"
}
```

#### app/api/payments/transactions/route.ts
GET endpoint for transaction history.

**Query Parameters:**
- `from` - Unix timestamp (optional)
- `to` - Unix timestamp (optional)
- `status` - Filter by status (optional)

### Components

#### components/PaymentForm.tsx
Reusable payment form component.

**Props:**
```typescript
interface PaymentFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}
```

**Features:**
- Form validation
- Error handling
- Loading states
- Responsive design

### Library Files

#### lib/flutterwave.service.ts
Main service class for Flutterwave API interactions.

**Methods:**
- `initializePayment()` - Create payment
- `verifyTransaction()` - Verify payment status
- `getTransactions()` - Get transaction history
- `createBankTransfer()` - Create bank transfer
- `verifyWebhookSignature()` - Verify webhook

#### lib/types.ts
TypeScript type definitions for:
- API requests/responses
- Payment payload
- Transaction data
- Service configuration

#### lib/utils.ts
Utility functions for:
- Error handling
- Response formatting
- Data validation
- Date/time operations

### Configuration Files

#### package.json
Project metadata and dependencies:
```json
{
  "name": "flutterwave-nextjs",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^16.0.0",
    "react": "^19.0.0"
  }
}
```

#### tsconfig.json
TypeScript configuration:
- Compiler options
- Module resolution
- Path aliases

#### tailwind.config.ts
Tailwind CSS configuration:
- Design tokens
- Custom colors
- Theme extensions

#### next.config.js
Next.js configuration:
- Bundler settings
- Environment variables
- Custom webpack config

#### .env.example
Template for environment variables:
```env
FLUTTERWAVE_PUBLIC_KEY=your_key_here
FLUTTERWAVE_SECRET_KEY=your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### .gitignore
Files to ignore in git:
- node_modules/
- .env.local
- .next/
- dist/
- build/

## PHP Structure

The PHP implementation includes the original repository structure:

```
vendor/                          # Composer packages
src/
├── Controller/
│   ├── PaymentController.php
│   └── TransactionController.php
├── Service/
│   ├── CardPayment.php
│   ├── BankTransfer.php
│   ├── MobileMoney.php
│   └── USSD.php
├── Webhook/
│   └── Webhook.php
└── Flutterwave.php             # Main class

composer.json                    # Composer configuration
.env.example                     # Environment template
paymentForm.php                  # Payment form
processPayment.php               # Process payment
callback.php                     # Callback handler
webhook.php                      # Webhook handler
```

## Data Flow

### Payment Flow (Next.js)

```
User fills form → PaymentForm component
        ↓
Form submitted → /api/payments/initiate
        ↓
Flutterwave API → Returns payment link
        ↓
User redirected → Flutterwave checkout
        ↓
Payment processed → User redirected to callback
        ↓
/payment-callback page → Verifies transaction
        ↓
Displays result to user
```

### Webhook Flow (Next.js)

```
Payment completed on Flutterwave
        ↓
Flutterwave sends webhook → /api/payments/webhook
        ↓
Signature verification → Webhook handler
        ↓
Process event (charge.completed, charge.failed)
        ↓
Update database/send emails
        ↓
Return 200 OK to Flutterwave
```

## Environment Variables

### Required (Next.js)

```env
FLUTTERWAVE_PUBLIC_KEY          # Public API key from Flutterwave
FLUTTERWAVE_SECRET_KEY          # Secret API key from Flutterwave
NEXT_PUBLIC_APP_URL             # Application base URL
```

### Optional (Next.js)

```env
NEXT_PUBLIC_LOGO_URL            # Company logo URL
DATABASE_URL                    # Database connection string
```

### Required (PHP)

```env
FLW_PUBLIC_KEY                  # Public API key
FLW_SECRET_KEY                  # Secret API key
FLW_ENCRYPTION_KEY              # Encryption key
FLW_ENV                         # staging or production
```

## Key Classes and Functions

### Next.js

- `FlutterwaveService` - Main service class
- `PaymentForm` - React component
- API route handlers - Express-like route handlers
- `useRouter()` - Next.js navigation hook

### PHP

- `Flutterwave` - Main class
- `PaymentController` - Handles payment operations
- `TransactionController` - Handles transaction queries
- `CardPayment`, `BankTransfer`, etc. - Payment services

## Security Considerations

1. **API Keys** - Stored in environment variables
2. **Webhook Verification** - Signature validation
3. **HTTPS Only** - Required for production
4. **Input Validation** - All user inputs validated
5. **Error Handling** - Generic error messages to users
6. **Rate Limiting** - Implemented on API routes

## Performance Optimizations

1. **Code Splitting** - Dynamic imports for large components
2. **Image Optimization** - Next.js Image component
3. **Caching** - API response caching
4. **Compression** - gzip compression enabled
5. **Lazy Loading** - Components loaded on demand

## Testing Structure

### Unit Tests
- Service methods
- Utility functions
- Component rendering

### Integration Tests
- API endpoints
- Database operations
- Webhook handling

### E2E Tests
- Complete payment flow
- Error scenarios
- Edge cases

## Deployment Structure

### Next.js (Vercel)
```
Source → GitHub Push → Vercel Auto Deploy → Live
```

### PHP (Shared Hosting/VPS)
```
Source → Git Push → SSH Deploy → Live
```

## Monitoring & Logging

- Console logs for debugging
- Error logging to database
- Webhook event logging
- API call monitoring

## Version Control

- Main branch: Production-ready code
- Development branch: Active development
- Feature branches: Individual features
- Release branches: Release candidates

## Documentation Structure

- **README.md** - Project overview
- **NEXTJS_SETUP.md** - Next.js detailed guide
- **PHP_COMPLETE_SETUP.md** - PHP detailed guide
- **PROJECT_STRUCTURE.md** - This file
- **API.md** - API reference (optional)

## Next Steps

1. Review [NEXTJS_SETUP.md](./NEXTJS_SETUP.md) for Next.js implementation
2. Review [PHP_COMPLETE_SETUP.md](./PHP_COMPLETE_SETUP.md) for PHP implementation
3. Set up environment variables
4. Run development server
5. Test payment flow
