# Troubleshooting Guide

Common issues and solutions for the Flutterwave Next.js integration.

## Environment & Setup

### Issue: "FLW_SECRET_KEY environment variable is not set"

**When it happens:** On server startup or first API call

**Cause:** Missing `.env.local` file or incorrect variable name

**Solution:**
```bash
# 1. Check if .env.local exists
ls -la .env.local

# 2. If missing, create it
cp .env.local.example .env.local

# 3. Edit and add your keys
# NEXT_PUBLIC_FLW_PUBLIC_KEY=FLWPUBK_TEST-...
# FLW_SECRET_KEY=FLWSECK_TEST-...

# 4. Restart dev server
npm run dev
```

### Issue: "Cannot find module 'next'"

**When it happens:** Running `npm run dev`

**Cause:** Dependencies not installed

**Solution:**
```bash
# Install all dependencies
npm install

# Verify installation
npm run dev
```

### Issue: "Port 3000 already in use"

**When it happens:** Running `npm run dev`

**Cause:** Another process using port 3000

**Solution:**
```bash
# Option 1: Use different port
npm run dev -- -p 3001

# Option 2: Kill process on port 3000
# macOS/Linux:
lsof -ti:3000 | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Payment Form Issues

### Issue: Form fields not accepting input

**When it happens:** Click input field, nothing happens

**Cause:** Component CSS issue or browser extension

**Solution:**
```typescript
// Check form is rendering correctly
// Clear browser cache: Ctrl+Shift+Delete
// Disable browser extensions
// Try incognito window
```

### Issue: "Invalid full name" validation error

**When it happens:** Click submit with name filled

**Cause:** Name too short (minimum 2 characters)

**Solution:**
```
Name: "John Doe" ✅ (correct - 9 characters)
Name: "Jo" ✅ (correct - 2 characters)
Name: "J" ❌ (wrong - 1 character)
```

### Issue: "Invalid email address" error

**When it happens:** Email field shows error

**Cause:** Email format invalid

**Solution:**
```
Email: john@example.com ✅ (correct)
Email: john.doe@company.co.uk ✅ (correct)
Email: johnexample.com ❌ (missing @)
Email: john@.com ❌ (no domain)
```

### Issue: "Invalid phone number" error

**When it happens:** Phone field shows error

**Cause:** Phone number too short or invalid format

**Solution:**
```
Phone: +234803840000001 ✅ (correct - 13 characters)
Phone: 0803840000001 ✅ (correct - 12 characters)
Phone: 0803 ❌ (too short)

Use format: +234XXXXXXXXXX or 0XXXXXXXXXX
```

### Issue: Form submitting endlessly (loading spinner won't stop)

**When it happens:** Click submit, loading spinner doesn't stop

**Cause:** API request hanging or error not caught

**Solution:**
```typescript
// Check browser console for errors: F12 → Console
// Check network tab: F12 → Network
// Verify API keys are correct
// Check internet connection

// Restart dev server
npm run dev
```

## Payment Initialization

### Issue: "Payment initiation failed"

**When it happens:** Form submission, error message appears

**Cause:** Could be several reasons

**Debug steps:**
```typescript
// 1. Check browser console: F12 → Console
// Look for detailed error message

// 2. Check API keys
// Are they correct in .env.local?

// 3. Check amount validation
// Is amount > 0?
// Is amount a number?

// 4. Check Flutterwave API status
// Visit https://status.flutterwave.com

// 5. Try with test amount
// Use 5000 instead of custom amount
```

### Issue: "Redirected to payment page but shows error"

**When it happens:** After form submission, Flutterwave page shows error

**Cause:** Invalid payment link or account issue

**Solution:**
```
1. Check Flutterwave account is active
2. Verify API keys are production keys (not test keys)
3. Check amount is reasonable (not 0 or negative)
4. Try test card: 4242 4242 4242 4242
```

### Issue: User redirected to wrong page after payment

**When it happens:** After completing payment on Flutterwave

**Cause:** Incorrect redirect URL configuration

**Solution:**
```bash
# Check .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Must match your actual URL

# In production:
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Payment Verification

### Issue: "No transaction ID provided" on callback page

**When it happens:** Callback page loads but shows error

**Cause:** URL parameters missing

**Solution:**
```
Correct URL: /payment/callback?transaction_id=12345
Wrong URL: /payment/callback (missing parameter)

Flutterwave should append: ?transaction_id=<ID>
```

### Issue: "Payment verification failed" on callback

**When it happens:** Callback page loads but verification errors

**Cause:** Could be several reasons

**Debug steps:**
```typescript
// 1. Check transaction ID in URL
// Browser DevTools → Application → URL

// 2. Verify in Flutterwave Dashboard
// Check transaction exists and status

// 3. Check API keys
// Are they correct?

// 4. Check internet connection
// Verify can reach Flutterwave API

// 5. Check logs
// Browser console for client-side errors
```

## Webhook Issues

### Issue: Webhook not receiving events

**When it happens:** Payment completes but webhook doesn't arrive

**Cause:** Webhook configuration issue

**Solution:**
```
1. Check webhook URL in Flutterwave Dashboard:
   Settings → Webhooks
   
2. Verify URL is correct:
   https://yourdomain.com/api/webhook
   
3. Ensure URL is publicly accessible:
   Try visiting in browser: should show error (no POST body)
   
4. Check webhook events enabled:
   Should have: charge.completed, charge.failed
   
5. Test webhook:
   Flutterwave Dashboard provides "Test Webhook" button
```

### Issue: Webhook returns "401 Unauthorized"

**When it happens:** Flutterwave logs show webhook errors

**Cause:** Signature verification failed

