import { RocketIcon, Tag, TagProps } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { memo } from 'react'

interface BoostedTag extends TagProps {
  style: object
}

const BoostedTag: React.FC<BoostedTag> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="success" outline startIcon={<RocketIcon width="18px" color="success" mr="4px" />} {...props}>
      {t('Boosted')}
    </Tag>
  )
}

export default memo(BoostedTag)
