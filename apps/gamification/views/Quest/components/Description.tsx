import { useTranslation } from '@pancakeswap/localization'
import { Box, ReactMarkdown, Text } from '@pancakeswap/uikit'

export const Description = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Text fontSize={['24px']} bold mb="16px">
        {t('Description')}
      </Text>
      <ReactMarkdown>11233</ReactMarkdown>
    </Box>
  )
}
