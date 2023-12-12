import { Flex, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { isLocked, isStaked } from 'utils/cakePool'
import Apr from './Apr'
import useAvgLockDuration from './LockedPool/hooks/useAvgLockDuration'

export const PerformanceFee: React.FC<
  React.PropsWithChildren<{ userData?: Pool.DeserializedVaultUser; performanceFeeAsDecimal?: number }>
> = ({ userData, performanceFeeAsDecimal }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Performance fee only applies to the flexible staking rewards.'),
    { placement: 'bottom-start' },
  )

  const isLock = userData ? isLocked(userData) : false
  const isStake = userData ? isStaked(userData) : false

  if (!performanceFeeAsDecimal || isLock) {
    return null
  }

  return (
    <Pool.StatWrapper
      label={
        <TooltipText ref={targetRef} small>
          {t('Performance Fee')}
        </TooltipText>
      }
    >
      {tooltipVisible && tooltip}
      <Text ml="4px" small>
        {isStake ? `${performanceFeeAsDecimal}%` : `0~${performanceFeeAsDecimal}%`}
      </Text>
    </Pool.StatWrapper>
  )
}

export const TotalLocked: React.FC<React.PropsWithChildren<{ totalLocked?: BigNumber; lockedToken: Token }>> = ({
  totalLocked,
  lockedToken,
}) => {
  const { t } = useTranslation()

  return (
    <Pool.StatWrapper label={<Text small>{t('Total locked')}:</Text>}>
      <Pool.TotalToken
        total={totalLocked}
        tokenDecimals={lockedToken.decimals}
        decimalsToShow={0}
        symbol={lockedToken.symbol}
      />
    </Pool.StatWrapper>
  )
}

export const DurationAvg = () => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('The average lock duration of all the locked staking positions of other users'),
    { placement: 'bottom-start' },
  )

  const { avgLockDurationsInWeeks } = useAvgLockDuration()

  return (
    <Pool.StatWrapper
      label={
        <TooltipText ref={targetRef} small>
          {t('Average lock duration')}:
        </TooltipText>
      }
    >
      {tooltipVisible && tooltip}
      <Text ml="4px" small>
        {avgLockDurationsInWeeks}
      </Text>
    </Pool.StatWrapper>
  )
}

export const AprInfo: React.FC<
  React.PropsWithChildren<{ pool: Pool.DeserializedPool<Token>; stakedBalance: BigNumber }>
> = ({ pool, stakedBalance }) => {
  const { t } = useTranslation()
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text small>{t('APR')}:</Text>
      <Apr pool={pool} showIcon stakedBalance={stakedBalance} performanceFee={0} fontSize="14px" />
    </Flex>
  )
}
