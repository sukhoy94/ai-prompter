'use client'

import { useTheme } from '@/lib/theme-context'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeLabel = () => {
    switch (theme) {
      case 'light':
        return '☀️ Light'
      case 'dark':
        return '🌙 Dark'
      case 'system':
        return '⚙️ System'
      default:
        return 'Theme'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={`Current: ${theme} | Click to cycle themes`}
    >
      {getThemeLabel()}
    </button>
  )
}
