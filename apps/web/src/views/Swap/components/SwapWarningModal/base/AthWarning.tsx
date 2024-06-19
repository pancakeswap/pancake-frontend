import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'

export const AthWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>{t('Warning: The $ATH token pool is not a valid token trading pair - please stop buying')}</Text>
    </Box>
  )
}
