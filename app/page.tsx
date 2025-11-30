'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import ConfigList from '@/components/ConfigList'
import type { PromptConfig } from '@/lib/types'

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
})

export default function Home() {
  const [configs, setConfigs] = useState<PromptConfig[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const res = await fetch('/api/configs')
      const data = await res.json()
      setConfigs(data)
    } catch (error) {
      console.error('Failed to fetch configs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/configs/${id}`, { method: 'DELETE' })
      setConfigs(configs.filter((c) => c.id !== id))
    } catch (error) {
      console.error('Failed to delete config:', error)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AI Prompter
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure and manage AI agent prompts and execution settings
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <ThemeToggle />
            <Link
              href="/create"
              className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 font-medium transition-colors"
            >
              + New Configuration
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Loading configurations...
            </p>
          </div>
        ) : (
          <ConfigList configs={configs} onDelete={handleDelete} />
        )}
      </div>
    </main>
  )
}
