<?php

/**
 * Payment Validation & Error Handling Helper
 * 
 * This class provides utilities for validating payment data and handling errors.
 */

namespace Flutterwave\Helper;

class PaymentValidator
{
    /**
     * Validate payment request data
     * 
     * @param array $data Payment request data
     * @return array Array with 'valid' boolean and 'errors' array
     */
    public static function validate(array $data): array
    {
        $errors = [];
        
        // Validate amount
        if (empty($data['amount'])) {
            $errors[] = 'Amount is required';
        } elseif (!is_numeric($data['amount']) || $data['amount'] <= 0) {
            $errors[] = 'Amount must be a positive number';
        }
        
        // Validate currency
        if (empty($data['currency'])) {
            $errors[] = 'Currency is required';
        } elseif (!self::isValidCurrency($data['currency'])) {
            $errors[] = 'Invalid currency code: ' . $data['currency'];
        }
        
        // Validate email
        if (empty($data['email'])) {
            $errors[] = 'Email address is required';
        } elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email address format';
        }
        
        // Validate first name
        if (empty($data['first_name'])) {
            $errors[] = 'First name is required';
        } elseif (strlen($data['first_name']) < 2) {
            $errors[] = 'First name must be at least 2 characters';
        }
        
        // Validate last name
        if (empty($data['last_name'])) {
            $errors[] = 'Last name is required';
        } elseif (strlen($data['last_name']) < 2) {
            $errors[] = 'Last name must be at least 2 characters';
        }
        
        // Validate description
        if (empty($data['description'])) {
            $errors[] = 'Transaction description is required';
        } elseif (strlen($data['description']) < 3) {
            $errors[] = 'Description must be at least 3 characters';
        }
        
        // Validate phone number if provided
        if (!empty($data['phone_number'])) {
            if (!self::isValidPhoneNumber($data['phone_number'])) {
                $errors[] = 'Invalid phone number format';
            }
        }
        
        return [
            'valid' => count($errors) === 0,
            'errors' => $errors
        ];
    }
    
    /**
     * Check if currency code is valid
     * 
     * @param string $currency Currency code
     * @return bool
     */
    public static function isValidCurrency(string $currency): bool
    {
        $validCurrencies = [
            'NGN', 'GHS', 'KES', 'USD', 'ZAR', 'TZS', 'UGX', 'XOF', 'CFA'
        ];
        
        return in_array(strtoupper($currency), $validCurrencies);
    }
    
    /**
     * Check if phone number format is valid
     * 
     * @param string $phone Phone number
     * @return bool
     */
    public static function isValidPhoneNumber(string $phone): bool
    {
        // Remove common formatting characters
        $phone = preg_replace('/[^0-9+]/', '', $phone);
        
        // Phone number should be 10-15 digits with optional +
        return preg_match('/^\+?[0-9]{10,15}$/', $phone) === 1;
    }
    
    /**
     * Sanitize string input
     * 
     * @param string $input User input
     * @return string Sanitized string
     */
    public static function sanitizeString(string $input): string
    {
        // Remove any script tags
        $input = strip_tags($input);
        
        // Trim whitespace
        $input = trim($input);
        
        // HTML escape special characters
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
    
    /**
     * Sanitize email input
     * 
     * @param string $email Email address
     * @return string|false Sanitized email or false if invalid
     */
    public static function sanitizeEmail(string $email)
    {
        return filter_var(trim($email), FILTER_VALIDATE_EMAIL);
    }
    
    /**
     * Format amount for API
     * 
     * @param float $amount Amount
     * @return int Amount in smallest currency unit (e.g., kobo for NGN)
     */
    public static function formatAmount(float $amount): int
    {
        return (int) round($amount * 100);
    }
    
    /**
     * Generate unique transaction reference
     * 
     * @return string Unique transaction reference
     */
    public static function generateTxRef(): string
    {
        return 'TXREF_' . date('YmdHis') . '_' . uniqid() . '_' . random_int(1000, 9999);
    }
}

/**
 * Error Response Handler
 */
class ErrorHandler
{
    private static $errors = [];
    
    /**
     * Add an error message
     * 
     * @param string $code Error code
     * @param string $message Error message
     * @param string $severity 'info', 'warning', or 'error'
     */
    public static function addError(string $code, string $message, string $severity = 'error'): void
    {
        self::$errors[] = [
            'code' => $code,
            'message' => $message,
            'severity' => $severity,
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        error_log("[$severity] [$code] $message");
    }
    
    /**
     * Get all errors
     * 
     * @return array List of errors
     */
    public static function getErrors(): array
    {
        return self::$errors;
    }
    
    /**
     * Get errors as JSON
     * 
     * @return string JSON encoded errors
     */
    public static function getErrorsJson(): string
    {
        return json_encode(self::$errors, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }
    
    /**
     * Clear all errors
     */
    public static function clearErrors(): void
    {
        self::$errors = [];
    }
    
    /**
     * Check if there are any errors
     * 
     * @return bool
     */
    public static function hasErrors(): bool
    {
        return count(self::$errors) > 0;
    }
    
    /**
     * Handle API response errors
     * 
     * @param array $response API response
     * @return bool Whether response was successful
     */
    public static function handleApiResponse(array $response): bool
    {
        if ($response['status'] === 'error') {
            self::addError(
                $response['code'] ?? 'API_ERROR',
                $response['message'] ?? 'An error occurred',
                'error'
            );
            return false;
        }
        
        return true;
    }
    
    /**
     * Get user-friendly error message
     * 
     * @param string $code Error code
     * @return string User-friendly message
     */
    public static function getUserFriendlyMessage(string $code): string
    {
        $messages = [
            'VALIDATION_ERROR' => 'Please check your input and try again',
            'PAYMENT_FAILED' => 'Payment could not be processed. Please try again.',
            'NETWORK_ERROR' => 'Network connection error. Please check your internet and try again.',
            'AUTH_ERROR' => 'Authentication failed. Please contact support.',
            'API_ERROR' => 'An error occurred while processing your request. Please try again.',
            'INVALID_AMOUNT' => 'The amount entered is invalid. Please enter a positive number.',
            'INVALID_EMAIL' => 'Please enter a valid email address.',
            'INVALID_PHONE' => 'Please enter a valid phone number.',
        ];
        
        return $messages[$code] ?? 'An unexpected error occurred. Please try again.';
    }
}

/**
 * Response Builder
 */
class ResponseBuilder
{
    /**
     * Build success response
     * 
     * @param array $data Response data
     * @param string $message Success message
     * @return array
     */
    public static function success(array $data = [], string $message = 'Success'): array
    {
        return [
            'status' => 'success',
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Build error response
     * 
     * @param string $message Error message
     * @param string $code Error code
     * @param array $errors Additional error details
     * @return array
     */
    public static function error(string $message, string $code = 'ERROR', array $errors = []): array
    {
        return [
            'status' => 'error',
            'message' => $message,
            'code' => $code,
            'errors' => $errors,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Build JSON response and exit
     * 
     * @param array $response Response array
     * @param int $statusCode HTTP status code
     */
    public static function json(array $response, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
}
?>
