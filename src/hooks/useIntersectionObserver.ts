import { useEffect, useRef, useState } from 'react'

const useIntersectionObserver = () => {
  const observerRef = useRef<HTMLDivElement>(null)
  const intersectionObserverRef = useRef<IntersectionObserver>(null)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const checkObserverIsIntersecting = ([entry]: IntersectionObserverEntry[]) => {
      setIsIntersecting(entry.isIntersecting)
    }

    if (!observerIsSet) {
      intersectionObserverRef.current = new IntersectionObserver(checkObserverIsIntersecting, {
        rootMargin: '0px',
        threshold: 1,
      })
      intersectionObserverRef.current.observe(observerRef.current)
      setObserverIsSet(true)
    }

    return () => {
      if (intersectionObserverRef.current && observerIsSet) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [observerIsSet])

  return { observerRef, isIntersecting }
}

export default useIntersectionObserver
