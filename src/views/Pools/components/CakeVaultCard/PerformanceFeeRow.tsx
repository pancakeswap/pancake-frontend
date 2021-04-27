import React, { useEffect, useState } from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import PerformanceFeeCountdown from './PerformanceFeeCountdown'

interface PerformanceFeeRowProps {
  performanceFee: number
  lastDepositedTime: string
}

const PerformanceFeeRow: React.FC<PerformanceFeeRowProps> = ({ performanceFee, lastDepositedTime }) => {
  const TranslateString = useI18n()
  const [secondsRemaining, setSecondsRemaining] = useState(null)

  useEffect(() => {
    const threeDaysFromDeposit = parseInt(lastDepositedTime) + 259200
    const now = Math.floor(Date.now() / 1000)
    const secondsRemainingCalc = threeDaysFromDeposit - now
    const doesPerformanceFeeApply = secondsRemainingCalc > 0
    if (doesPerformanceFeeApply) {
      setSecondsRemaining(secondsRemainingCalc)
    }
  }, [lastDepositedTime, setSecondsRemaining])

  return (
    <Flex mt="8px" alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">
        {performanceFee / 1000 || '-'}% {TranslateString(999, 'unstaking fee')}{' '}
        {lastDepositedTime && secondsRemaining && TranslateString(999, 'until')}
      </Text>
      {lastDepositedTime && secondsRemaining && <PerformanceFeeCountdown secondsRemaining={secondsRemaining} />}
    </Flex>
  )
}

export default PerformanceFeeRow
