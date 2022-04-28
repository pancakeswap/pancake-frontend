import { Token } from '@pancakeswap/sdk'
import Balance from 'components/Balance'
import { Flex, Skeleton, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { FC, ReactNode, useMemo } from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import { useVaultMaxDuration } from 'hooks/useVaultMaxDuration'
import { useLockPoolConfigVariables } from 'hooks/useVaultApy'
import { DeserializedLockedVaultUser } from 'state/types'
import { isLocked, isStaked } from 'utils/cakePool'
import { BIG_TEN } from 'utils/bigNumber'
import formatSecondsToWeeks from './LockedPool/utils/formatSecondsToWeeks'

const StatWrapper: FC<{ label: ReactNode }> = ({ children, label }) => {
  return (
    <Flex mb="2px" justifyContent="space-between" alignItems="center" width="100%">
      {label}
      <Flex alignItems="center">{children}</Flex>
    </Flex>
  )
}

export const PerformanceFee: FC<{ userData?: DeserializedLockedVaultUser; performanceFeeAsDecimal?: number }> = ({
  userData,
  performanceFeeAsDecimal,
}) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Performance fee only applies to the flexible staking rewards.'),
    { placement: 'bottom-start' },
  )

  const isLock = isLocked(userData)
  const isStake = isStaked(userData)

  if (!performanceFeeAsDecimal || isLock) {
    return null
  }

  return (
    <StatWrapper
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
    </StatWrapper>
  )
}

const TotalToken = ({ total, token }: { total: BigNumber; token: Token }) => {
  if (total && total.gte(0)) {
    return <Balance small value={getBalanceNumber(total, token.decimals)} decimals={0} unit={` ${token.symbol}`} />
  }
  return <Skeleton width="90px" height="21px" />
}

export const TotalLocked: FC<{ totalLocked: BigNumber; lockedToken: Token }> = ({ totalLocked, lockedToken }) => {
  const { t } = useTranslation()

  const duration = useVaultMaxDuration()

  if (duration && duration.gt(0)) {
    return (
      <StatWrapper label={<Text small>{t('Total locked')}:</Text>}>
        <TotalToken total={totalLocked} token={lockedToken} />
      </StatWrapper>
    )
  }

  return null
}

export const DurationAvg: FC<{
  totalStakedCakeAmount: BigNumber
  totalLockedAmount: BigNumber
  pricePerFullShare: BigNumber
  totalShares: BigNumber
}> = ({ totalStakedCakeAmount, totalLockedAmount, pricePerFullShare, totalShares }) => {
  const { t } = useTranslation()
  const { boostWeight, durationFactor } = useLockPoolConfigVariables()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('The average lock duration of all the locked staking positions of other users'),
    { placement: 'bottom-start' },
  )

  const avgLockDurationsInWeeks = useMemo(() => {
    const flexibleCakeAmount = totalStakedCakeAmount.minus(totalLockedAmount)
    const flexibleCakeShares = flexibleCakeAmount.div(pricePerFullShare).times(BIG_TEN.pow(18))
    const lockedCakeBoostedShares = totalShares.minus(flexibleCakeShares)
    const lockedCakeOriginalShares = totalLockedAmount.div(pricePerFullShare).times(BIG_TEN.pow(18))
    const avgBoostRatio = lockedCakeBoostedShares.div(lockedCakeOriginalShares)

    const avgLockDurationsInSeconds = avgBoostRatio
      .minus(1)
      .times(new BigNumber(durationFactor.toString()))
      .div(new BigNumber(boostWeight.toString()).div(BIG_TEN.pow(12)))

    return formatSecondsToWeeks(avgLockDurationsInSeconds.toFixed())
  }, [totalStakedCakeAmount, durationFactor, totalLockedAmount, pricePerFullShare, totalShares, boostWeight])

  return (
    <StatWrapper
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
    </StatWrapper>
  )
}

export const TotalStaked: FC<{ totalStaked: BigNumber; stakingToken: Token }> = ({ totalStaked, stakingToken }) => {
  const { t } = useTranslation()

  return (
    <StatWrapper label={<Text small>{t('Total staked')}:</Text>}>
      <TotalToken total={totalStaked} token={stakingToken} />
    </StatWrapper>
  )
}
