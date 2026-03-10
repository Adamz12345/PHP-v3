import Link from 'next/link';
import PaymentForm from '@/components/PaymentForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Flutterwave Payment Integration
          </h1>
          <p className="text-lg text-gray-600">
            A complete v0.dev-compatible Next.js implementation of the Flutterwave v3 SDK
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Features */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Features</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Payment Initiation</h3>
                    <p className="text-sm text-gray-600">Seamless payment gateway integration</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Transaction Verification</h3>
                    <p className="text-sm text-gray-600">Real-time payment status verification</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Webhook Handling</h3>
                    <p className="text-sm text-gray-600">Secure webhook signature verification</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Bank Transfers</h3>
                    <p className="text-sm text-gray-600">Alternative payment method support</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold text-xl">✓</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">Transaction History</h3>
                    <p className="text-sm text-gray-600">Complete transaction dashboard</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Links</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/transactions"
                  className="block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  View Transactions
                </Link>
                <Link
                  href="/documentation"
                  className="block text-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                >
                  Documentation
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Form */}
          <div className="flex justify-center items-start">
            <PaymentForm
              onSuccess={(data) => {
                console.log('[v0] Payment success:', data);
              }}
              onError={(error) => {
                console.error('[v0] Payment error:', error);
              }}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About This Implementation</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Technology Stack</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• Next.js 16</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
                <li>• Node.js API Routes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Environment Variables</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• FLUTTERWAVE_PUBLIC_KEY</li>
                <li>• FLUTTERWAVE_SECRET_KEY</li>
                <li>• NEXT_PUBLIC_APP_URL</li>
                <li>• NEXT_PUBLIC_LOGO_URL</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">API Endpoints</h3>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• POST /api/payments/initiate</li>
                <li>• GET/POST /api/payments/verify</li>
                <li>• POST /api/payments/webhook</li>
                <li>• POST /api/payments/bank-transfer</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Setup Instructions</h2>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">1. Environment Variables</h3>
              <p className="text-gray-600 mb-2">Add these to your .env.local file:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
                {`FLUTTERWAVE_PUBLIC_KEY=your_public_key_here
FLUTTERWAVE_SECRET_KEY=your_secret_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_LOGO_URL=https://your-logo-url.png`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">2. Deploy</h3>
              <p className="text-gray-600">
                Use the shadcn CLI or deploy directly to Vercel:
              </p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm mt-2">
                {`npm run build
npm start`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2">3. Configure Webhook</h3>
              <p className="text-gray-600">
                In Flutterwave Dashboard → Settings → Webhooks, set:
              </p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm mt-2">
                {`https://your-domain.com/api/payments/webhook`}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600 py-8 border-t border-gray-300">
          <p>
            Flutterwave v3 SDK - Next.js Implementation |{' '}
            <a
              href="https://developer.flutterwave.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Official Documentation
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
