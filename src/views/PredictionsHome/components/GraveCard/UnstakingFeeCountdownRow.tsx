import React from 'react'
import { Flex, Text, TooltipText, useTooltip } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import WithdrawalFeeTimer from './WithdrawalFeeTimer'
import { GraveConfig } from '../../../../config/constants/types'

interface UnstakingFeeCountdownRowProps {
  account?: string
  grave: GraveConfig
  userData: any
}

const UnstakingFeeCountdownRow: React.FC<UnstakingFeeCountdownRowProps> = ({
          account = true,
          grave,
         userData,
       }) => {
  const { t } = useTranslation()
  const feeAsDecimal = grave.minimumStakingTime / 100 || '-'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb='4px'>
        {t(`Unstaking fee: %fee%%`, { fee: feeAsDecimal })}
      </Text>
      <Text>
        {t(
          'Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets every time you stake new CAKE in the pool.',
        )}
      </Text>
    </>,
    { placement: 'bottom-start' },
  )

  const { withdrawalDate } = userData
  const now = Date.now() / 1000

  const hasUnstakingFee = withdrawalDate > now

  const secondsRemaining = userData.withdrawalDate - now

  const shouldShowTimer = account && hasUnstakingFee

  return (
    <Flex alignItems='center' justifyContent='space-between'>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        {grave.earlyWithdrawalFee || '-'}%{' '}
        {shouldShowTimer ? t('unstaking fee until') : t('unstaking fee if withdrawn within staking period')}
      </TooltipText>
      {shouldShowTimer && <WithdrawalFeeTimer secondsRemaining={secondsRemaining} />}
    </Flex>
  )
}

export default UnstakingFeeCountdownRow
