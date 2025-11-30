'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import ConfigForm from '@/components/ConfigForm'
import type { PromptConfig } from '@/lib/types'

export default function CreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (formData: PromptConfig) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/')
      } else {
        alert('Failed to create configuration')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">New Configuration</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to list
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ConfigForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </main>
  )
}
