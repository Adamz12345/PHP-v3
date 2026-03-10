'use client';

import { useState, FormEvent } from 'react';
import { initiatePaymentAction } from '@/app/actions/payment';

interface CheckoutFormProps {
  initialAmount?: number;
  currency?: string;
  description?: string;
}

interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export default function CheckoutForm({
  initialAmount = 5000,
  currency = 'NGN',
  description = 'Payment for your order',
}: CheckoutFormProps) {
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    amount: initialAmount,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      // Allow only numeric input with up to 2 decimal places
      const numValue = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        [name]: numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ isLoading: true, error: null, success: false });

    try {
      // Client-side validation
      if (!formData.fullName.trim()) {
        throw new Error('Full name is required');
      }

      if (!formData.email.includes('@')) {
        throw new Error('Valid email is required');
      }

      if (!formData.phoneNumber.trim()) {
        throw new Error('Phone number is required');
      }

      if (formData.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      console.log('[v0] Submitting payment form:', formData);

      // Call server action to initiate payment
      const result = await initiatePaymentAction(
        formData.email,
        formData.fullName,
        formData.phoneNumber,
        formData.amount,
        currency,
        description
      );

      if (!result.success) {
        throw new Error(result.error);
      }

      // Redirect to Flutterwave payment page
      if (result.data?.paymentLink) {
        console.log('[v0] Redirecting to payment link');
        window.location.href = result.data.paymentLink;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      console.error('[v0] Form submission error:', errorMessage);
      setFormState({
        isLoading: false,
        error: errorMessage,
        success: false,
      });
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Secure Payment
        </h1>
        <p className="text-gray-600 mb-8">{description}</p>

        {/* Error Message */}
        {formState.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{formState.error}</p>
          </div>
        )}

        {/* Success Message */}
        {formState.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              Payment initiated! Redirecting to payment page...
            </p>
          </div>
        )}

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
              disabled={formState.isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
              disabled={formState.isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="+234 800 000 0000"
              required
              disabled={formState.isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          {/* Amount */}
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-gray-500 text-lg">
                ₦
              </span>
              <input
                id="amount"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="5000"
                min="1"
                step="0.01"
                required
                disabled={formState.isLoading}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={formState.isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {formState.isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <span>Proceed to Payment</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L7.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414zm6 0a1 1 0 010-1.414l4-4a1 1 0 111.414 1.414L13.414 9l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs text-gray-600">
              Your payment information is secure and encrypted. We use industry-standard
              SSL/TLS encryption to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
