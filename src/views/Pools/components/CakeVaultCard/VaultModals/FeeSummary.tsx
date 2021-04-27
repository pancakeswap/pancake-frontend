import React from 'react'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import PerformanceFeeCountdownRow from '../PerformanceFeeCountdownRow'

interface FeeSummaryProps {
  stakingTokenSymbol: string
  lastDepositedTime: string
  performanceFee: number
  stakeAmount: string
}

const FeeSummary: React.FC<FeeSummaryProps> = ({
  stakingTokenSymbol,
  lastDepositedTime,
  performanceFee,
  stakeAmount,
}) => {
  const TranslateString = useI18n()
  const feeAsDecimal = performanceFee / 100
  const feeInCake = (parseFloat(stakeAmount) * (feeAsDecimal / 100)).toFixed(4)

  return (
    <>
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        <Text fontSize="14px">{TranslateString(999, 'Unstaking Fee')}</Text>
        <Text fontSize="14px">
          {stakeAmount ? feeInCake : '-'} {stakingTokenSymbol}
        </Text>
      </Flex>
      <PerformanceFeeCountdownRow performanceFee={performanceFee} lastDepositedTime={lastDepositedTime} />
    </>
  )
}

export default FeeSummary
