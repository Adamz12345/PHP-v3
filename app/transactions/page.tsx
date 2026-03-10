'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Transaction {
  id: string;
  tx_ref: string;
  amount: number;
  currency: string;
  status: string;
  customer: {
    email: string;
    name: string;
  };
  created_at: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/payments/transactions');
        const data = await response.json();

        if (data.status === 'success') {
          setTransactions(data.data || []);
        } else {
          setError(data.error || 'Failed to load transactions');
        }
      } catch (err: any) {
        console.error('[v0] Fetch transactions error:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Transactions</h1>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            New Payment
          </Link>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading transactions...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && transactions.length === 0 && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-600">No transactions found</p>
          </div>
        )}

        {!loading && transactions.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Reference</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{tx.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-mono">{tx.tx_ref}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₦{Number(tx.amount).toLocaleString()} {tx.currency}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900">{tx.customer?.name || 'N/A'}</div>
                      <div className="text-gray-500 text-xs">{tx.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
