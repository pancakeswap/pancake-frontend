import { Tag } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { PoolState } from 'hooks/v3/types'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'

export function FeeTierPercentageBadge({
  feeAmount,
  distributions,
  poolState,
}: {
  feeAmount: FeeAmount
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
}) {
  const { t } = useTranslation()

  return (
    <Tag
      variant="secondary"
      outline
      fontSize="10px"
      padding="4px"
      style={{
        width: 'fit-content',
        justifyContent: 'center',
        whiteSpace: 'inherit',
        alignSelf: 'flex-end',
        textAlign: 'center',
      }}
    >
      {!distributions || poolState === PoolState.NOT_EXISTS || poolState === PoolState.INVALID
        ? t('Not Created')
        : distributions[feeAmount] !== undefined
        ? `${distributions[feeAmount]?.toFixed(0)}% ${t('Pick')}`
        : t('No Data')}
    </Tag>
  )
}
