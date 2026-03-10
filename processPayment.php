<?php

declare(strict_types=1);

/**
 * Flutterwave Payment Processor
 * 
 * This script handles payment processing through the Flutterwave SDK.
 * It manages both payment initiation and callback verification.
 */

require __DIR__ . '/vendor/autoload.php';

use Flutterwave\Controller\PaymentController;
use Flutterwave\EventHandlers\ModalEventHandler as PaymentHandler;
use Flutterwave\Flutterwave;
use Flutterwave\Library\Modal;

// Start session for tracking
session_start();

// Initialize controller variable
$controller = null;
$error = null;
$success = null;

try {
    /**
     * Bootstrap Flutterwave Configuration
     * This reads from .env file automatically
     */
    Flutterwave::bootstrap();
    
    // Initialize payment handler and client
    $customHandler = new PaymentHandler();
    $client = new Flutterwave();
    
    // Use STANDARD modal for better user experience
    $modalType = Modal::STANDARD; // Modal::STANDARD or Modal::POPUP
    
    // Create payment controller
    $controller = new PaymentController($client, $customHandler, $modalType);
    
} catch (\Exception $e) {
    $error = "Initialization Error: " . $e->getMessage();
    error_log("Flutterwave Initialization Failed: " . $e->getMessage());
}

/**
 * Handle Payment Form Submission
 */
if ($_SERVER["REQUEST_METHOD"] === "POST" && !isset($_GET['tx_ref'])) {
    if ($controller === null) {
        die($error);
    }
    
    try {
        // Collect request data
        $request = $_REQUEST;
        
        // Add redirect URL for callback
        $request['redirect_url'] = $_SERVER['HTTP_ORIGIN'] . $_SERVER['REQUEST_URI'];
        
        // Log payment attempt
        error_log("Payment Attempt: " . json_encode([
            'email' => $request['email'] ?? 'unknown',
            'amount' => $request['amount'] ?? '0',
            'currency' => $request['currency'] ?? 'NGN',
            'timestamp' => date('Y-m-d H:i:s')
        ]));
        
        // Process the payment
        $controller->process($request);
        
    } catch (\Exception $e) {
        $error = "Payment Processing Error: " . $e->getMessage();
        error_log("Payment Processing Failed: " . $e->getMessage());
    }
}

/**
 * Handle Payment Callback/Verification
 */
if (isset($_GET['tx_ref'])) {
    if ($controller === null) {
        die($error);
    }
    
    try {
        // Log callback received
        error_log("Payment Callback Received: " . $_GET['tx_ref']);
        
        // Verify the payment
        $controller->callback($_GET);
        
    } catch (\Exception $e) {
        $error = "Callback Processing Error: " . $e->getMessage();
        error_log("Callback Processing Failed: " . $e->getMessage());
    }
}

exit;

