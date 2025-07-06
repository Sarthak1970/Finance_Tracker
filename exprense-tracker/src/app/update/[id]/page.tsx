'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function UpdateTransactionPage() {
  const params = useParams()
  const id = params?.id as string
  const router = useRouter()

  const [form, setForm] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
    type: 'expense',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await fetch(`http://localhost:8080/transactions/${id}`)
        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Failed to load')

        setForm({
          amount: data.amount.toString(),
          description: data.description,
          date: data.date.split('T')[0],
          category: data.category,
          type: data.type,
        })
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Something went wrong')
        } else {
          setError('Something went wrong')
        }
      }
    }

    fetchTransaction()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`http://localhost:8080/transactions?id=${id}`, {
        method: 'PUT',
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
        setError(data.message || 'Update failed')
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
    <div className="max-w-xl mx-auto p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Update Transaction</h1>

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

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? 'Updating...' : 'Update Transaction'}
        </Button>
      </form>
    </div>
  )
}
