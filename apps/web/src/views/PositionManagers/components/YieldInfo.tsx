import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Box, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import { AprResult } from '../hooks'
import { AprButton } from './AprButton'
import { RewardPerDay } from './RewardPerDay'
import { AutoCompoundTag } from './Tags'

interface Props {
  id: number | string
  apr: AprResult
  isAprLoading: boolean
  lpSymbol: string
  autoCompound?: boolean
  totalStakedInUsd: number
  totalAssetsInUsd: number
  onAprClick?: () => void
  userLpAmounts?: bigint
  totalSupplyAmounts?: bigint
  precision?: bigint
  lpTokenDecimals?: number
  aprTimeWindow?: number
  rewardToken?: Currency
  rewardPerSec?: number
}

export const YieldInfo = memo(function YieldInfo({
  id,
  apr,
  isAprLoading,
  autoCompound,
  totalAssetsInUsd,
  lpSymbol,
  userLpAmounts,
  totalSupplyAmounts,
  totalStakedInUsd,
  precision,
  lpTokenDecimals,
  aprTimeWindow,
  rewardToken,
  rewardPerSec,
}: Props) {
  const { t } = useTranslation()

  const earning = useMemo(
    () => (apr.isInCakeRewardDateRange ? `${rewardToken?.symbol ?? ''} + ${t('Fees')}` : t('Fees')),
    [t, apr.isInCakeRewardDateRange, rewardToken?.symbol],
  )

  return (
    <Box>
      <RowBetween>
        <Text>{t('APR')}:</Text>
        <AprButton
          id={id}
          apr={apr}
          isAprLoading={isAprLoading}
          lpSymbol={lpSymbol}
          totalAssetsInUsd={totalAssetsInUsd}
          totalSupplyAmounts={totalSupplyAmounts}
          totalStakedInUsd={totalStakedInUsd}
          userLpAmounts={userLpAmounts}
          precision={precision}
          lpTokenDecimals={lpTokenDecimals}
          aprTimeWindow={aprTimeWindow}
          rewardToken={rewardToken}
        />
      </RowBetween>
      <RowBetween>
        <Text>{t('Earn')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Text color="text">{earning}</Text>
          {autoCompound && <AutoCompoundTag ml="0.5em" />}
        </Flex>
      </RowBetween>
      {apr.isInCakeRewardDateRange && (
        <RowBetween>
          <Text>{t('Reward/Day:')}</Text>
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            <RewardPerDay rewardPerSec={rewardPerSec ?? 0} />
          </Flex>
        </RowBetween>
      )}
    </Box>
  )
})
