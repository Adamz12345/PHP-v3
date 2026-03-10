<?php

/**
 * Flutterwave Webhook Handler
 * 
 * This file handles webhook callbacks from Flutterwave.
 * Configure this URL in your Flutterwave dashboard under Settings > Webhooks.
 */

declare(strict_types=1);

require __DIR__ . '/../vendor/autoload.php';

use Flutterwave\Flutterwave;

// Set JSON response header
header('Content-Type: application/json');

// Log all webhook requests
$webhookData = file_get_contents('php://input');
error_log("Webhook Received: " . $webhookData);

try {
    // Get webhook data
    $data = json_decode($webhookData, true);
    
    if ($data === null) {
        throw new \Exception('Invalid JSON in webhook request');
    }
    
    // Verify webhook signature (optional but recommended)
    $signature = $_SERVER['HTTP_VERYHASH'] ?? '';
    $secretKey = $_ENV['FLW_SECRET_KEY'] ?? '';
    
    // Calculate expected signature
    $hash = hash_hmac('sha256', $webhookData, $secretKey);
    
    if ($signature && $hash !== $signature) {
        error_log("Webhook signature verification failed");
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Unauthorized']);
        exit;
    }
    
    // Log webhook event
    error_log("Webhook Event: " . ($data['event'] ?? 'unknown'));
    
    // Handle different event types
    switch ($data['event'] ?? '') {
        case 'charge.completed':
            handleChargeCompleted($data);
            break;
            
        case 'charge.failed':
            handleChargeFailed($data);
            break;
            
        case 'transfer.completed':
            handleTransferCompleted($data);
            break;
            
        case 'transfer.failed':
            handleTransferFailed($data);
            break;
            
        default:
            error_log("Unknown webhook event: " . ($data['event'] ?? 'none'));
            break;
    }
    
    // Always respond with 200 to acknowledge receipt
    http_response_code(200);
    echo json_encode(['status' => 'ok']);
    
} catch (\Exception $e) {
    error_log("Webhook Processing Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

exit;

/**
 * Handle successful payment
 */
function handleChargeCompleted(array $webhook): void
{
    $data = $webhook['data'] ?? [];
    
    error_log("Payment Completed: TX_REF={$data['tx_ref']}, Amount={$data['amount']}, Status={$data['status']}");
    
    // Only process successful payments
    if ($data['status'] !== 'successful') {
        error_log("Payment not successful: {$data['status']}");
        return;
    }
    
    // Extract payment details
    $txRef = $data['tx_ref'];
    $amount = $data['amount'] / 100; // Convert from kobo to naira
    $currency = $data['currency'];
    $customer_email = $data['customer']['email'] ?? '';
    $customer_name = $data['customer']['name'] ?? '';
    $reference = $data['reference'];
    
    // TODO: Implement your business logic here
    // 1. Verify amount matches expected amount
    // 2. Update order status in your database
    // 3. Send confirmation email to customer
    // 4. Trigger fulfillment process
    // 5. Log transaction for reconciliation
    
    error_log(
        "Payment Details: " . json_encode([
            'tx_ref' => $txRef,
            'reference' => $reference,
            'amount' => $amount,
            'currency' => $currency,
            'email' => $customer_email,
            'name' => $customer_name,
            'timestamp' => date('Y-m-d H:i:s')
        ])
    );
    
    // Example: Update order in database
    // $order = Order::where('tx_ref', $txRef)->first();
    // if ($order) {
    //     $order->status = 'paid';
    //     $order->reference = $reference;
    //     $order->save();
    //     
    //     // Send confirmation email
    //     Mail::send(new PaymentConfirmation($order));
    // }
}

/**
 * Handle failed payment
 */
function handleChargeFailed(array $webhook): void
{
    $data = $webhook['data'] ?? [];
    
    error_log("Payment Failed: TX_REF={$data['tx_ref']}, Reason={$data['reason'] ?? 'unknown'}");
    
    // Extract payment details
    $txRef = $data['tx_ref'];
    $reason = $data['reason'] ?? 'Unknown error';
    $customer_email = $data['customer']['email'] ?? '';
    
    // TODO: Implement your business logic here
    // 1. Update order status to failed
    // 2. Send failure notification to customer
    // 3. Allow customer to retry payment
    // 4. Log failed payment for reconciliation
    
    error_log(
        "Failed Payment Details: " . json_encode([
            'tx_ref' => $txRef,
            'reason' => $reason,
            'email' => $customer_email,
            'timestamp' => date('Y-m-d H:i:s')
        ])
    );
    
    // Example: Update order status
    // $order = Order::where('tx_ref', $txRef)->first();
    // if ($order) {
    //     $order->status = 'failed';
    //     $order->failure_reason = $reason;
    //     $order->save();
    //     
    //     // Send failure notification
    //     Mail::send(new PaymentFailed($order));
    // }
}

/**
 * Handle successful transfer/payout
 */
function handleTransferCompleted(array $webhook): void
{
    $data = $webhook['data'] ?? [];
    
    error_log("Transfer Completed: Reference={$data['reference']}, Amount={$data['amount']}");
    
    // TODO: Implement your business logic here
    // 1. Update payout status in database
    // 2. Log transfer completion
    // 3. Notify relevant parties
}

/**
 * Handle failed transfer/payout
 */
function handleTransferFailed(array $webhook): void
{
    $data = $webhook['data'] ?? [];
    
    error_log("Transfer Failed: Reference={$data['reference']}, Reason={$data['reason'] ?? 'unknown'}");
    
    // TODO: Implement your business logic here
    // 1. Update payout status to failed
    // 2. Log failure details
    // 3. Retry transfer or notify support
}
?>
