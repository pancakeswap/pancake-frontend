import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Box, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import { useBCakeBoostLimitAndLockInfo } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/useBCakeV3Info'
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
  isBooster?: boolean
  boosterMultiplier?: number
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
  isBooster,
  boosterMultiplier,
}: Props) {
  const { t } = useTranslation()
  const earning = useMemo(
    () => (apr.isInCakeRewardDateRange ? `${rewardToken?.symbol ?? ''} + ${t('Fees')}` : t('Fees')),
    [t, apr.isInCakeRewardDateRange, rewardToken?.symbol],
  )

  const { locked } = useBCakeBoostLimitAndLockInfo()
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
          isBooster={isBooster && apr?.isInCakeRewardDateRange}
          boosterMultiplier={totalAssetsInUsd === 0 || !locked ? 3 : boosterMultiplier === 0 ? 3 : boosterMultiplier}
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
          <Text>{t('Reward/Day')}:</Text>
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            <RewardPerDay rewardPerSec={rewardPerSec ?? 0} symbol={rewardToken?.symbol} />
          </Flex>
        </RowBetween>
      )}
    </Box>
  )
})
