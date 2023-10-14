import { useTranslation } from '@pancakeswap/localization'
import { Tag } from '@pancakeswap/uikit'
import { useMerklInfo } from '../hooks/useMerkl'

export function MerklTag({ poolAddress }: { poolAddress: string | null }) {
  const { t } = useTranslation()
  const { rewardsPerToken } = useMerklInfo(poolAddress)

  if (!rewardsPerToken.length) return null

  return (
    <Tag ml="8px" outline variant="warning">
      {t('Merkl')}
    </Tag>
  )
}

export function MerklRewardsTag({ poolAddress }: { poolAddress: string | null }) {
  const { t } = useTranslation()
  const { rewardsPerToken } = useMerklInfo(poolAddress)

  if (!rewardsPerToken.length) return null

  return (
    <Tag variant="warning" mr="8px" outline>
      {t('Merkl Rewards')}
    </Tag>
  )
}
