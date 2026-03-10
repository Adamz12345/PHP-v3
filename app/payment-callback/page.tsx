'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed' | 'pending'>('loading');
  const [transactionData, setTransactionData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const transactionId = searchParams.get('transaction_id');

        if (!transactionId) {
          setStatus('failed');
          setError('No transaction ID provided');
          return;
        }

        // Verify the transaction
        const response = await fetch(`/api/payments/verify?transaction_id=${transactionId}`);
        const data = await response.json();

        if (data.status === 'success') {
          const transaction = data.data;

          setTransactionData(transaction);

          if (transaction.status === 'successful') {
            setStatus('success');
          } else if (transaction.status === 'pending') {
            setStatus('pending');
          } else {
            setStatus('failed');
            setError(transaction.status || 'Payment failed');
          }
        } else {
          setStatus('failed');
          setError(data.error || 'Verification failed');
        }
      } catch (err: any) {
        console.error('[v0] Callback verification error:', err);
        setStatus('failed');
        setError(err.message || 'An error occurred during verification');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        {status === 'loading' && (
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Verifying Payment...</h2>
            <p className="text-gray-600 mt-2">Please wait while we verify your transaction</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="mb-4 text-5xl text-green-500">✓</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>

            {transactionData && (
              <div className="bg-gray-50 rounded p-4 text-left mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-semibold text-gray-700">Transaction ID:</span>
                  <span className="text-gray-600">{transactionData.id}</span>

                  <span className="font-semibold text-gray-700">Amount:</span>
                  <span className="text-gray-600">
                    ₦{transactionData.amount} {transactionData.currency}
                  </span>

                  <span className="font-semibold text-gray-700">Reference:</span>
                  <span className="text-gray-600">{transactionData.tx_ref}</span>

                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className="text-green-600 font-semibold">{transactionData.status}</span>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Back to Home
            </Link>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="mb-4 text-5xl text-red-500">✗</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-4">{error || 'An error occurred during payment processing.'}</p>

            {transactionData && (
              <div className="bg-gray-50 rounded p-4 text-left mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-semibold text-gray-700">Reference:</span>
                  <span className="text-gray-600">{transactionData.tx_ref}</span>

                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className="text-red-600 font-semibold">{transactionData.status}</span>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="inline-block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Try Again
            </Link>
          </div>
        )}

        {status === 'pending' && (
          <div className="text-center">
            <div className="mb-4 text-5xl text-yellow-500">⏳</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Pending</h2>
            <p className="text-gray-600 mb-4">Your payment is still being processed. Please check back later.</p>

            {transactionData && (
              <div className="bg-gray-50 rounded p-4 text-left mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="font-semibold text-gray-700">Reference:</span>
                  <span className="text-gray-600">{transactionData.tx_ref}</span>

                  <span className="font-semibold text-gray-700">Status:</span>
                  <span className="text-yellow-600 font-semibold">{transactionData.status}</span>
                </div>
              </div>
            )}

            <Link
              href="/"
              className="inline-block w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
            >
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
