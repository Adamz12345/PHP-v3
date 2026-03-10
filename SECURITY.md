# Security Best Practices

Complete security guidance for the Flutterwave Next.js integration.

## Overview

This document outlines security best practices and common vulnerabilities to avoid when implementing payment processing.

## Table of Contents

1. [API Key Security](#api-key-security)
2. [Server-Side Validation](#server-side-validation)
3. [Webhook Security](#webhook-security)
4. [Data Protection](#data-protection)
5. [Common Vulnerabilities](#common-vulnerabilities)
6. [Security Checklist](#security-checklist)

## API Key Security

### Do's ✅

```typescript
// ✅ Correct: Secret key in server-only environment variable
const SECRET_KEY = process.env.FLW_SECRET_KEY; // Only on server

// ✅ Correct: Public key in Next.js public environment variable
const PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY; // OK to expose
```

### Don'ts ❌

```typescript
// ❌ WRONG: Secret key exposed to client
fetch('/api/initiate', {
  body: JSON.stringify({ secret_key: 'FLWSECK_...' })
});

// ❌ WRONG: Hardcoded keys in code
const SECRET_KEY = 'FLWSECK_TEST-XXXXXXXX';

// ❌ WRONG: Keys in version control
// Commit .env.local accidentally
git add .env.local
git commit -m "Add keys"

// ❌ WRONG: Logging keys
console.log('SECRET_KEY:', SECRET_KEY);
```

### Key Rotation

```bash
# Generate new API keys in Flutterwave Dashboard:
# 1. Settings → API Keys → Generate New Secret Key
# 2. Update environment variables
# 3. Restart application
# 4. Delete old keys

# Timeline: < 5 minutes downtime
```

## Server-Side Validation

### Amount Validation

```typescript
// ✅ Correct: Validate amount on server
export async function initiatePaymentAction(
  email: string,
  fullName: string,
  phoneNumber: string,
  amount: number // Never trust client-submitted amount
) {
  // 1. Type check
  if (!Number.isFinite(amount)) {
    throw new Error('Invalid amount');
  }

  // 2. Range check
  if (amount <= 0) {
    throw new Error('Amount must be positive');
  }

  // 3. Max limit check
  const MAX_AMOUNT = 999999999;
  if (amount > MAX_AMOUNT) {
    throw new Error('Amount exceeds limit');
  }

  // 4. Precision handling (critical!)
  const validatedAmount = Math.round(amount * 100) / 100;

  // 5. Log for audit
  console.log('[audit] Payment initiated', {
    amount: validatedAmount,
    email,
    timestamp: new Date().toISOString()
  });
}
```

### Why Server-Side Validation Matters

```typescript
// ❌ WRONG: Client-side only validation
const CheckoutForm = () => {
  const handleSubmit = async (amount) => {
    // Client says amount is 100
    // But attacker can:
    // 1. Modify request in network tab
    // 2. Change request to amount: 1
    // 3. Bypass client validation entirely
  };
};

// ✅ CORRECT: Server validates amount
export async function initiatePaymentAction(amount) {
  // Even if attacker sends amount: 1,
  // you verify it matches expected amount
  const expectedAmount = await db.order.findById(orderId).amount;
  
  if (amount !== expectedAmount) {
    throw new Error('Amount mismatch');
  }
}
```

## Webhook Security

### Signature Verification

```typescript
// ✅ Correct: Always verify webhook signature
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('verif-hash');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  // Verify signature before processing
  const isValid = await verifyWebhookSignature(body, signature);
  
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  // Now safe to process
  const payload = JSON.parse(body);
}
```

### Idempotency Protection

```typescript
// ✅ Correct: Handle duplicate webhooks safely
async function handleChargeCompleted(payload: any) {
  const txRef = payload.data.tx_ref;

  // Check if already processed
  const existing = await db.transaction.findUnique({
    where: { reference: txRef }
  });

  if (existing) {
    // Already processed, return 200 OK
    return NextResponse.json({ received: true });
  }

  // Process payment only once
  await db.transaction.create({
    data: {
      reference: txRef,
      status: 'completed',
      amount: payload.data.amount
    }
  });
}
```

### Webhook Timeout Handling

```typescript
// ✅ Correct: Don't rely solely on webhook
// Verify payment when user returns from Flutterwave
export async function verifyPaymentAction(transactionId: string) {
  // Call Flutterwave API to verify
  const response = await verifyPayment(transactionId);
  
  if (response.data.status === 'successful') {
    // Mark as completed
    await db.transaction.update({
      where: { id: transactionId },
      data: { status: 'completed' }
    });
  }
}
```

## Data Protection

### Sensitive Data Handling

```typescript
// ✅ Correct: Don't store sensitive payment data
const transaction = {
  id: 'uuid',
  reference: 'tx_123',
  email: 'customer@example.com',
  amount: 5000,
  status: 'completed',
  timestamp: new Date()
  // ❌ Never store: card number, PIN, CVV, full bank account
};

// ✅ Correct: Store only what you need
const FIELDS_TO_STORE = [
  'reference',    // ✅ Transaction reference
  'email',        // ✅ Email (masked in UI)
  'amount',       // ✅ Amount
  'status',       // ✅ Status
  'created_at'    // ✅ Timestamp
];
```

### PCI DSS Compliance

```typescript
// ✅ Correct: Never handle payment card details directly
// Flutterwave handles all card data securely

// ❌ WRONG: Never accept card details in your app
const cardNumber = req.body.cardNumber; // NEVER!

// ✅ CORRECT: Let Flutterwave handle it
const response = await initiatePayment({
  email, fullName, phoneNumber, amount
  // User enters card in Flutterwave's secure form
});
```

### Email Handling

```typescript
// ✅ Correct: Validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Correct: Sanitize before database
const sanitizedEmail = email.toLowerCase().trim();

// ❌ WRONG: Trust user input without validation
const email = req.body.email; // Could be anything
```

## Common Vulnerabilities

### 1. Amount Tampering

```typescript
// ❌ Vulnerable
function checkout(amount) {
  // Amount comes directly from form
  const total = amount; // Attacker changes 5000 to 50
  chargeCard(total);
}

// ✅ Secure
async function checkout(orderId) {
  // Fetch amount from database
  const order = await db.order.findById(orderId);
  const total = order.total; // True amount
  chargeCard(total);
}
```

### 2. Missing Validation

```typescript
// ❌ Vulnerable
async function initiatePayment(email, amount) {
  // No validation!
  return flutterwaveAPI.createTransaction({ email, amount });
}

// ✅ Secure
async function initiatePayment(email, fullName, phoneNumber, amount) {
  if (!isValidEmail(email)) throw new Error('Invalid email');
  if (!fullName?.trim()) throw new Error('Name required');
  if (!isValidPhoneNumber(phoneNumber)) throw new Error('Invalid phone');
  if (amount <= 0 || !Number.isFinite(amount)) throw new Error('Invalid amount');
  
  return flutterwaveAPI.createTransaction({ email, fullName, phoneNumber, amount });
}
```

### 3. Webhook Forgery

```typescript
// ❌ Vulnerable
app.post('/webhook', (req, res) => {
  // No signature verification!
  const payload = req.body;
  processPayment(payload); // Attacker can forge webhooks
});

// ✅ Secure
app.post('/webhook', async (req, res) => {
  const signature = req.headers['verif-hash'];
  const body = req.rawBody; // Get raw body
  
  if (!verifyWebhookSignature(body, signature)) {
    return res.status(401).json({ error: 'Invalid' });
  }
  
  const payload = JSON.parse(body);
  processPayment(payload); // Safe
});
```

### 4. Race Conditions

```typescript
// ❌ Vulnerable: Race condition
async function handleChargeCompleted(txRef) {
  const existing = await db.transaction.findOne({ reference: txRef });
  
  if (!existing) {
    // Gap: Webhook arrives twice simultaneously
    // Both check finds nothing
    // Both create new record
    await db.transaction.create({ reference: txRef });
  }
}

// ✅ Secure: Atomic operation
async function handleChargeCompleted(txRef) {
  await db.transaction.createUnique({
    where: { reference: txRef },
    data: { status: 'completed' }
    // Database enforces uniqueness
  });
}
```

### 5. Logging Sensitive Data

```typescript
// ❌ Vulnerable: Logs contain sensitive data
console.log('Payment initiated:', {
  email: 'customer@example.com',
  fullName: 'John Doe',
  amount: 5000,
  secretKey: process.env.FLW_SECRET_KEY // EXPOSED!
});

// ✅ Secure: Only log necessary data
console.log('[audit] Payment initiated:', {
  transactionRef: 'tx_abc123',
  amount: 5000,
  emailHash: sha256(email), // Hashed for correlation
  timestamp: new Date().toISOString()
});
```

## Security Checklist

### Before Each Deploy

- [ ] All secret keys removed from code
- [ ] `.env.local` added to `.gitignore`
- [ ] No hardcoded API keys
- [ ] All API calls use server-side validation
- [ ] Webhook signature verification enabled
- [ ] Error messages don't expose sensitive data
- [ ] Rate limiting configured (optional)
- [ ] HTTPS enabled in production
- [ ] Security headers configured
- [ ] Logging sanitized

### Before Going Live

- [ ] Switch from test to production keys
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Test payment flow completely
- [ ] Test webhook delivery
- [ ] Database backups configured
- [ ] Error tracking set up (Sentry, etc.)
- [ ] Monitoring configured
- [ ] Runbook for payment issues created
- [ ] Support team trained
- [ ] Security audit completed

### Regular Maintenance

- [ ] Review logs for suspicious activity
- [ ] Monitor failed transactions
- [ ] Rotate API keys quarterly
- [ ] Update dependencies monthly
- [ ] Test disaster recovery
- [ ] Review access logs

## Security Headers

```typescript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains'
        }
      ]
    }
  ]
};
```

## Rate Limiting

```typescript
// Prevent brute force attacks
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 h'), // 10 per hour
});

export async function initiatePaymentAction(email: string) {
  const { success } = await ratelimit.limit(email);
  
  if (!success) {
    throw new Error('Too many attempts. Try again later.');
  }

  // Process payment
}
```

## Incident Response

If you suspect a security issue:

1. **Immediate:**
   - Disable affected API key
   - Check webhook logs for suspicious activity
   - Review transaction history

2. **Short term:**
   - Rotate all API keys
   - Audit database for unauthorized changes
   - Review access logs

3. **Long term:**
   - Conduct security audit
   - Update security procedures
   - Notify affected users if needed

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [Flutterwave Security Docs](https://developer.flutterwave.com/docs/security)
- [Next.js Security Best Practices](https://nextjs.org/learn/foundations/how-nextjs-works/security)

## Support

For security concerns:
- Contact Flutterwave: security@flutterwave.com
- Report to: [security@yourdomain.com](mailto:security@yourdomain.com)
