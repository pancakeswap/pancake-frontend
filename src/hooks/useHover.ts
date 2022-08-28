import { MutableRefObject, useEffect, useRef, useState } from 'react'

export function useHover<T>(): [MutableRefObject<T>, boolean] {
  const [value, setValue] = useState<boolean>(false)
  const ref: any = useRef<T | null>(null)

  useEffect(
    () => {
      const node = ref.current
      if (node) {
        node.addEventListener('mouseover', () => setValue(true))
        node.addEventListener('mouseout', () => setValue(false))
        return () => {
          node.removeEventListener('mouseover', () => setValue(false))
          node.removeEventListener('mouseout', () => setValue(true))
        }
      }
      return () => {
        //
      }
    },
    [], // Recall only if ref changes
  )
  return [ref, value]
}
