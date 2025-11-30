'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PromptConfig } from '@/lib/types'

interface ConfigListProps {
  configs: PromptConfig[]
  onDelete: (id: number) => Promise<void>
}

export default function ConfigList({ configs, onDelete }: ConfigListProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptConfig | null>(null)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <>
      <div className="space-y-3">
        {configs.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No configurations yet. Create one to get started!
          </p>
        ) : (
          configs.map((config) => (
            <div
              key={config.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4 hover:shadow-md dark:hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {config.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Role: <span className="font-medium">{config.role}</span> •
                    Language: <span className="font-medium">{config.prompt_language}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Focus: <span className="font-medium">{config.focus.join(', ')}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Response: <span className="font-medium">{config.response_language}</span> •
                    Max Tokens: <span className="font-medium">{config.max_tokens}</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                    {config.prompt}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {config.plan_first && (
                      <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                        Plan First
                      </span>
                    )}
                    {config.modify_files && (
                      <span className="inline-block px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded">
                        Modify Files
                      </span>
                    )}
                    {config.run_commands && (
                      <span className="inline-block px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded">
                        Run Commands
                      </span>
                    )}
                    {config.make_commit && (
                      <span className="inline-block px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                        Make Commits
                      </span>
                    )}
                    {config.mention_ai && (
                      <span className="inline-block px-2 py-1 text-xs bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 rounded">
                        Mention AI
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => copyToClipboard(config.prompt)}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 text-sm font-medium whitespace-nowrap transition-colors"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={() => setSelectedPrompt(config)}
                    className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 rounded hover:bg-purple-200 dark:hover:bg-purple-800 text-sm font-medium whitespace-nowrap transition-colors"
                  >
                    View Full
                  </button>
                  <Link
                    href={`/edit/${config.id}`}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-sm font-medium text-center transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure?')) {
                        onDelete(config.id!)
                      }
                    }}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for viewing full prompt */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedPrompt.name}
              </h2>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-2xl leading-none transition-colors"
              >
                ×
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Role: <span className="font-medium">{selectedPrompt.role}</span> •
                Language: <span className="font-medium">{selectedPrompt.prompt_language}</span>
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
                {selectedPrompt.prompt}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
              <button
                onClick={() => {
                  copyToClipboard(selectedPrompt.prompt)
                }}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800 font-medium transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy Prompt'}
              </button>
              <button
                onClick={() => setSelectedPrompt(null)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
