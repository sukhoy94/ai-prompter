'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ConfigForm from '@/components/ConfigForm'
import type { PromptConfig } from '@/lib/types'

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [config, setConfig] = useState<PromptConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/configs/${id}`)
        if (res.ok) {
          const data = await res.json()
          setConfig(data)
        } else {
          alert('Configuration not found')
          router.push('/')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Failed to load configuration')
        router.push('/')
      } finally {
        setIsLoadingData(false)
      }
    }
    fetchData()
  }, [id, router])

  const handleSubmit = async (formData: PromptConfig) => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/configs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/')
      } else {
        alert('Failed to update configuration')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    )
  }

  if (!config) {
    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Configuration</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← Back to list
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <ConfigForm
            initialData={config}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  )
}
