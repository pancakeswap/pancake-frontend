import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Box } from '@pancakeswap/uikit'

import { LightGreyCard } from 'components/Card'

import { ReactNode, useMemo } from 'react'
import BalanceRow from 'views/Pools/components/LockedPool/Common/Overview/BalanceRow'

import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { DAYS_A_YEAR } from '../constant'
import { StakedLimitEndOn } from './StakedLimitEndOn'

export default function FixedStakingOverview({
  stakeAmount,
  lockAPR,
  boostAPR,
  lockPeriod,
  poolEndDay,
  isUnstakeView,
  alreadyStakedAmount,
  disableStrike,
  calculator,
}: {
  disableStrike?: boolean
  isUnstakeView?: boolean
  stakeAmount: CurrencyAmount<Token>
  alreadyStakedAmount: CurrencyAmount<Token>
  lockAPR?: Percent
  boostAPR?: Percent
  lockPeriod?: number
  poolEndDay: number
  calculator?: ReactNode
}) {
  const { t } = useTranslation()

  const apr = boostAPR?.greaterThan(0) ? boostAPR : lockAPR

  const projectedReturnAmount = useMemo(
    () =>
      lockPeriod && apr
        ? stakeAmount
            .add(alreadyStakedAmount)
            .multiply(lockPeriod)
            .multiply(apr.multiply(lockPeriod).divide(DAYS_A_YEAR))
        : stakeAmount.multiply(0),
    [alreadyStakedAmount, apr, lockPeriod, stakeAmount],
  )

  return (
    <LightGreyCard>
      {!isUnstakeView ? (
        <BalanceRow
          title={t('Stake Amount')}
          value={alreadyStakedAmount.greaterThan(0) ? alreadyStakedAmount.toExact() : stakeAmount.toExact()}
          newValue={
            alreadyStakedAmount.greaterThan(0) ? stakeAmount.add(alreadyStakedAmount).toExact() : stakeAmount.toExact()
          }
          decimals={2}
        />
      ) : null}
      {!isUnstakeView && lockPeriod ? (
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
            {t('Duration')}
          </Text>
          <Text bold color={alreadyStakedAmount.greaterThan(0) ? 'failure' : undefined}>
            {lockPeriod} {t('days')}
          </Text>
        </Flex>
      ) : null}
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          {t('APR')}
        </Text>
        <Text bold>{lockAPR?.toSignificant(2)}%</Text>
      </Flex>
      {boostAPR && lockAPR ? (
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
            {t('vCAKE Boost')}
          </Text>
          <Text bold>{boostAPR.divide(lockAPR).divide(100).toSignificant(2)}x</Text>
        </Flex>
      ) : null}
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          {t('Stake Period Ends')}
        </Text>
        <Text color={alreadyStakedAmount.greaterThan(0) ? 'failure' : undefined} bold>
          <StakedLimitEndOn lockPeriod={lockPeriod} poolEndDay={poolEndDay} />
        </Text>
      </Flex>
      <Flex alignItems="baseline" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          {t('Projected Return')}
        </Text>
        <Flex>
          <Box style={{ textAlign: 'end' }}>
            <AmountWithUSDSub shouldStrike={isUnstakeView && !disableStrike} amount={projectedReturnAmount} />
          </Box>
          {calculator}
        </Flex>
      </Flex>
    </LightGreyCard>
  )
}
