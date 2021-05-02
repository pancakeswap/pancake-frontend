import React from 'react'
import { Flex, Text, useTooltip } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useWithdrawalFeeTimer from 'hooks/cakeVault/useWithdrawalFeeTimer'
import WithdrawalFeeTimer from './WithdrawalFeeTimer'

interface UnstakingFeeCountdownRowProps {
  account?: string
  withdrawalFee: string
  lastDepositedTime: string
  withdrawalFeePeriod?: string
}

const UnstakingFeeCountdownRow: React.FC<UnstakingFeeCountdownRowProps> = ({
  account = true,
  withdrawalFee,
  lastDepositedTime,
  withdrawalFeePeriod = '259200',
}) => {
  const TranslateString = useI18n()
  const feeAsDecimal = parseInt(withdrawalFee) / 100 || '-'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {`${TranslateString(999, `Unstaking fee:`)} ${feeAsDecimal}%`}
      </Text>
      <Text>
        {TranslateString(
          999,
          'Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets every time you stake new CAKE in the pool.',
        )}
      </Text>
    </>,
    { placement: 'bottom-start' },
  )

  const { secondsRemaining, hasPerformanceFee } = useWithdrawalFeeTimer(
    parseInt(lastDepositedTime, 10),
    parseInt(withdrawalFeePeriod, 10),
  )

  const shouldShowTimer = account && lastDepositedTime && hasPerformanceFee

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <Text ref={targetRef} fontSize="14px" hasTooltip>
        {parseInt(withdrawalFee) / 100 || '-'}%{' '}
        {shouldShowTimer
          ? TranslateString(999, 'unstaking fee until')
          : TranslateString(999, 'unstaking fee if withdrawn within 72h')}
      </Text>
      {shouldShowTimer && <WithdrawalFeeTimer secondsRemaining={secondsRemaining} />}
    </Flex>
  )
}

export default UnstakingFeeCountdownRow
