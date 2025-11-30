'use client'

import { useState } from 'react'
import { getPromptTemplate, buildFullPrompt } from '@/lib/prompts'
import type { PromptConfig } from '@/lib/types'
import type { ExecutionOptions } from '@/lib/prompts'

const ROLES = [
  'Architect',
  'Engineer',
  'PHP Developer',
  'Laravel Developer',
  'Frontend Developer',
  'Backend Developer',
  'DevOps Engineer',
  'QA Engineer',
  'Project Manager',
]

const PROMPT_LANGUAGES = ['English', 'Polish']

const RESPONSE_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Russian',
  'Polish',
  'Chinese',
  'Japanese',
]

const MAX_TOKENS_OPTIONS = [
  { value: 1000, label: 'Short (1000 tokens)' },
  { value: 2000, label: 'Medium (2000 tokens)' },
  { value: 4000, label: 'Long (4000 tokens)' },
  { value: 8000, label: 'Very Long (8000 tokens)' },
]

const FOCUS_OPTIONS = [
  'Implementation',
  'Explanation',
  'Architecture',
  'Testing',
  'Performance',
  'Security',
]

interface ConfigFormProps {
  initialData?: PromptConfig
  onSubmit: (data: PromptConfig) => Promise<void>
  isLoading?: boolean
}

