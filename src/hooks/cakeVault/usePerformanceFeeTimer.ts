import { useEffect, useState } from 'react'

const usePerformanceFeeTimer = (lastDepositedTime: number) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const [hasPerformanceFee, setHasPerformanceFee] = useState(false)

  useEffect(() => {
    const threeDaysFromDeposit = lastDepositedTime + 259200
    const now = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = threeDaysFromDeposit - now
    const doesPerformanceFeeApply = secondsRemainingCalc > 0
    if (doesPerformanceFeeApply) {
      setSecondsRemaining(secondsRemainingCalc)
      setHasPerformanceFee(true)
    }
  }, [lastDepositedTime, setSecondsRemaining])

  return { hasPerformanceFee, secondsRemaining }
}

export default usePerformanceFeeTimer
