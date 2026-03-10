# Flutterwave v3 PHP SDK - Setup & Implementation Guide

This guide provides step-by-step instructions for setting up and implementing the Flutterwave v3 PHP SDK in your application.

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Getting Started](#getting-started)
5. [Payment Methods](#payment-methods)
6. [Advanced Features](#advanced-features)
7. [Error Handling](#error-handling)
8. [Testing](#testing)
9. [Support](#support)

## Requirements

- **PHP Version**: 7.4 or higher (8.0+ recommended)
- **Composer**: Latest version
- **Flutterwave Account**: Active F4B account with API keys
- **Required PHP Extensions**:
  - ext-json
  - ext-curl
  - ext-openssl

## Installation

### Step 1: Install via Composer

```bash
composer require flutterwavedev/flutterwave-v3
```

### Step 2: Download Release (Alternative)

If you prefer not to use Composer, download the latest release from:
https://github.com/Flutterwave/Flutterwave-PHP-v3/releases/

Extract the ZIP file to your project directory.

## Configuration

### Step 1: Create .env File

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

### Step 2: Add Your API Keys

Edit the `.env` file and replace the placeholder values with your actual Flutterwave API keys:

```env
FLW_PUBLIC_KEY=FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X
FLW_SECRET_KEY=FLWSECK_TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-X
FLW_ENCRYPTION_KEY=FLWSECK_XXXXXXXXXXXXXXXX
FLW_ENV=staging
FLW_LOG_DIR=logs
```

**Where to find your keys:**

1. Log in to your Flutterwave Dashboard
2. Navigate to Settings > API Keys
3. Copy your Public Key, Secret Key, and Encryption Key
4. Use `staging` for testing and `production` for live transactions

### Step 3: Create Logs Directory

Ensure the logs directory exists and is writable:

```bash
mkdir -p logs
chmod 755 logs
```

## Getting Started

### Basic Payment Implementation

The SDK provides a simple way to collect payments. Here's the minimal setup:

#### 1. Create Payment Form (paymentForm.php)

The `paymentForm.php` file contains a pre-built form with:
- Amount input
- Currency selection
- Customer information fields
- Automatic transaction reference generation

Simply access it in your browser:
```
http://your-domain/paymentForm.php
```

#### 2. Payment Processing (processPayment.php)

The `processPayment.php` handles:
- Payment initiation through Flutterwave modal
- Callback verification after payment
- Error handling and logging

### Using the SDK Directly

Here's an example of card payment using the SDK:

```php
<?php
require 'vendor/autoload.php';

use Flutterwave\Flutterwave;
use Flutterwave\Util\Currency;

// Bootstrap Flutterwave
Flutterwave::bootstrap();

try {
    // Create card payment instance
    $cardPayment = Flutterwave::create("card");
    
    // Create customer
    $customer = $cardPayment->customer->create([
        "full_name" => "John Doe",
        "email" => "john@example.com",
        "phone" => "+2348000000000"
    ]);
    
    // Create payload
    $payload = $cardPayment->payload->create([
        "amount" => 5000,
        "currency" => Currency::NGN,
        "tx_ref" => uniqid('TXREF_'),
        "redirectUrl" => "https://your-domain/verify.php",
        "customer" => $customer,
        "card_details" => [
            "card_number" => "4556052704172643",
            "cvv" => "899",
            "expiry_month" => "01",
            "expiry_year" => "23"
        ]
    ]);
    
    // Initiate payment
    $result = $cardPayment->initiate($payload);
    
    if($result['success']) {
        echo "Payment initiated successfully";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
```

## Payment Methods

The SDK supports multiple payment methods:

### 1. Card Payments
- Debit/Credit cards
- Pre-authorization support
- OTP and AVS authentication

### 2. Mobile Money
- MTN Mobile Money
- Airtel Money
- Vodafone Cash
- Support for multiple African countries

### 3. Bank Transfers
- Collect payments via bank account
- Virtual account support
- Automatic settlement

### 4. USSD
- Collect payments via USSD codes
- Works without internet connectivity

### 5. Apple Pay & Google Pay
- Seamless mobile payments
- Tokenized payment support

### 6. Wallets & Alternative Methods
- M-Pesa
- E-Naira
- Fawry Pay
- And many more

For detailed implementation of each method, refer to:
https://github.com/Flutterwave/PHP-v3/wiki/Direct-Charge

## Advanced Features

### Tokenized Payments

Store card tokens for recurring charges:

```php
$tokenizedPayment = Flutterwave::create("tokenized_charge");
$result = $tokenizedPayment->charge([
    "amount" => 5000,
    "currency" => "NGN",
    "token" => "stored_token_id",
    "email" => "customer@example.com"
]);
```

### Subscription Payments

Set up recurring payments:

```php
$subscription = Flutterwave::create("subscription");
$result = $subscription->create([
    "amount" => 5000,
    "currency" => "NGN",
    "plan_duration" => 12,
    "plan_name" => "Monthly Plan"
]);
```

### Payment Plans

Create flexible payment plans:

```php
$paymentPlan = Flutterwave::create("payment_plan");
$result = $paymentPlan->create([
    "amount" => 50000,
    "name" => "Quarterly Payment",
    "interval" => "quarterly",
    "duration" => 4
]);
```

### Payouts & Transfers

Send money to bank accounts or mobile wallets:

```php
$transfer = Flutterwave::create("transfer");
$result = $transfer->initiate([
    "amount" => 10000,
    "currency" => "NGN",
    "beneficiary_name" => "John Doe",
    "bank_code" => "044",
    "account_number" => "0123456789",
    "narration" => "Payment for services"
]);
```

### Split Payments

Split payments between multiple accounts:

```php
$payload = $cardPayment->payload->create([
    "amount" => 5000,
    "currency" => "NGN",
    "subaccounts" => [
        [
            "id" => "ACC_ID_1",
            "transaction_split_ratio" => "20%"
        ],
        [
            "id" => "ACC_ID_2",
            "transaction_split_ratio" => "80%"
        ]
    ]
]);
```

## Error Handling

The SDK provides comprehensive error handling:

### Exception Types

```php
use Flutterwave\Exception\AuthenticationException;
use Flutterwave\Exception\ApiException;
use Flutterwave\Exception\RequestException;
use Flutterwave\Exception\NetworkException;

try {
    // Payment code here
} catch (AuthenticationException $e) {
    // Handle authentication errors (invalid keys)
    error_log("Auth Error: " . $e->getMessage());
} catch (ApiException $e) {
    // Handle API errors
    error_log("API Error: " . $e->getMessage());
} catch (NetworkException $e) {
    // Handle network errors
    error_log("Network Error: " . $e->getMessage());
} catch (Exception $e) {
    // Handle other errors
    error_log("Error: " . $e->getMessage());
}
```

### Best Practices

1. **Always use try-catch blocks** for all SDK operations
2. **Log all errors** for debugging and monitoring
3. **Validate user input** before sending to the API
4. **Store transaction references** for reconciliation
5. **Verify payments** through callbacks, not just user reports

## Testing

### Test Mode

The SDK runs in test mode when `FLW_ENV=staging` in your `.env` file.

### Test Card Numbers

For testing card payments:

```
Card: 4556052704172643
CVV: 899
Expiry: 01/23
```

For other test cards, refer to the test resources in:
`tests/Resources/Card/test_cards.php`

### Running Tests

```bash
# Run all tests
composer test

# Run specific test
./vendor/bin/pest tests/Unit/Service/CardTest.php
```

### Test Examples

Complete examples are available in the `examples/` directory:

- `examples/card.php` - Card payment example
- `examples/mpesa.php` - M-Pesa payment example
- `examples/momo.php` - Mobile Money example
- `examples/bank_transfer.php` - Bank transfer example
- And many more...

## Webhook Handling

To handle payment webhooks from Flutterwave:

```php
<?php
// webhook.php

require 'vendor/autoload.php';

use Flutterwave\Flutterwave;

Flutterwave::bootstrap();

// Get webhook data
$webhook = json_decode(file_get_contents('php://input'), true);

// Verify webhook signature (optional but recommended)
$signature = $_SERVER['HTTP_VERYHASH'] ?? '';
$webhook_secret = $_ENV['FLW_SECRET_KEY'];

// Process webhook based on event type
if ($webhook['event'] === 'charge.completed') {
    $transaction = $webhook['data'];
    
    // Update your database
    // Send confirmation email
    // Trigger fulfillment process
    
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
} else {
    http_response_code(400);
    echo json_encode(['status' => 'error']);
}
?>
```

## Debugging

### Enable Logging

Log files are created in the directory specified by `FLW_LOG_DIR`:

```
logs/
├── 2025-03-10-*.log
├── error-*.log
└── ...
```

Check these logs for detailed error messages and API responses.

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Environment variables missing" | Ensure .env file exists and contains all required keys |
| "Invalid API key" | Double-check your PUBLIC_KEY and SECRET_KEY from dashboard |
| "CORS errors" | Configure CORS headers on your server |
| "Payment modal not appearing" | Ensure JavaScript is enabled and Modal library is loaded |
| "Callback not firing" | Check your webhook URL configuration in Flutterwave dashboard |

## Support

### Resources

- **Documentation**: https://developer.flutterwave.com
- **GitHub**: https://github.com/Flutterwave/Flutterwave-PHP-v3
- **Email**: developers@flutterwavego.com
- **Slack Community**: https://bit.ly/34Vkzcg
- **Forum**: http://forum.flutterwave.com

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This library is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Last Updated**: March 10, 2025  
**SDK Version**: 1.1.0+
