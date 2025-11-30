'use client'

import Link from 'next/link'
import type { PromptConfig } from '@/lib/types'

interface ConfigListProps {
  configs: PromptConfig[]
  onDelete: (id: number) => Promise<void>
}

export default function ConfigList({ configs, onDelete }: ConfigListProps) {
  return (
    <div className="space-y-3">
      {configs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No configurations yet. Create one to get started!
        </p>
      ) : (
        configs.map((config) => (
          <div
            key={config.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">
                  {config.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Role: <span className="font-medium">{config.role}</span> •
                  Language: <span className="font-medium">{config.prompt_language}</span> •
                  Focus: <span className="font-medium">{config.focus}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Response: <span className="font-medium">{config.response_language}</span> •
                  Max Tokens: <span className="font-medium">{config.max_tokens}</span>
                </p>
                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {config.prompt}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {config.plan_first && (
                    <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      Plan First
                    </span>
                  )}
                  {config.modify_files && (
                    <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                      Modify Files
                    </span>
                  )}
                  {config.run_commands && (
                    <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                      Run Commands
                    </span>
                  )}
                  {config.make_commit && (
                    <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                      Make Commits
                    </span>
                  )}
                  {config.mention_ai && (
                    <span className="inline-block px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">
                      Mention AI
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Link
                  href={`/edit/${config.id}`}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm('Are you sure?')) {
                      onDelete(config.id!)
                    }
                  }}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
