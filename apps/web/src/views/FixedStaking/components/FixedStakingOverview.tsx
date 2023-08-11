import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Balance, Box } from '@pancakeswap/uikit'

import { LightGreyCard } from 'components/Card'

import toNumber from 'lodash/toNumber'
import { useMemo } from 'react'

import { formatTime } from 'utils/formatTime'

import { add } from 'date-fns'
import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { AmountWithUSDSub } from './AmountWithUSDSub'
import { DAYS_A_YEAR } from '../constant'

export default function FixedStakingOverview({
  stakeAmount,
  lockAPR,
  boostAPR,
  lockPeriod,
}: {
  stakeAmount: CurrencyAmount<Token>
  lockAPR?: Percent
  boostAPR?: Percent
  lockPeriod?: number
}) {
  const { t } = useTranslation()

  const apr = boostAPR?.greaterThan(0) ? boostAPR : lockAPR

  const projectedReturnAmount = useMemo(
    () =>
      lockPeriod && apr
        ? stakeAmount.multiply(lockPeriod).multiply(apr.multiply(lockPeriod).divide(DAYS_A_YEAR))
        : stakeAmount.multiply(0),
    [apr, lockPeriod, stakeAmount],
  )

  return (
    <LightGreyCard>
      {stakeAmount !== null || stakeAmount !== undefined ? (
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
            {t('Stake Amount')}
          </Text>
          <Balance bold fontSize="16px" decimals={2} value={toNumber(stakeAmount.toSignificant(6))} />
        </Flex>
      ) : null}
      {lockPeriod ? (
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
            {t('Duration')}
          </Text>
          <Text bold>
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
      {boostAPR ? (
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
            {t('vCAKE Boost')}
          </Text>
          <Text bold>{boostAPR?.toSignificant(2)}%</Text>
        </Flex>
      ) : null}
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          {t('Stake Period Ends')}
        </Text>
        <Text bold>{formatTime(add(new Date(), { days: lockPeriod }))}</Text>
      </Flex>
      <Flex alignItems="baseline" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          {t('Projected Return')}
        </Text>
        <Box style={{ textAlign: 'end' }}>
          <AmountWithUSDSub amount={projectedReturnAmount} />
        </Box>
      </Flex>
    </LightGreyCard>
  )
}
