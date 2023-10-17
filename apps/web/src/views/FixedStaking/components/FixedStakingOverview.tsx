import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Box } from '@pancakeswap/uikit'

import { LightGreyCard } from 'components/Card'

import { ReactNode, useMemo } from 'react'
import TextRow from 'views/Pools/components/LockedPool/Common/Overview/TextRow'
import { formatUnixTime } from 'utils/formatTime'

import { CurrencyAmount, Percent, Currency } from '@pancakeswap/swap-sdk-core'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { StakedLimitEndOn } from './StakedLimitEndOn'
import { useCurrentDay } from '../hooks/useStakedPools'
import { useCalculateProjectedReturnAmount } from '../hooks/useCalculateProjectedReturnAmount'

function DiffDuration({ lockPeriod }: { lockPeriod: number }) {
  const { t } = useTranslation()

  const lastDayAction = useCurrentDay()

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
  unlockAPR,
  isBoost,
  lockPeriod,
  lastDayAction,
  poolEndDay,
  isUnstakeView,
  alreadyStakedAmount,
  disableStrike,
  calculator,
  unlockTime,
}: {
  unlockTime?: number
  disableStrike?: boolean
  isUnstakeView?: boolean
  stakeAmount: CurrencyAmount<Currency>
  alreadyStakedAmount?: CurrencyAmount<Currency>
  lockAPR: Percent
  boostAPR: Percent
  unlockAPR: Percent
  poolEndDay: number
  lastDayAction?: number
  lockPeriod?: number
  calculator?: ReactNode
  isBoost?: boolean
}) {
  const { t } = useTranslation()

  const apr = useMemo(() => (isBoost ? boostAPR : lockAPR), [boostAPR, isBoost, lockAPR])

  const safeAlreadyStakedAmount = useMemo(
    () => alreadyStakedAmount || CurrencyAmount.fromRawAmount(stakeAmount.currency, '0'),
    [alreadyStakedAmount, stakeAmount.currency],
  )

  const currentDay = useCurrentDay()

  const { projectedReturnAmount } = useCalculateProjectedReturnAmount({
    amountDeposit: stakeAmount.add(safeAlreadyStakedAmount),
    lastDayAction: (safeAlreadyStakedAmount.greaterThan(0) && stakeAmount.equalTo(0) ? lastDayAction : currentDay) || 0,
    lockPeriod: lockPeriod || 0,
    apr,
    poolEndDay,
    unlockAPR,
  })

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
            {t('Locked Cake Boost')}
          </Text>
          <Text bold>{boostAPR.divide(lockAPR).divide(100).toSignificant(2)}x</Text>
        </Flex>
      ) : null}
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          {t('Stake Period Ends')}
        </Text>
        <Text color={safeAlreadyStakedAmount.greaterThan(0) ? 'failure' : undefined} bold>
          {unlockTime ? (
            formatUnixTime(unlockTime)
          ) : (
            <StakedLimitEndOn lockPeriod={lockPeriod} poolEndDay={poolEndDay} />
          )}
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
