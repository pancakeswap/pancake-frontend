import { useEffect, useState } from 'react'

export function useHover<T>(): [(value: T) => void, boolean] {
  const [value, setValue] = useState<boolean>(false)
  const [ref, setRef] = useState<T | null>(null)

  useEffect(() => {
    const node = ref as any
    if (node) {
      node.addEventListener('mouseover', () => setValue(true))
      node.addEventListener('mouseout', () => setValue(false))
      return () => {
        node.removeEventListener('mouseover', () => setValue(false))
        node.removeEventListener('mouseout', () => setValue(true))
      }
    }
    return undefined
  }, [ref])
  return [setRef, value]
}
