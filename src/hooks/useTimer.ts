import { useState, useEffect, useRef } from 'react'

const useInterval = (callback, delay) => {
  const savedCallback = useRef(null)

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    const id = setInterval(tick, delay)
    return () => clearInterval(id)
  }, [delay])
}

export const useCurrentTime = () => {
  const [currentMillis, setCurrentMillis] = useState(new Date().getTime())

  useInterval(() => {
    setCurrentMillis(currentMillis + 1000)
  }, 1000)

  return currentMillis
}

export default useCurrentTime
