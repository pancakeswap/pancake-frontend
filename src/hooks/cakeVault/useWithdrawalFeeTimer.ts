import { useEffect, useState } from 'react'

const useWithdrawalFeeTimer = (lastDepositedTime: number, withdrawalFeePeriod = 259200) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const [hasUnstakingFee, setHasUnstakingFee] = useState(false)

  useEffect(() => {
    const threeDaysFromDeposit = lastDepositedTime + withdrawalFeePeriod
    const now = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = threeDaysFromDeposit - now
    const doesUnstakingFeeApply = secondsRemainingCalc > 0
    if (doesUnstakingFeeApply) {
      setSecondsRemaining(secondsRemainingCalc)
      setHasUnstakingFee(true)
    }
  }, [lastDepositedTime, withdrawalFeePeriod, setSecondsRemaining])

  return { hasUnstakingFee, secondsRemaining }
}

export default useWithdrawalFeeTimer
