import React from 'react'
import { Text, Flex, useTooltip, TooltipText } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import { GraveConfig } from '../../../../config/constants/types'

interface FeeSummaryProps {
  stakingTokenSymbol: string
  userData: any
  grave: GraveConfig
  stakeAmount: string
}

const FeeSummary: React.FC<FeeSummaryProps> = ({ stakingTokenSymbol, userData, grave, stakeAmount }) => {
  const { t } = useTranslation()
  const feeInZombie = (parseFloat(stakeAmount) * (grave.earlyWithdrawalFee / 100)).toFixed(4)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t(`Unstaking fee: %fee%%`, { fee: grave.earlyWithdrawalFee })}
      </Text>
      <Text>
        {t(
          'Only applies when unstaking before staking period is complete. Unstaking after the period is complete will not include a fee.',
        )}
      </Text>
    </>,
    { placement: 'top-start' },
  )

  return (
    <>
      <Flex mt="24px" alignItems="center" justifyContent="space-between">
        {tooltipVisible && tooltip}
        <TooltipText ref={targetRef} small>
          {t('Unstaking Fee')}
        </TooltipText>
        <Text fontSize="14px">
          {stakeAmount ? feeInZombie : '-'} {stakingTokenSymbol}
        </Text>
      </Flex>
      <UnstakingFeeCountdownRow
        grave={grave}
        userData={userData}
      />
    </>
  )
}

export default FeeSummary
