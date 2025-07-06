'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { AuroraBackground } from '@/components/ui/aurora-background';

export default function AddTransactionPage() {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
    type: 'expense',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      newErrors.amount = 'Amount must be a number greater than 0';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (form.description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    }

    if (!form.date) {
      newErrors.date = 'Date is required';
    }

    if (!form.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!['income', 'expense'].includes(form.type)) {
      newErrors.type = 'Type must be income or expense';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          amount: parseFloat(form.amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || 'Something went wrong');
      } else {
        router.push('/');
      }
    } catch {
      setSubmitError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuroraBackground className="text-white">
      <div className="relative z-10 w-full max-w-xl mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Add Transaction</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label className="text-white">Amount</Label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              value={form.amount}
              onChange={handleChange}
              className="bg-white/20 text-white placeholder-white/60 border-white/30"
            />
            {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
          </div>

          <div>
            <Label className="text-white">Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              className="bg-white/20 text-white placeholder-white/60 border-white/30"
            />
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label className="text-white">Date</Label>
            <Input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              className="bg-white/20 text-white border-white/30"
            />
            {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
          </div>

          <div>
            <Label className="text-white">Category</Label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="bg-white/20 text-white placeholder-white/60 border-white/30"
            />
            {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label className="text-white">Type</Label>
            <Select
              value={form.type}
              onValueChange={(value) => setForm({ ...form, type: value })}
            >
              <SelectTrigger className="bg-white/20 text-white border-white/30">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-white/20 text-white">
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
          </div>

          {submitError && (
            <p className="text-red-400 text-sm mt-2 text-center">{submitError}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </Button>
        </form>
      </div>
    </AuroraBackground>
  );
}