**Solution:**
```typescript
// Check 1: Secret key is correct
// FLW_SECRET_KEY in .env matches Flutterwave account

// Check 2: Raw body is used for verification
// Don't parse JSON before verification

// Check 3: Signature header name
// Should be: verif-hash (lowercase)

// Debug: Log signature verification
console.log('[webhook] Signature:', signature);
console.log('[webhook] Computed:', computedHash);
console.log('[webhook] Match:', signature === computedHash);
```

### Issue: Duplicate transactions created

**When it happens:** Same payment appears twice in database

**Cause:** Webhook received twice (normal behavior)

**Solution:**
```typescript
// Use unique constraint on transaction reference
// In database: CREATE UNIQUE INDEX on (reference)

// In code: Check before creating
const existing = await db.transaction.findUnique({
  where: { reference: txRef }
});

if (existing) {
  return; // Already processed
}

// Create only if doesn't exist
await db.transaction.create({ ... });
```

## API & Integration

### Issue: "Invalid request" from Flutterwave API

**When it happens:** Payment initiation fails

**Cause:** Malformed API request

**Debug:**
```typescript
// Check payload structure
// Should have:
// - amount (number, > 0)
// - email (valid format)
// - tx_ref (unique string)
// - customer (object with name, email, phone)

// Check for typos in field names
// Flutterwave uses snake_case: tx_ref, not txRef
```

### Issue: Amount precision issues (e.g., 5000.333333)

**When it happens:** Payment goes through but amount is wrong

**Cause:** Floating-point precision not handled

**Solution:**
```typescript
// Always round to 2 decimal places
const amount = 5000.333333;
const validAmount = Math.round(amount * 100) / 100; // 5000.33
```

### Issue: "Transaction reference already exists"

**When it happens:** Trying to create payment with same reference

**Cause:** Reference reused (not unique)

**Solution:**
```typescript
// Generate unique reference each time
const generateTransactionRef = () => {
  return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Never reuse references
```

## Security Issues

### Issue: API key exposed in logs/console

**When it happens:** Debugging, log shows secret key

**Cause:** Logging sensitive data

**Solution:**
```typescript
// ❌ WRONG
console.log('Config:', {
  secretKey: process.env.FLW_SECRET_KEY
});

// ✅ RIGHT
console.log('[audit] Payment initiated:', {
  transactionRef: 'tx_...',
  amount: 5000,
  timestamp: new Date().toISOString()
});
```

### Issue: Secret key in version control

**When it happens:** Committed `.env.local` to git

**Cause:** Not in `.gitignore`

**Solution:**
```bash
# 1. Check .gitignore has .env.local
grep ".env.local" .gitignore

# 2. Remove from git history
git rm --cached .env.local
git commit -m "Remove .env.local"

# 3. Rotate API keys immediately
# - Flutterwave Dashboard → Settings → API Keys
# - Generate new keys
# - Update .env.local locally

# 4. Review git history for exposure
git log --all --full-history -- .env.local
```

## Database Integration

### Issue: "Cannot find module '@prisma/client'"

**When it happens:** Importing Prisma in webhook handler

**Cause:** Prisma not installed

**Solution:**
```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init
```

### Issue: Transaction update fails in webhook

**When it happens:** Payment completes but database not updated

**Cause:** Database connection issue

**Solution:**
```typescript
// Check database connection
const transaction = await db.transaction.findFirst();

// Check table exists
// SELECT * FROM transactions;

// Check permissions
// User can INSERT, UPDATE, DELETE

// Verify environment variable
// DATABASE_URL is set correctly
```

## Production Issues

### Issue: Works locally but fails in production

**When it happens:** Everything works in dev, breaks on Vercel

**Common causes & solutions:**

```bash
# 1. Environment variables not set
# Solution: Check Vercel project settings → Vars

# 2. Wrong API keys
# Solution: Use PRODUCTION keys, not test keys

# 3. HTTPS not enforced
# Solution: Update NEXT_PUBLIC_APP_URL to https://...

# 4. Webhook URL not accessible
# Solution: Verify domain is publicly accessible

# 5. Build errors
# Solution: Check build logs: npm run build
```

### Issue: Timeouts in production

**When it happens:** Payment requests timeout randomly

**Cause:** Slow API responses or network issues

**Solution:**
```typescript
// Add timeout handling
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000); // 10 sec

try {
  const response = await fetch(url, { signal: controller.signal });
} catch (error) {
  if (error.name === 'AbortError') {
    // Timeout occurred
  }
}
```

## Getting Additional Help

### Resources

1. **Flutterwave Docs:** https://developer.flutterwave.com/docs
2. **Flutterwave Status:** https://status.flutterwave.com
3. **Next.js Docs:** https://nextjs.org/docs
4. **Browser DevTools:** F12 (Chrome/Firefox)

### Debugging Checklist

When something breaks:

- [ ] Check browser console: F12 → Console
- [ ] Check network requests: F12 → Network
- [ ] Check server logs: npm run dev output
- [ ] Verify environment variables
- [ ] Check API keys are correct
- [ ] Verify Flutterwave account active
- [ ] Try test credentials
- [ ] Clear browser cache
- [ ] Try incognito window
- [ ] Restart dev server

### Reporting Issues

If you can't solve it:

1. **For Flutterwave issues:** support@flutterwave.com
2. **For Next.js issues:** GitHub discussions
3. **For this project:** Check documentation

Include:
- Error message (exact text)
- Steps to reproduce
- Environment (Node version, OS)
- Screenshots if applicable
- Logs (sanitized, no API keys)

---

**Happy debugging! Most issues are resolved by checking environment variables and API keys.**
