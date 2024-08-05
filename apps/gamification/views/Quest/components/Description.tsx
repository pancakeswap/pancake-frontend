import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, ReactMarkdown, Text } from '@pancakeswap/uikit'

export const Description = ({ description }: { description: string }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <Box padding="24px">
        <Text bold mb="16px" fontSize={['24px']} lineHeight={['28px']}>
          {t('Description')}
        </Text>
        <ReactMarkdown>{description}</ReactMarkdown>
      </Box>
    </Card>
  )
}
