import { useEffect, useState } from 'react'

const useWithdrawalFeeTimer = (lastDepositedTime: number, withdrawalFeePeriod = 259200) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const [hasPerformanceFee, setHasPerformanceFee] = useState(false)

  useEffect(() => {
    const threeDaysFromDeposit = lastDepositedTime + withdrawalFeePeriod
    const now = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = threeDaysFromDeposit - now
    const doesPerformanceFeeApply = secondsRemainingCalc > 0
    if (doesPerformanceFeeApply) {
      setSecondsRemaining(secondsRemainingCalc)
      setHasPerformanceFee(true)
    }
  }, [lastDepositedTime, withdrawalFeePeriod, setSecondsRemaining])

  return { hasPerformanceFee, secondsRemaining }
}

export default useWithdrawalFeeTimer
