import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Balance } from '@pancakeswap/uikit'

import { LightGreyCard } from 'components/Card'

import toNumber from 'lodash/toNumber'

import { format, add } from 'date-fns'
import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'

export default function FixedStakingOverview({
  stakeAmount,
  lockAPR,
  boostAPR,
  lockPeriod,
  stakingToken,
  projectedReturnAmount,
}: {
  stakeAmount?: string
  lockAPR?: Percent
  boostAPR?: Percent
  stakingToken: Token
  projectedReturnAmount: CurrencyAmount<Token>
  lockPeriod?: number
}) {
  const { t } = useTranslation()

  return (
    <LightGreyCard>
      {stakeAmount ? (
        <Flex alignItems="center" justifyContent="space-between">
          <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
            {t('Stake Amount')}
          </Text>
          <Balance bold fontSize="16px" decimals={2} value={toNumber(stakeAmount)} />
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
          {t('Ends on')}
        </Text>
        <Text bold>{format(add(new Date(), { days: lockPeriod }), 'MMM d, yyyy hh:mm')}</Text>
      </Flex>
      <Flex alignItems="center" justifyContent="space-between">
        <Text fontSize={12} textTransform="uppercase" color="textSubtle" bold>
          Projected Return
        </Text>
        <Text bold>
          {projectedReturnAmount?.toSignificant(2) ?? 0} {stakingToken.symbol}
        </Text>
      </Flex>
    </LightGreyCard>
  )
}
