import { useEffect, useRef, useState } from 'react'

const useIntersectionObserver = () => {
  const [observerRefElement, setObserverRefElement] = useState(null)
  const [observerRef] = useState(() => (element) => setObserverRefElement(element))
  const intersectionObserverRef = useRef<IntersectionObserver>(null)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const checkObserverIsIntersecting = ([entry]: IntersectionObserverEntry[]) => {
      setIsIntersecting(entry.isIntersecting)
    }

    if (!observerIsSet && observerRefElement) {
      intersectionObserverRef.current = new IntersectionObserver(checkObserverIsIntersecting, {
        rootMargin: '0px',
        threshold: 1,
      })
      intersectionObserverRef.current.observe(observerRefElement)
      setObserverIsSet(true)
    }

    return () => {
      if (intersectionObserverRef.current && observerIsSet) {
        intersectionObserverRef.current.disconnect()
      }
    }
  }, [observerRefElement, observerIsSet])

  return { observerRef, isIntersecting }
}

export default useIntersectionObserver
