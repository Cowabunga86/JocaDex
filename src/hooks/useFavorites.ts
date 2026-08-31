import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'jocadex_favorites'

function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveFavorites(favs: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs))
  } catch {}
}

// Subscribers so multiple components sharing useFavorites stay in sync
const subscribers = new Set<() => void>()
let sharedFavorites: string[] = loadFavorites()

function notifyAll() {
  for (const fn of subscribers) fn()
}

export function useFavorites() {
  const [, rerender] = useState(0)

  useEffect(() => {
    const trigger = () => rerender(n => n + 1)
    subscribers.add(trigger)
    return () => { subscribers.delete(trigger) }
  }, [])

  const toggle = useCallback((name: string) => {
    const next = sharedFavorites.includes(name)
      ? sharedFavorites.filter(f => f !== name)
      : [...sharedFavorites, name]
    sharedFavorites = next
    saveFavorites(next)
    notifyAll()
  }, [])

  const isFavorite = useCallback((name: string) => sharedFavorites.includes(name), [])

  return { favorites: sharedFavorites, toggle, isFavorite }
}
