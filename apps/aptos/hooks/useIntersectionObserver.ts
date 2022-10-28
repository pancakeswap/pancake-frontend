import { useRef, useState } from 'react'
import { useIsomorphicEffect } from '@pancakeswap/uikit'

const useIntersectionObserver = () => {
  const [observerRefElement, setObserverRefElement] = useState<HTMLElement | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useIsomorphicEffect(() => {
    const isSupported = typeof window === 'object' && window.IntersectionObserver

    if (isSupported) {
      if (!intersectionObserverRef.current && observerRefElement) {
        const checkObserverIsIntersecting = ([entry]: IntersectionObserverEntry[]) => {
          setIsIntersecting(entry.isIntersecting)
        }

        // @ts-ignore
        intersectionObserverRef.current = new window.IntersectionObserver(checkObserverIsIntersecting, {
          rootMargin: '0px',
          threshold: 1,
        })
        intersectionObserverRef.current.observe(observerRefElement)
      }

      if (intersectionObserverRef.current && !observerRefElement) {
        intersectionObserverRef.current.disconnect()
        setIsIntersecting(false)
      }
    } else {
      // If client doesn't support IntersectionObserver, set Intersecting to be true
      setIsIntersecting(true)
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [observerRefElement])

  return { observerRef: setObserverRefElement, isIntersecting }
}

export default useIntersectionObserver
