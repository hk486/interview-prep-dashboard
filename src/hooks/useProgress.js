import { useState } from 'react'

export function useProgress(storageKey) {
  const [completed, setCompleted] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch {
      return new Set()
    }
  })

  const toggle = (id) => {
    setCompleted((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      localStorage.setItem(storageKey, JSON.stringify([...next]))
      return next
    })
  }

  const reset = () => {
    localStorage.removeItem(storageKey)
    setCompleted(new Set())
  }

  return { completed, toggle, reset }
}
