import { useEffect, useRef, useState } from 'react'

const useIntersectionObserver = () => {
  const observerRef = useRef<HTMLDivElement>(null)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const checkObserverIsIntersecting = ([entry]: IntersectionObserverEntry[]) => {
      setIsIntersecting(entry.isIntersecting)
    }

    if (!observerIsSet) {
      const intersectionObserver = new IntersectionObserver(checkObserverIsIntersecting, {
        rootMargin: '0px',
        threshold: 1,
      })
      intersectionObserver.observe(observerRef.current)
      setObserverIsSet(true)
    }
  }, [observerIsSet])

  return { observerRef, isIntersecting }
}

export default useIntersectionObserver
