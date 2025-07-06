'use client'

import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { AuroraBackground } from '@/components/ui/aurora-background' 

export default function AddTransactionPage() {
  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
    type: 'expense',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

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
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong')
      } else {
        router.push('/')
      }
    } catch {
      setError('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuroraBackground className="text-white"> {/* 👈 Aurora wrapper */}
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
              required
              className="bg-white/20 text-white placeholder-white/60 border-white/30"
            />
          </div>

          <div>
            <Label className="text-white">Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              className="bg-white/20 text-white placeholder-white/60 border-white/30"
            />
          </div>

          <div>
            <Label className="text-white">Date</Label>
            <Input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              className="bg-white/20 text-white border-white/30"
            />
          </div>

          <div>
            <Label className="text-white">Category</Label>
            <Input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="bg-white/20 text-white placeholder-white/60 border-white/30"
            />
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
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

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
  )
}
