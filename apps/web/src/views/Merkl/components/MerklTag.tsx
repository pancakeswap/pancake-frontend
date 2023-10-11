import { useTranslation } from '@pancakeswap/localization'
import { Tag } from '@pancakeswap/uikit'

export function MerklTag() {
  const { t } = useTranslation()

  return (
    <Tag ml="8px" outline variant="warning">
      {t('Merkl')}
    </Tag>
  )
}

export function MerklRewardsTag() {
  return (
    <Tag variant="warning" mr="8px" outline>
      Merkl Rewards
    </Tag>
  )
}
