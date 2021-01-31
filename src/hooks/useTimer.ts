import { useState, useEffect, useRef } from 'react'

export const useCurrentTime = () => {
  const [currentMillis, setCurrentMillis] = useState(new Date().getTime())

  useEffect(() => {
    const tick = () => {
      setCurrentMillis((prevMillis) => prevMillis + 1000)
    }

    const timerID = setInterval(() => tick(), 1000)

    return () => clearInterval(timerID)
  }, [])

  return currentMillis
}

export const useTimer = (initSecond) => {
  const [remine, setRemine] = useState(initSecond)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    let tid
    startTimeRef.current = Date.now()
    function update() {
      const now = Date.now()
      const cost = parseInt(`${(now - startTimeRef.current) / 1000}`, 10)
      if (initSecond - cost > 0) {
        tid = setTimeout(update, 500)
      }
      setRemine(Math.max(0, initSecond - cost))
    }
    update()

    return () => {
      clearTimeout(tid)
    }
  }, [initSecond])

  return remine
}

export default useCurrentTime