export default function ConfigForm({
  initialData,
  onSubmit,
  isLoading = false,
}: ConfigFormProps) {
  const defaultConfig: PromptConfig = {
    name: '',
    role: 'Engineer',
    prompt: '',
    prompt_language: 'English',
    response_language: 'English',
    max_tokens: 2000,
    focus: ['Explanation'],
    modify_files: false,
    plan_first: true,
    run_commands: false,
    make_commit: false,
    mention_ai: true,
  }

  // Generate initial prompt
  if (!defaultConfig.prompt) {
    defaultConfig.prompt = buildFullPrompt(defaultConfig.prompt_language, defaultConfig.role, {
      modify_files: defaultConfig.modify_files,
      plan_first: defaultConfig.plan_first,
      run_commands: defaultConfig.run_commands,
      make_commit: defaultConfig.make_commit,
      mention_ai: defaultConfig.mention_ai,
      focus: defaultConfig.focus,
      max_tokens: defaultConfig.max_tokens,
    })
  }

  const [formData, setFormData] = useState<PromptConfig>(initialData || defaultConfig)
  const [copied, setCopied] = useState(false)
  const [promptEdited, setPromptEdited] = useState(!!initialData?.prompt)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData((prev) => {
        const updated = { ...prev, [name]: checked }
        // Update prompt based on execution options if not manually edited
        if (!promptEdited) {
          updated.prompt = buildFullPrompt(prev.prompt_language, prev.role, {
            modify_files: name === 'modify_files' ? checked : prev.modify_files,
            plan_first: name === 'plan_first' ? checked : prev.plan_first,
            run_commands: name === 'run_commands' ? checked : prev.run_commands,
            make_commit: name === 'make_commit' ? checked : prev.make_commit,
            mention_ai: name === 'mention_ai' ? checked : prev.mention_ai,
            focus: prev.focus,
            max_tokens: prev.max_tokens,
          })
        }
        return updated
      })
    } else if (name === 'prompt') {
      // User is editing the prompt directly
      setFormData((prev) => ({ ...prev, [name]: value }))
      setPromptEdited(true)
    } else if (name === 'role' || name === 'prompt_language' || name === 'max_tokens') {
      // Auto-generate prompt based on role, language, or tokens
      setFormData((prev) => {
        const newRole = name === 'role' ? value : prev.role
        const newPromptLang = name === 'prompt_language' ? value : prev.prompt_language
        const newMaxTokens = name === 'max_tokens' ? parseInt(value) : prev.max_tokens
        const newPrompt = !promptEdited
          ? buildFullPrompt(newPromptLang, newRole, {
              modify_files: prev.modify_files,
              plan_first: prev.plan_first,
              run_commands: prev.run_commands,
              make_commit: prev.make_commit,
              mention_ai: prev.mention_ai,
              focus: prev.focus,
              max_tokens: newMaxTokens,
            })
          : prev.prompt
        return {
          ...prev,
          [name]: name === 'max_tokens' ? newMaxTokens : value,
          prompt: newPrompt,
        }
      })
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formData.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const generateDefaultPrompt = () => {
    const newPrompt = buildFullPrompt(formData.prompt_language, formData.role, {
      modify_files: formData.modify_files,
      plan_first: formData.plan_first,
      run_commands: formData.run_commands,
      make_commit: formData.make_commit,
      mention_ai: formData.mention_ai,
      focus: formData.focus,
      max_tokens: formData.max_tokens,
    })
    setFormData((prev) => ({ ...prev, prompt: newPrompt }))
    setPromptEdited(false)
  }

  const handleFocusChange = (focusItem: string) => {
    setFormData((prev) => {
      const newFocus = prev.focus.includes(focusItem)
        ? prev.focus.filter((f) => f !== focusItem)
        : [...prev.focus, focusItem]

      const newPrompt = !promptEdited
        ? buildFullPrompt(prev.prompt_language, prev.role, {
            modify_files: prev.modify_files,
            plan_first: prev.plan_first,
            run_commands: prev.run_commands,
            make_commit: prev.make_commit,
            mention_ai: prev.mention_ai,
            focus: newFocus,
            max_tokens: prev.max_tokens,
          })
        : prev.prompt

      return {
        ...prev,
        focus: newFocus,
        prompt: newPrompt,
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Configuration Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
          placeholder="e.g., PHP API Development"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            AI Agent Role *
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
          >
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prompt_language" className="block text-sm font-medium text-gray-700">
            Prompt Language *
          </label>
          <select
            id="prompt_language"
            name="prompt_language"
            value={formData.prompt_language}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
          >
            {PROMPT_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="response_language" className="block text-sm font-medium text-gray-700">
            Response Language *
          </label>
          <select
            id="response_language"
            name="response_language"
            value={formData.response_language}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
          >
            {RESPONSE_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700">
            Max Tokens *
          </label>
          <select
            id="max_tokens"
            name="max_tokens"
            value={formData.max_tokens}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
          >
            {MAX_TOKENS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Focus / Context *
        </label>
        <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
          {FOCUS_OPTIONS.map((focus) => (
            <div key={focus} className="flex items-center">
              <input
                type="checkbox"
                id={`focus-${focus}`}
                checked={formData.focus.includes(focus)}
                onChange={() => handleFocusChange(focus)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`focus-${focus}`} className="ml-3 text-sm text-gray-700">
                {focus}
              </label>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Select multiple focus areas. AI will address all selected concerns in the prompt.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
            Prompt *
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={generateDefaultPrompt}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset to Template
            </button>
            <button
              type="button"
              onClick={copyPromptToClipboard}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              {copied ? '✓ Copied!' : 'Copy Prompt'}
            </button>
          </div>
        </div>
        <textarea
          id="prompt"
          name="prompt"
          value={formData.prompt}
          onChange={handleChange}
          required
          rows={8}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2 font-mono text-sm"
          placeholder="Enter your custom prompt for the AI agent..."
        />
        <p className="mt-2 text-xs text-gray-500">
          Change the role to auto-update with a template. Edit freely to customize.
        </p>
      </div>

      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-900">Execution Options</h3>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="plan_first"
            name="plan_first"
            checked={formData.plan_first}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="plan_first" className="ml-3 text-sm text-gray-700">
            Plan first before modifying files
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="modify_files"
            name="modify_files"
            checked={formData.modify_files}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="modify_files" className="ml-3 text-sm text-gray-700">
            Allow modifying files
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="run_commands"
            name="run_commands"
            checked={formData.run_commands}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="run_commands" className="ml-3 text-sm text-gray-700">
            Allow running console commands
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="make_commit"
            name="make_commit"
            checked={formData.make_commit}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="make_commit" className="ml-3 text-sm text-gray-700">
            Make Git commits
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="mention_ai"
            name="mention_ai"
            checked={formData.mention_ai}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="mention_ai" className="ml-3 text-sm text-gray-700">
            Mention AI in commit messages
          </label>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium"
        >
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  )
}
