import React from 'react'
import { Text, TextProps } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { TranslatableText as AchievementDescriptionType } from 'state/types'

interface AchievementDescriptionProps extends TextProps {
  description?: AchievementDescriptionType
}

const AchievementDescription: React.FC<AchievementDescriptionProps> = ({ description, ...props }) => {
  const TranslateString = useI18n()

  if (!description) {
    return null
  }

  if (typeof description === 'string') {
    return (
      <Text as="p" color="textSubtle" fontSize="14px" {...props}>
        {description}
      </Text>
    )
  }

  const { id, fallback, data = {} } = description

  return (
    <Text as="p" color="textSubtle" fontSize="14px" {...props}>
      {TranslateString(id, fallback, data)}
    </Text>
  )
}

export default AchievementDescription
