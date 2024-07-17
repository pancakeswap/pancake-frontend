import { useEffect, useLayoutEffect, useState, useRef } from 'react'

export const useIsomorphicEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

interface IIntersectionProps {
  rootMargin?: string
  threshold?: number | number[]
}
const useIntersectionObserver = ({ rootMargin = '0px', threshold = 1 }: IIntersectionProps = {}) => {
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
          rootMargin,
          threshold,
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
        intersectionObserverRef.current = null
      }
    }
  }, [observerRefElement])

  return { observerRef: setObserverRefElement, isIntersecting }
}

export default useIntersectionObserver
