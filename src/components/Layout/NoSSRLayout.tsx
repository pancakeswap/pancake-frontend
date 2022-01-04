import { useState, useEffect } from 'react'

export function NoSSRLayout(page) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return page
}
