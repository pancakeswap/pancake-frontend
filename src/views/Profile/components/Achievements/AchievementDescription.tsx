import { Text, TextProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { TranslatableText as AchievementDescriptionType } from 'config/constants/types'
import styled from 'styled-components'

interface AchievementDescriptionProps extends TextProps {
  description?: AchievementDescriptionType
}

const Description = styled(Text).attrs({ as: 'p' })`
  display: none;

  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const AchievementDescription: React.FC<React.PropsWithChildren<AchievementDescriptionProps>> = ({
  description,
  ...props
}) => {
  const { t } = useTranslation()

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

  const { key, data = {} } = description

  return (
    <Description color="textSubtle" fontSize="14px" {...props}>
      {t(key, data)}
    </Description>
  )
}

export default AchievementDescription
