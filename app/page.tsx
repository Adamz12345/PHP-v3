import CheckoutForm from '@/components/CheckoutForm';

export const metadata = {
  title: 'Checkout - Flutterwave Payment',
  description: 'Complete your secure payment with Flutterwave',
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Your Payment
          </h1>
          <p className="text-lg text-gray-600">
            Secure, fast, and reliable payment processing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <CheckoutForm
              initialAmount={5000}
              currency="NGN"
              description="Payment for your order"
            />
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Security Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Security
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>256-bit SSL encryption</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>PCI DSS compliant</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Server-side validation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Fraud protection</span>
                </li>
              </ul>
            </div>

            {/* Supported Payment Methods */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm12 4a2 2 0 102 2 2 2 0 00-2-2z" />
                </svg>
                Payment Methods
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Credit/Debit Cards</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Mobile Money</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Bank Transfers</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Digital Wallets</span>
                </li>
              </ul>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 17v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.381z"
                    clipRule="evenodd"
                  />
                </svg>
                Why Flutterwave?
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span>⚡</span>
                  <span>Instant processing</span>
                </li>
                <li className="flex gap-2">
                  <span>🌍</span>
                  <span>Multi-currency support</span>
                </li>
                <li className="flex gap-2">
                  <span>✉️</span>
                  <span>Email confirmation</span>
                </li>
                <li className="flex gap-2">
                  <span>📊</span>
                  <span>Real-time updates</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
