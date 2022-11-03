import { useEffect, useLayoutEffect, useState, useRef } from 'react'

export const useIsomorphicEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const useIntersectionObserver = () => {
  const [observerRefElement, setObserverRefElement] = useState<HTMLElement | null>(null)
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useIsomorphicEffect(() => {
    const isSupported = typeof window === 'object' && window.IntersectionObserver

    if (isSupported) {
      if (!intersectionObserverRef.current && observerRefElement) {
        const checkObserverIsIntersecting = ([entry]: IntersectionObserverEntry[]) => {
          setIsIntersecting(entry.isIntersecting)
        }

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
      // If client doesnt support IntersectionObserver, set Intersecting to be true
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
