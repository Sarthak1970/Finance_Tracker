'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { motion } from 'framer-motion';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';

type Transaction = {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: string;
  type: string;
  created_at: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [month, setMonth] = useState<string>('07');
  const [year, setYear] = useState<string>('2025');
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://finance-tracker-backend-ucrl.onrender.com/transactions?month=${month}&year=${year}`
      );
      const data = await res.json();

      if (data.message === 'No transactions found') {
        setTransactions([]);
        setErrorMsg('No transactions found');
      } else {
        setTransactions(data);
        setErrorMsg(null);
      }
    } catch {
      setErrorMsg('Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [month, year]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`https://finance-tracker-backend-ucrl.onrender.com/transactions?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTransactions();
      } else {
        alert('Delete failed');
      }
    } catch {
      alert('Error deleting transaction');
    }
  };

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1.0, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg p-6 w-full max-w-3xl text-white">
          <main className="max-w-3xl mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold mb-6 text-center text-white drop-shadow-lg">
              Personal Finance Dashboard
            </h1>

            {/* Filter Form */}
            <div className="flex gap-4 mb-6 py-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-white/20 text-white border border-white/30 p-2 rounded w-24"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const m = (i + 1).toString().padStart(2, '0');
                  return (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  );
                })}
              </select>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="Year"
                className="bg-white/20 text-white border border-white/30 p-2 rounded w-24 placeholder-white/70"
              />
              <button
                onClick={fetchTransactions}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
              >
                Fetch
              </button>
              <Link
                href="/add"
                className="ml-auto bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
              >
                + Add Transaction
              </Link>
            </div>

            {/* Monthly Chart */}
            <div className="mt-8 mb-12 bg-white/5 backdrop-blur border border-white/20 rounded p-4 shadow">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Monthly Expense Chart
              </h2>
              <MonthlyExpenseChart transactions={transactions} />
            </div>

            {/* Transactions List */}
            {loading ? (
              <p className="text-white/80">Loading...</p>
            ) : errorMsg ? (
              <p className="text-red-400">{errorMsg}</p>
            ) : (
              <div className="space-y-4">
                {transactions.map((txn) => (
                  <motion.div
                    key={txn.id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur border border-white/20 rounded p-4 flex justify-between items-center shadow"
                  >
                    <div>
                      <p className="text-lg font-semibold text-white">
                        {txn.description}
                      </p>
                      <p className="text-sm text-white/70">
                        {txn.category} • {txn.type} • {txn.date.split('T')[0]}
                      </p>
                      <p className="text-blue-300 font-bold">₹ {txn.amount}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/update/${txn.id}`}
                        className="text-yellow-400 border border-yellow-400 px-3 py-1 rounded hover:bg-yellow-400/20"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => handleDelete(txn.id)}
                        className="text-red-400 border border-red-400 px-3 py-1 rounded hover:bg-red-400/20"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </main>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
