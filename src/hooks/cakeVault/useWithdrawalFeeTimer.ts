import BigNumber from 'bignumber.js'
import { useEffect, useState } from 'react'

const useWithdrawalFeeTimer = (lastDepositedTime: number, userShares: BigNumber, withdrawalFeePeriod = 259200) => {
  const [secondsRemaining, setSecondsRemaining] = useState(null)
  const [hasUnstakingFee, setHasUnstakingFee] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(Math.floor(Date.now() / 1000))

  useEffect(() => {
    const feeEndTime = lastDepositedTime + withdrawalFeePeriod
    const secondsRemainingCalc = feeEndTime - currentSeconds
    const doesUnstakingFeeApply = userShares.gt(0) && secondsRemainingCalc > 0

    const tick = () => {
      setCurrentSeconds((prevSeconds) => prevSeconds + 1)
    }
    const timerInterval = setInterval(() => tick(), 1000)
    if (doesUnstakingFeeApply) {
      setSecondsRemaining(secondsRemainingCalc)
      setHasUnstakingFee(true)
    } else {
      setHasUnstakingFee(false)
      clearInterval(timerInterval)
    }

    return () => clearInterval(timerInterval)
  }, [lastDepositedTime, withdrawalFeePeriod, setSecondsRemaining, currentSeconds, userShares])

  return { hasUnstakingFee, secondsRemaining }
}

export default useWithdrawalFeeTimer
