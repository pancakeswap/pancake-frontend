import { useEffect, useRef, useState } from 'react'

const useIntersectionObserver = () => {
  const [observerRefElement, setObserverRefElement] = useState(null)
  const observerRef = useRef((element) => setObserverRefElement(element))
  const intersectionObserverRef = useRef<IntersectionObserver>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!intersectionObserverRef.current && observerRefElement) {
      const checkObserverIsIntersecting = ([entry]: IntersectionObserverEntry[]) => {
        setIsIntersecting(entry.isIntersecting)
      }

      intersectionObserverRef.current = new IntersectionObserver(checkObserverIsIntersecting, {
        rootMargin: '0px',
        threshold: 1,
      })
      intersectionObserverRef.current.observe(observerRefElement)
    }

    if (intersectionObserverRef.current && !observerRefElement) {
      intersectionObserverRef.current.disconnect()
      setIsIntersecting(false)
    }

    return () => {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [observerRefElement])

  return { observerRef: observerRef.current, isIntersecting }
}

export default useIntersectionObserver
