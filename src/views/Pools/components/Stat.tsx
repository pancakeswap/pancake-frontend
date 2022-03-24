import { Token } from '@pancakeswap/sdk'
import Balance from 'components/Balance'
import { Flex, Skeleton, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { FC, ReactNode } from 'react'
import { getBalanceNumber } from 'utils/formatBalance'
import { useVaultMaxDuration } from '../hooks/useVaultMaxDuration'

const StatWrapper: FC<{ label: ReactNode }> = ({ children, label }) => {
  return (
    <Flex mb="2px" justifyContent="space-between" alignItems="center">
      {label}
      <Flex alignItems="center">{children}</Flex>
    </Flex>
  )
}

export const PerformanceFee: FC<{ performanceFee?: number }> = ({ performanceFee, children }) => {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Performance fee only applies to the flexible staking rewards.'),
    { placement: 'bottom-start' },
  )

  return (
    <StatWrapper
      label={
        <TooltipText ref={targetRef} small>
          {t('Performance Fee')}
        </TooltipText>
      }
    >
      {tooltipVisible && tooltip}
      {children ||
        (performanceFee ? (
          <Text ml="4px" small>
            {performanceFee / 100}%
          </Text>
        ) : (
          <Skeleton width="90px" height="21px" />
        ))}
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

  console.log(totalLocked && totalLocked.eq(0))

  if (duration && duration.gt(0)) {
    return (
      <StatWrapper label={<Text small>{t('Total locked')}:</Text>}>
        <TotalToken total={totalLocked} token={lockedToken} />
      </StatWrapper>
    )
  }

  return null
}

export const TotalStaked: FC<{ totalStaked: BigNumber; stakingToken: Token }> = ({ totalStaked, stakingToken }) => {
  const { t } = useTranslation()

  return (
    <StatWrapper label={<Text small>{t('Total staked')}:</Text>}>
      <TotalToken total={totalStaked} token={stakingToken} />
    </StatWrapper>
  )
}
