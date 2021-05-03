import React from 'react'
import { Text, Flex, useTooltip, Box } from '@pancakeswap-libs/uikit'
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
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box style={{ fontWeight: 'bold' }} mb="4px">
        {`${TranslateString(999, `Unstaking fee:`)} ${feeAsDecimal}%`}
      </Box>
      <Box>
        {TranslateString(
          999,
          'Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets every time you stake new CAKE in the pool.',
        )}
      </Box>
    </Box>,
    'bottom-end',
  )

  return (
    <>
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        {tooltipVisible && tooltip}
        <Text ref={targetRef} fontSize="14px">
          {TranslateString(999, 'Unstaking Fee')}
        </Text>
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
