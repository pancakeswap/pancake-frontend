import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'

const NFPWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>
        {t(`NMT Token has recently experienced an exploit. Please refrain from swapping NMT until further notice.`)}
      </Text>
    </Box>
  )
}

export default NFPWarning
