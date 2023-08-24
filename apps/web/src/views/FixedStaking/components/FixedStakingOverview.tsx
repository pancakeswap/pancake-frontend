import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Box } from '@pancakeswap/uikit'

import { LightGreyCard } from 'components/Card'

import { ReactNode, useMemo } from 'react'
import TextRow from 'views/Pools/components/LockedPool/Common/Overview/TextRow'

import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { DAYS_A_YEAR } from '../constant'
import { StakedLimitEndOn } from './StakedLimitEndOn'
import { useCurrenDay } from '../hooks/useStakedPools'

function DiffDuration({ lockPeriod }: { lockPeriod: number }) {
  const { t } = useTranslation()

  const lastDayAction = useCurrenDay()

  const lockEndDay = lastDayAction + lockPeriod

  return (
    <TextRow
      title={t('Duration')}
      value={t('%lockPeriod% days', { lockPeriod })}
      newValue={t('%lockPeriod% days', { lockPeriod: lockEndDay - lastDayAction })}
    />
  )
}

export default function FixedStakingOverview({
  stakeAmount,
  lockAPR,
  boostAPR,
  isBoost,
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
  alreadyStakedAmount?: CurrencyAmount<Token>
  lockAPR?: Percent
  boostAPR?: Percent
  lockPeriod?: number
  poolEndDay: number
  calculator?: ReactNode
  isBoost?: boolean
}) {
  const { t } = useTranslation()

  const apr = isBoost ? boostAPR : lockAPR

  const safeAlreadyStakedAmount = alreadyStakedAmount || CurrencyAmount.fromRawAmount(stakeAmount.currency, '0')

  const projectedReturnAmount = useMemo(
    () =>
      lockPeriod && apr
        ? stakeAmount
            .add(safeAlreadyStakedAmount)
            .multiply(lockPeriod)
            .multiply(apr.multiply(lockPeriod).divide(DAYS_A_YEAR))
        : stakeAmount.multiply(0),
    [safeAlreadyStakedAmount, apr, lockPeriod, stakeAmount],
  )

  return (
    <LightGreyCard>
      {!isUnstakeView ? (
        <TextRow
          title={t('Stake Amount')}
          value={
            safeAlreadyStakedAmount.greaterThan(0)
              ? safeAlreadyStakedAmount.toSignificant(5)
              : stakeAmount.toSignificant(5)
          }
          newValue={
            safeAlreadyStakedAmount.greaterThan(0)
              ? stakeAmount.add(safeAlreadyStakedAmount).toSignificant(5)
              : stakeAmount.toSignificant(5)
          }
        />
      ) : null}
      {!isUnstakeView && lockPeriod ? (
        safeAlreadyStakedAmount.greaterThan(0) && stakeAmount.greaterThan(0) ? (
          <DiffDuration lockPeriod={lockPeriod} />
        ) : (
          <Flex alignItems="center" justifyContent="space-between">
            <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
              {t('Duration')}
            </Text>
            <Text bold>
              {lockPeriod} {t('days')}
            </Text>
          </Flex>
        )
      ) : null}
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          {t('APR')}
        </Text>
        <Text bold>{apr?.toSignificant(2)}%</Text>
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
        <Text color={safeAlreadyStakedAmount.greaterThan(0) ? 'failure' : undefined} bold>
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
