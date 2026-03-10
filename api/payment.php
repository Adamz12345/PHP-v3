<?php

/**
 * Flutterwave Payment API Endpoint
 * 
 * This file demonstrates how to create a JSON API endpoint for payment processing.
 * Use this for AJAX or mobile app integrations.
 */

declare(strict_types=1);

require __DIR__ . '/vendor/autoload.php';

use Flutterwave\Flutterwave;
use Flutterwave\Helper\PaymentValidator;
use Flutterwave\Helper\ErrorHandler;
use Flutterwave\Helper\ResponseBuilder;

// Start session
session_start();

// Set JSON response header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Initialize Flutterwave
    Flutterwave::bootstrap();
    
    // Only accept POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new \Exception('Only POST requests are allowed');
    }
    
    // Get request data
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input === null) {
        // Try form data as fallback
        $input = $_POST;
    }
    
    // Log incoming request
    error_log("API Request: " . json_encode([
        'action' => $input['action'] ?? 'unknown',
        'email' => $input['email'] ?? 'unknown',
        'timestamp' => date('Y-m-d H:i:s')
    ]));
    
    // Determine action
    $action = $input['action'] ?? null;
    
    // Route to appropriate handler
    switch ($action) {
        case 'initiate_payment':
            handlePaymentInitiation($input);
            break;
            
        case 'verify_payment':
            handlePaymentVerification($input);
            break;
            
        case 'get_payment_status':
            handlePaymentStatus($input);
            break;
            
        default:
            ResponseBuilder::json(
                ResponseBuilder::error('Invalid action: ' . ($action ?? 'none'), 'INVALID_ACTION'),
                400
            );
    }
    
} catch (\Exception $e) {
    error_log("API Error: " . $e->getMessage());
    ResponseBuilder::json(
        ResponseBuilder::error($e->getMessage(), 'SERVER_ERROR'),
        500
    );
}

/**
 * Handle payment initiation
 */
function handlePaymentInitiation(array $input): void
{
    // Validate input data
    $validation = PaymentValidator::validate($input);
    
    if (!$validation['valid']) {
        ResponseBuilder::json(
            ResponseBuilder::error(
                'Validation failed',
                'VALIDATION_ERROR',
                $validation['errors']
            ),
            400
        );
    }
    
    try {
        // Create payment reference
        $txRef = PaymentValidator::generateTxRef();
        
        // Prepare payment data
        $paymentData = [
            'amount' => PaymentValidator::formatAmount((float)$input['amount']),
            'currency' => $input['currency'],
            'tx_ref' => $txRef,
            'email' => $input['email'],
            'phone_number' => $input['phone_number'] ?? null,
            'customer' => [
                'name' => $input['first_name'] . ' ' . $input['last_name'],
                'email' => $input['email'],
                'phone' => $input['phone_number'] ?? null
            ],
            'customizations' => [
                'title' => 'Payment',
                'description' => $input['description'] ?? 'Payment for services',
                'logo' => $_SERVER['HTTP_ORIGIN'] . '/logo.png'
            ]
        ];
        
        // Store transaction reference in session for verification
        $_SESSION['payment_tx_ref'] = $txRef;
        $_SESSION['payment_amount'] = $input['amount'];
        $_SESSION['payment_email'] = $input['email'];
        
        // Log payment initiation
        error_log("Payment Initiated: TX_REF=$txRef, Amount={$input['amount']}, Email={$input['email']}");
        
        // Return success with payment reference
        ResponseBuilder::json(
            ResponseBuilder::success(
                [
                    'tx_ref' => $txRef,
                    'amount' => $input['amount'],
                    'currency' => $input['currency'],
                    'timestamp' => date('Y-m-d H:i:s')
                ],
                'Payment initiated successfully'
            ),
            200
        );
        
    } catch (\Exception $e) {
        error_log("Payment Initiation Error: " . $e->getMessage());
        ResponseBuilder::json(
            ResponseBuilder::error($e->getMessage(), 'PAYMENT_INIT_ERROR'),
            400
        );
    }
}

/**
 * Handle payment verification
 */
function handlePaymentVerification(array $input): void
{
    $txRef = $input['tx_ref'] ?? null;
    
    if (!$txRef) {
        ResponseBuilder::json(
            ResponseBuilder::error('Transaction reference required', 'MISSING_TX_REF'),
            400
        );
    }
    
    try {
        // Initialize Flutterwave client
        $client = new \Flutterwave\Flutterwave();
        $transaction = $client->getInstance()->Transactions;
        
        // Verify transaction
        $result = $transaction->verify($txRef);
        
        if ($result['status'] === 'success' && $result['data']['status'] === 'successful') {
            // Log successful payment
            error_log("Payment Verified Successfully: TX_REF=$txRef, Amount={$result['data']['amount']}");
            
            ResponseBuilder::json(
                ResponseBuilder::success(
                    [
                        'tx_ref' => $txRef,
                        'status' => 'success',
                        'amount' => $result['data']['amount'] / 100, // Convert back to original unit
                        'currency' => $result['data']['currency'],
                        'customer' => $result['data']['customer'],
                        'timestamp' => $result['data']['created_at']
                    ],
                    'Payment verified successfully'
                ),
                200
            );
        } else {
            error_log("Payment Verification Failed: TX_REF=$txRef, Status={$result['data']['status'] ?? 'unknown'}");
            
            ResponseBuilder::json(
                ResponseBuilder::error(
                    'Payment verification failed',
                    'VERIFICATION_FAILED',
                    ['status' => $result['data']['status'] ?? 'failed']
                ),
                400
            );
        }
        
    } catch (\Exception $e) {
        error_log("Payment Verification Error: " . $e->getMessage());
        ResponseBuilder::json(
            ResponseBuilder::error($e->getMessage(), 'VERIFICATION_ERROR'),
            400
        );
    }
}

/**
 * Handle payment status check
 */
function handlePaymentStatus(array $input): void
{
    $txRef = $input['tx_ref'] ?? null;
    
    if (!$txRef) {
        ResponseBuilder::json(
            ResponseBuilder::error('Transaction reference required', 'MISSING_TX_REF'),
            400
        );
    }
    
    try {
        // Initialize Flutterwave client
        $client = new \Flutterwave\Flutterwave();
        $transaction = $client->getInstance()->Transactions;
        
        // Get transaction status
        $result = $transaction->getStatus($txRef);
        
        ResponseBuilder::json(
            ResponseBuilder::success(
                [
                    'tx_ref' => $txRef,
                    'status' => $result['data']['status'] ?? 'unknown',
                    'amount' => $result['data']['amount'] ?? 0,
                    'currency' => $result['data']['currency'] ?? 'NGN'
                ],
                'Status retrieved successfully'
            ),
            200
        );
        
    } catch (\Exception $e) {
        error_log("Status Check Error: " . $e->getMessage());
        ResponseBuilder::json(
            ResponseBuilder::error($e->getMessage(), 'STATUS_CHECK_ERROR'),
            400
        );
    }
}
?>
