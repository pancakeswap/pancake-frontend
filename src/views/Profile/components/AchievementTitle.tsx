import React from 'react'
import { Text, TextProps } from '@pancakeswap-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { TranslatableText as AchievementTitleType } from 'state/types'

interface AchievementTitleProps extends TextProps {
  title: AchievementTitleType
}

const AchievementTitle: React.FC<AchievementTitleProps> = ({ title, ...props }) => {
  const { t } = useTranslation()

  if (typeof title === 'string') {
    return (
      <Text bold {...props}>
        {title}
      </Text>
    )
  }

  const { key, data = {} } = title

  return (
    <Text bold {...props}>
      {t(key, data)}
    </Text>
  )
}

export default AchievementTitle
