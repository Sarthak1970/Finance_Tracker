'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type Transaction = {
  id: string;
  amount: number;
  date: string;
  type: string;
};

interface Props {
  transactions: Transaction[];
}

const MonthlyExpenseChart: React.FC<Props> = ({ transactions }) => {
  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce<Record<string, number>>((acc, curr) => {
      const category = curr.date.split('T')[0]; // daily or category-wise
      acc[category] = (acc[category] || 0) + curr.amount;
      return acc;
    }, {});

  const chartData = Object.entries(expensesByCategory).map(([label, value]) => ({
    label,
    value,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <XAxis dataKey="label" stroke="#fff" />
        <YAxis stroke="#fff" />
        <Tooltip />
        <Bar dataKey="value" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyExpenseChart;
