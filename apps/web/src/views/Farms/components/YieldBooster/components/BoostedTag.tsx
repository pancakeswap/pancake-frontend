import { useTranslation } from '@pancakeswap/localization'
import { RocketIcon, Tag, TagProps } from '@pancakeswap/uikit'
import { memo } from 'react'

interface BoostedTag extends TagProps {
  // Add Object to bypass typescript warning
  style?: object
}

const BoosterTag: React.FC<BoostedTag> = (props) => {
  const { t } = useTranslation()
  return (
    <Tag variant="success" outline startIcon={<RocketIcon width="18px" color="success" mr="4px" />} {...props}>
      {t('Booster')}
    </Tag>
  )
}

export default memo(BoosterTag)
