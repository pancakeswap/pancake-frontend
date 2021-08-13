import React from 'react'
import { Text, Flex, useTooltip, TooltipText } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { BigNumber } from 'bignumber.js'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import { GraveConfig } from '../../../../config/constants/types'
import { getFullDisplayBalance } from '../../../../utils/formatBalance'
import tokens from '../../../../config/constants/tokens'

interface FeeSummaryProps {
  stakingTokenSymbol: string
  userData: any
  grave: GraveConfig
  feeInZombie: BigNumber
}

const FeeSummary: React.FC<FeeSummaryProps> = ({ stakingTokenSymbol, userData, grave, feeInZombie }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t(`Early withdrawal fee: %fee%%`, { fee: (grave.earlyWithdrawalFee * 100) })}
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
          {t('Early Withdrawal Fee')}
        </TooltipText>
        <Text fontSize="14px">
          {getFullDisplayBalance(feeInZombie, tokens.zmbe.decimals)} ZMBE
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
