# Flutterwave v3 PHP SDK - Complete Setup & Implementation Guide

This guide covers the complete setup, usage, and integration of the Flutterwave v3 PHP SDK in your application.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Core Components](#core-components)
4. [API Reference](#api-reference)
5. [Payment Methods](#payment-methods)
6. [Webhook Handling](#webhook-handling)
7. [Examples](#examples)
8. [Security](#security)
9. [Troubleshooting](#troubleshooting)

---

## Installation

### Requirements

- PHP 7.4 or higher
- Composer
- cURL extension enabled
- JSON extension enabled

### Step 1: Install via Composer

```bash
composer require flutterwave/sdk
```

This will install the latest version of the Flutterwave v3 SDK.

### Step 2: Verify Installation

```bash
composer show flutterwave/sdk
```

### Step 3: Autoload in Your Application

The SDK uses PSR-4 autoloading. Include Composer's autoload in your entry point:

```php
<?php
require 'vendor/autoload.php';
```

---

## Configuration

### Environment Setup

Create a `.env` file in your project root:

```env
# Flutterwave Configuration
FLW_PUBLIC_KEY=FLWPUBK_TEST-XXXXXXXXXXXXX
FLW_SECRET_KEY=FLWSECK_TEST-XXXXXXXXXXXXX
FLW_ENCRYPTION_KEY=FLWSECK_XXXXXXXXXXXXX

# Environment (staging or live)
FLW_ENV=staging

# Application Configuration
APP_URL=http://localhost:8000
APP_NAME=My Payment App
```

### Load Environment Variables

```php
<?php
require 'vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Access variables
$publicKey = $_ENV['FLW_PUBLIC_KEY'];
$secretKey = $_ENV['FLW_SECRET_KEY'];
```

---

## Core Components

### 1. Flutterwave Main Class

The main entry point for all Flutterwave operations.

```php
<?php
use Flutterwave\Flutterwave;

$flutterwave = new Flutterwave(
    $_ENV['FLW_PUBLIC_KEY'],
    $_ENV['FLW_SECRET_KEY']
);
```

### 2. Controller Classes

#### PaymentController

Handles payment-related operations.

```php
<?php
use Flutterwave\Controller\PaymentController;
use Flutterwave\Flutterwave;

$flutterwave = new Flutterwave(
    $_ENV['FLW_PUBLIC_KEY'],
    $_ENV['FLW_SECRET_KEY']
);

$paymentController = new PaymentController($flutterwave);
```

#### TransactionController

Handles transaction queries and verification.

```php
<?php
use Flutterwave\Controller\TransactionController;

$transactionController = new TransactionController($flutterwave);
```

### 3. Service Classes

#### CardPayment Service

Process card payments.

```php
<?php
use Flutterwave\Service\CardPayment;

$cardPayment = new CardPayment($flutterwave);

$payload = [
    'card_number' => '4239999999993030',
    'cvv' => '089',
    'expiry_month' => '09',
    'expiry_year' => '27',
    'currency' => 'NGN',
    'amount' => 5000,
    'email' => 'customer@example.com',
    'phone_number' => '08012345678',
    'fullname' => 'John Doe',
    'tx_ref' => 'TX-' . time(),
    'redirect_url' => $_ENV['APP_URL'] . '/callback'
];

$response = $cardPayment->charge($payload);
```

#### Bank Transfer Service

```php
<?php
use Flutterwave\Service\BankTransfer;

$bankTransfer = new BankTransfer($flutterwave);

$payload = [
    'account_number' => '0690000031',
    'account_bank' => '044',
    'amount' => 5000,
    'narration' => 'Payment for order #123',
    'currency' => 'NGN',
    'email' => 'customer@example.com',
    'phone_number' => '08012345678',
    'fullname' => 'John Doe',
    'tx_ref' => 'BANK-' . time()
];

$response = $bankTransfer->initiate($payload);
```

#### Mobile Money Service

```php
<?php
use Flutterwave\Service\MobileMoney;

$mobileMoney = new MobileMoney($flutterwave);

$payload = [
    'phone_number' => '0553454077',
    'amount' => 5000,
    'currency' => 'GHS',
    'email' => 'customer@example.com',
    'tx_ref' => 'MM-' . time(),
    'redirect_url' => $_ENV['APP_URL'] . '/callback'
];

$response = $mobileMoney->charge($payload);
```

---

## API Reference

### Payment Initialization

#### Initialize Payment

```php
<?php
use Flutterwave\Service\Card;

$card = new Card($flutterwave);

$payload = [
    'tx_ref' => 'TX-' . time(),
    'amount' => 5000,
    'currency' => 'NGN',
    'redirect_url' => $_ENV['APP_URL'] . '/payment-callback',
    'customer' => [
        'email' => 'customer@example.com',
        'phonenumber' => '08012345678',
        'name' => 'John Doe',
    ],
    'customizations' => [
        'title' => 'Payment for Order',
        'description' => 'Order #123',
        'logo' => $_ENV['APP_URL'] . '/logo.png'
    ]
];

$response = $card->initializePayment($payload);

// Response structure
if ($response['status'] === 'success') {
    $paymentLink = $response['data']['link'];
    // Redirect to payment link
    header('Location: ' . $paymentLink);
}
```

### Transaction Verification

#### Verify by Transaction ID

```php
<?php
use Flutterwave\Controller\TransactionController;

$transactionController = new TransactionController($flutterwave);

$transactionId = $_GET['transaction_id'];

$response = $transactionController->verify($transactionId);

// Response
/*
{
    "status": "success",
    "message": "Charge fetched successfully",
    "data": {
        "id": 1234567,
        "tx_ref": "TX-123456",
        "amount": 5000,
        "currency": "NGN",
        "status": "successful",
        "customer": {
            "email": "customer@example.com"
        }
    }
}
*/
```

#### Verify by Reference

```php
<?php
$reference = $_GET['reference'];
$response = $transactionController->verifyByReference($reference);
```

### Get Transactions

#### Get All Transactions

```php
<?php
$response = $transactionController->getTransactions();

// With filters
$response = $transactionController->getTransactions([
    'from' => time() - (30 * 24 * 60 * 60), // 30 days ago
    'to' => time(),
    'status' => 'successful'
]);
```

#### Get Single Transaction

```php
<?php
$transactionId = 1234567;
$response = $transactionController->getTransaction($transactionId);
```

---

## Payment Methods

### 1. Card Payment

```php
<?php
use Flutterwave\Service\CardPayment;

$cardPayment = new CardPayment($flutterwave);

$payload = [
    'card_number' => '4239999999993030',
    'cvv' => '089',
    'expiry_month' => '09',
    'expiry_year' => '27',
    'currency' => 'NGN',
    'amount' => 5000,
    'email' => 'customer@example.com',
    'tx_ref' => 'TX-' . time(),
];

$response = $cardPayment->charge($payload);

// Handle 3D Secure
if (isset($response['data']['authmodel']) && $response['data']['authmodel'] === '3DS') {
    $authUrl = $response['data']['authurl'];
    // Redirect for 3D Secure authentication
}
```

### 2. Bank Account Transfer

```php
<?php
use Flutterwave\Service\BankTransfer;

$bankTransfer = new BankTransfer($flutterwave);

$payload = [
    'account_number' => '0690000031',
    'account_bank' => '044',
    'amount' => 5000,
    'narration' => 'Payment',
    'currency' => 'NGN',
    'email' => 'customer@example.com',
    'tx_ref' => 'BANK-' . time(),
];

$response = $bankTransfer->initiate($payload);

// Get bank details for customer to transfer
$bankDetails = $response['data'];
// Display bank details to customer
```

### 3. Mobile Money

```php
<?php
use Flutterwave\Service\MobileMoney;

$mobileMoney = new MobileMoney($flutterwave);

$payload = [
    'phone_number' => '0553454077',
    'amount' => 5000,
    'currency' => 'GHS',
    'email' => 'customer@example.com',
    'tx_ref' => 'MM-' . time(),
];

$response = $mobileMoney->charge($payload);
```

### 4. USSD

```php
<?php
use Flutterwave\Service\USSD;

$ussd = new USSD($flutterwave);

$payload = [
    'account_number' => '0690000031',
    'account_bank' => '044',
    'amount' => 5000,
    'email' => 'customer@example.com',
    'tx_ref' => 'USSD-' . time(),
];

$response = $ussd->charge($payload);

// Get USSD code for customer
$ussdCode = $response['data']['ussd'];
```

---

## Webhook Handling

### Webhook Setup

1. Go to Flutterwave Dashboard → Settings → Webhooks
2. Set Webhook URL: `https://your-domain.com/webhook`
3. Select events to receive

### Webhook Handler

```php
<?php
// webhook.php

use Flutterwave\Webhook\Webhook;
use Flutterwave\Flutterwave;

$flutterwave = new Flutterwave(
    $_ENV['FLW_PUBLIC_KEY'],
    $_ENV['FLW_SECRET_KEY']
);

$webhook = new Webhook($flutterwave);

// Get webhook data
$body = file_get_contents('php://input');
$headers = getallheaders();

$hash = $headers['verif-hash'] ?? '';

try {
    // Verify webhook signature
    if (!$webhook->verify($body, $hash)) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Signature verification failed']);
        exit;
    }

    $data = json_decode($body, true);
    $event = $data['event'] ?? '';

    switch ($event) {
        case 'charge.completed':
            handlePaymentSuccess($data['data']);
            break;
        case 'charge.failed':
            handlePaymentFailure($data['data']);
            break;
        case 'transfer.completed':
            handleTransferSuccess($data['data']);
            break;
    }

    http_response_code(200);
    echo json_encode(['status' => 'received']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

function handlePaymentSuccess($data) {
    // Update database
    $transactionId = $data['id'];
    $amount = $data['amount'];
    $customerEmail = $data['customer']['email'];
    
    // Process order, send confirmation email, etc.
}

function handlePaymentFailure($data) {
    // Log failed payment
    // Notify customer
}
```

### Event Types

- `charge.completed` - Successful payment
- `charge.failed` - Failed payment
- `charge.updated` - Payment status updated
- `transfer.completed` - Transfer successful
- `transfer.failed` - Transfer failed
- `settlement.disburse` - Settlement processed

---

## Examples

### Complete Payment Flow

```php
<?php
// payment.php

require 'vendor/autoload.php';

use Flutterwave\Flutterwave;
use Flutterwave\Service\Card;

// Initialize
$flutterwave = new Flutterwave(
    $_ENV['FLW_PUBLIC_KEY'],
    $_ENV['FLW_SECRET_KEY']
);

// Get payment data from form
$amount = $_POST['amount'];
$email = $_POST['email'];
$name = $_POST['name'];

// Create payment
$card = new Card($flutterwave);

$payload = [
    'tx_ref' => 'TX-' . time(),
    'amount' => $amount,
    'currency' => 'NGN',
    'redirect_url' => $_ENV['APP_URL'] . '/callback',
    'customer' => [
        'email' => $email,
        'name' => $name,
    ]
];

try {
    $response = $card->initializePayment($payload);
    
    if ($response['status'] === 'success') {
        // Store transaction reference
        saveTransaction($payload['tx_ref'], $amount, $email);
        
        // Redirect to payment
        header('Location: ' . $response['data']['link']);
    } else {
        throw new Exception('Payment initialization failed');
    }
} catch (Exception $e) {
    die('Error: ' . $e->getMessage());
}

function saveTransaction($ref, $amount, $email) {
    // Save to database
}
?>
```

### Payment Callback Handler

```php
<?php
// callback.php

require 'vendor/autoload.php';

use Flutterwave\Flutterwave;
use Flutterwave\Controller\TransactionController;

$flutterwave = new Flutterwave(
    $_ENV['FLW_PUBLIC_KEY'],
    $_ENV['FLW_SECRET_KEY']
);

$transactionController = new TransactionController($flutterwave);

$transactionId = $_GET['transaction_id'];

try {
    $response = $transactionController->verify($transactionId);
    
    if ($response['status'] === 'success') {
        $transaction = $response['data'];
        
        if ($transaction['status'] === 'successful') {
            // Payment successful
            updateTransactionStatus($transaction['tx_ref'], 'completed');
            echo "Payment successful! Transaction ID: " . $transaction['id'];
        } else {
            // Payment failed
            updateTransactionStatus($transaction['tx_ref'], 'failed');
            echo "Payment failed. Status: " . $transaction['status'];
        }
    }
} catch (Exception $e) {
    echo "Verification error: " . $e->getMessage();
}

function updateTransactionStatus($ref, $status) {
    // Update database
}
?>
```

---

## Security

### Best Practices

1. **Environment Variables**
   - Never hardcode API keys
   - Use `.env` files (add to `.gitignore`)
   - Use secure secret management in production

2. **HTTPS Only**
   - Always use HTTPS for payment pages
   - Redirect HTTP to HTTPS
   - Set secure cookies

3. **Input Validation**
   ```php
   <?php
   $amount = (float) $_POST['amount'];
   if ($amount <= 0) {
       throw new Exception('Invalid amount');
   }
   
   $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);
   if (!$email) {
       throw new Exception('Invalid email');
   }
   ?>
   ```

4. **Rate Limiting**
   ```php
   <?php
   // Prevent duplicate transactions
   $lastTransaction = getLastTransaction($_SESSION['user_id']);
   if ($lastTransaction && time() - $lastTransaction < 60) {
       throw new Exception('Please wait before creating another transaction');
   }
   ?>
   ```

5. **Error Handling**
   ```php
   <?php
   try {
       // Payment code
   } catch (Exception $e) {
       // Log error internally
       error_log($e->getMessage());
       
       // Return generic error to user
       die('An error occurred. Please try again.');
   }
   ?>
   ```

6. **Webhook Verification**
   ```php
   <?php
   // Always verify webhook signature
   if (!$webhook->verify($body, $hash)) {
       http_response_code(401);
       exit;
   }
   ?>
   ```

---

## Troubleshooting

### "API Key Invalid"
- Verify keys in environment variables
- Check you're using correct environment (staging/live)
- Regenerate keys in Flutterwave dashboard

### "Signature Verification Failed"
- Ensure secret key is correct
- Check webhook is receiving raw body
- Verify hash algorithm matches

### "Transaction Not Found"
- Verify transaction ID is correct
- Check transaction exists in Flutterwave dashboard
- Ensure API credentials are correct

### "Rate Limited"
- Wait before making more requests
- Implement exponential backoff
- Contact Flutterwave support for rate limits

### "Card Declined"
- Use test card: 4239 9999 9999 3030
- Verify card details (number, CVV, expiry)
- Check card supports online payments
- Try different card

### "CORS Issues"
- Ensure requests are from your domain
- Add domain to Flutterwave dashboard if required
- Use backend for API calls (not frontend)

---

## Directory Structure

```
project-root/
├── vendor/                  # Composer packages
├── src/
│   ├── Controller/
│   │   ├── PaymentController.php
│   │   └── TransactionController.php
│   ├── Service/
│   │   ├── CardPayment.php
│   │   ├── BankTransfer.php
│   │   ├── MobileMoney.php
│   │   └── USSD.php
│   └── Flutterwave.php     # Main class
├── .env                     # Environment variables
├── .gitignore              # Git ignore
├── composer.json           # Composer configuration
├── payment.php             # Payment initialization
├── callback.php            # Callback handler
├── webhook.php             # Webhook handler
└── README.md
```

---

## Additional Resources

- [Flutterwave Developer Docs](https://developer.flutterwave.com)
- [Flutterwave API Reference](https://developer.flutterwave.com/reference)
- [GitHub Repository](https://github.com/flutterwave/flutterwave-php-v3)
- [Support Email](https://flutterwave.com/contact)

---

## Version History

- **v3.0.0** - Latest stable version
- **v2.x.x** - Legacy (not recommended)

---

## License

MIT License - See LICENSE file for details

---

## Support

Need help? 
- Check Flutterwave docs: https://developer.flutterwave.com
- Contact support: https://flutterwave.com/contact
- GitHub issues: https://github.com/flutterwave/flutterwave-php-v3/issues
