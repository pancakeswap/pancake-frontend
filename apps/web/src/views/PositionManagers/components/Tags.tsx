import { memo } from 'react'
import { Tag, Farm, TagProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const { V3FeeTag } = Farm.Tags

export const FarmTag = memo(function FarmTag(props: TagProps) {
  const { t } = useTranslation()
  return (
    <Tag variant="warning" outline {...props}>
      {t('Farm')}
    </Tag>
  )
})

export { V3FeeTag as FeeTag }
