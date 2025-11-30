'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme from localStorage and system preference
  useEffect(() => {
    setMounted(true)

    // Get saved theme from localStorage
    const saved = localStorage.getItem('theme') as Theme | null
    const initialTheme = saved || 'system'
    setThemeState(initialTheme)

    // Determine actual theme to use
    const getActualTheme = (t: Theme): 'light' | 'dark' => {
      if (t === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return t
    }

    const actual = getActualTheme(initialTheme)
    setResolvedTheme(actual)
    applyTheme(actual)
  }, [])

  // Listen to system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light'
        setResolvedTheme(newTheme)
        applyTheme(newTheme)
      }

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const applyTheme = (actualTheme: 'light' | 'dark') => {
    const html = document.documentElement
    if (actualTheme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem('theme', newTheme)

    const getActualTheme = (t: Theme): 'light' | 'dark' => {
      if (t === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      }
      return t
    }

    const actual = getActualTheme(newTheme)
    setResolvedTheme(actual)
    applyTheme(actual)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return children
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
