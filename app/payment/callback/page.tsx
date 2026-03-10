'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { verifyPaymentAction } from '@/app/actions/payment';

interface PaymentResult {
  transactionRef: string;
  status: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
}

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyTransaction = async () => {
      try {
        // Get transaction ID from URL params
        const transactionId = searchParams.get('transaction_id');

        if (!transactionId) {
          throw new Error('No transaction ID provided');
        }

        console.log('[v0] Verifying transaction:', transactionId);

        // Verify payment with server action
        const result = await verifyPaymentAction(transactionId);

        if (!result.success) {
          throw new Error(result.error);
        }

        setPaymentResult(result.data as PaymentResult);
        console.log('[v0] Payment verified:', result.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Verification failed';
        console.error('[v0] Verification error:', errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verifyTransaction();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-lg text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Verification Failed
          </h1>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Checkout
          </a>
        </div>
      </div>
    );
  }

  const isSuccessful = paymentResult?.status === 'completed';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Success Icon */}
        <div
          className={`flex items-center justify-center w-16 h-16 mx-auto rounded-full mb-6 ${
            isSuccessful ? 'bg-green-100' : 'bg-yellow-100'
          }`}
        >
          {isSuccessful ? (
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        {/* Status */}
        <h1
          className={`text-2xl font-bold text-center mb-2 ${
            isSuccessful ? 'text-green-600' : 'text-yellow-600'
          }`}
        >
          {isSuccessful ? 'Payment Successful' : 'Payment Pending'}
        </h1>

        <p className="text-center text-gray-600 mb-6">
          {isSuccessful
            ? 'Your payment has been processed successfully.'
            : 'Your payment is being processed. You will receive a confirmation email shortly.'}
        </p>

        {/* Transaction Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Transaction Reference:</span>
            <span className="font-mono text-gray-900">
              {paymentResult?.transactionRef}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Amount:</span>
            <span className="font-semibold text-gray-900">
              {paymentResult?.currency} {paymentResult?.amount}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Customer:</span>
            <span className="text-gray-900">{paymentResult?.customerName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Email:</span>
            <span className="text-gray-900">{paymentResult?.customerEmail}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span
              className={`font-semibold ${
                isSuccessful ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {paymentResult?.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href="/"
            className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Back to Home
          </a>
          <button
            onClick={() => {
              if (paymentResult?.transactionRef) {
                navigator.clipboard.writeText(paymentResult.transactionRef);
                alert('Transaction reference copied to clipboard');
              }
            }}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Copy Transaction Reference
          </button>
        </div>

        {/* Support Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-600 text-center">
            Need help? Contact our support team at{' '}
            <a
              href="mailto:support@example.com"
              className="text-purple-600 hover:underline"
            >
              support@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-300 border-t-purple-600 rounded-full animate-spin" />
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
