import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, RowBetween, Text } from '@pancakeswap/uikit'
import { memo, useMemo } from 'react'
import { AprResult } from '../hooks'
import { AprButton } from './AprButton'
import { AutoCompoundTag } from './Tags'

interface Props {
  id: number | string
  apr: AprResult
  isAprLoading: boolean
  withCakeReward?: boolean
  lpSymbol: string
  autoCompound?: boolean
  totalAssetsInUsd: number
  onAprClick?: () => void
}

export const YieldInfo = memo(function YieldInfo({
  id,
  apr,
  isAprLoading,
  withCakeReward,
  autoCompound,
  totalAssetsInUsd,
  lpSymbol,
}: Props) {
  const { t } = useTranslation()

  const earning = useMemo(() => (withCakeReward ? ['CAKE', t('Fees')].join(' + ') : t('Fees')), [withCakeReward, t])

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
        />
      </RowBetween>
      <RowBetween>
        <Text>{t('Earn')}:</Text>
        <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
          <Text color="text">{earning}</Text>
          {autoCompound && <AutoCompoundTag ml="0.5em" />}
        </Flex>
      </RowBetween>
    </Box>
  )
})
