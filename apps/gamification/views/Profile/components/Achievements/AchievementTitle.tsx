import { Text, TextProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { TranslatableText as AchievementTitleType } from 'config/constants/types'

interface AchievementTitleProps extends TextProps {
  title: AchievementTitleType
}

const AchievementTitle: React.FC<React.PropsWithChildren<AchievementTitleProps>> = ({ title, ...props }) => {
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
