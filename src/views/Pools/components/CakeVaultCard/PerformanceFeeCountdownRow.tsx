import React from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import usePerformanceFeeTimer from 'hooks/cakeVault/usePerformanceFeeTimer'
import PerformanceFeeTimer from './PerformanceFeeTimer'

interface PerformanceFeeCountdownRowProps {
  performanceFee: number
  lastDepositedTime: string
}

const PerformanceFeeCountdownRow: React.FC<PerformanceFeeCountdownRowProps> = ({
  performanceFee,
  lastDepositedTime,
}) => {
  const TranslateString = useI18n()
  const { secondsRemaining, hasPerformanceFee } = usePerformanceFeeTimer(parseInt(lastDepositedTime))

  return (
    <Flex mt="8px" alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">
        {performanceFee / 1000 || '-'}% {TranslateString(999, 'unstaking fee')}{' '}
        {lastDepositedTime && hasPerformanceFee && TranslateString(999, 'until')}
      </Text>
      {lastDepositedTime && hasPerformanceFee && <PerformanceFeeTimer secondsRemaining={secondsRemaining} />}
    </Flex>
  )
}

export default PerformanceFeeCountdownRow
