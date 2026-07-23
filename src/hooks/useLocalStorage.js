import { useState } from 'react'

// Persist small pieces of UI state (like theme) to localStorage.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = (newValue) => {
    setValue(newValue)
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue))
    } catch {
      // ignore write errors (e.g. private browsing)
    }
  }

  return [value, setStoredValue]
}
