import React from 'react'
import { Flex, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useWithdrawalFeeTimer from 'hooks/cakeVault/useWithdrawalFeeTimer'
import WithdrawalFeeTimer from './WithdrawalFeeTimer'

interface UnstakingFeeCountdownRowProps {
  withdrawalFee: number
  lastDepositedTime: string
}

const UnstakingFeeCountdownRow: React.FC<UnstakingFeeCountdownRowProps> = ({ withdrawalFee, lastDepositedTime }) => {
  const TranslateString = useI18n()
  const { secondsRemaining, hasPerformanceFee } = useWithdrawalFeeTimer(parseInt(lastDepositedTime))

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">
        {withdrawalFee / 100 || '-'}% {TranslateString(999, 'unstaking fee')}{' '}
        {lastDepositedTime && hasPerformanceFee && TranslateString(999, 'until')}
      </Text>
      {lastDepositedTime && hasPerformanceFee && <WithdrawalFeeTimer secondsRemaining={secondsRemaining} />}
    </Flex>
  )
}

export default UnstakingFeeCountdownRow
