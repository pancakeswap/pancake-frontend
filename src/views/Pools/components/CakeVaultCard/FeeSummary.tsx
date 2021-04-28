import React from 'react'
import { Text, Flex } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { VaultFees } from 'hooks/cakeVault/useGetVaultFees'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'

interface FeeSummaryProps {
  stakingTokenSymbol: string
  lastDepositedTime: string
  vaultFees: VaultFees
  stakeAmount: string
}

const FeeSummary: React.FC<FeeSummaryProps> = ({ stakingTokenSymbol, lastDepositedTime, vaultFees, stakeAmount }) => {
  const TranslateString = useI18n()
  const feeAsDecimal = parseInt(vaultFees.withdrawalFee) / 100
  const feeInCake = (parseFloat(stakeAmount) * (feeAsDecimal / 100)).toFixed(4)

  return (
    <>
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        <Text fontSize="14px">{TranslateString(999, 'Unstaking Fee')}</Text>
        <Text fontSize="14px">
          {stakeAmount ? feeInCake : '-'} {stakingTokenSymbol}
        </Text>
      </Flex>
      <UnstakingFeeCountdownRow
        withdrawalFee={vaultFees.withdrawalFee}
        withdrawalFeePeriod={vaultFees.withdrawalFeePeriod}
        lastDepositedTime={lastDepositedTime}
      />
    </>
  )
}

export default FeeSummary
