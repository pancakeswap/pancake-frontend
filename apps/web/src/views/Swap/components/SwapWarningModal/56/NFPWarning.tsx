import { useTranslation } from '@pancakeswap/localization'
import { Box, LinkExternal, Text } from '@pancakeswap/uikit'

const NFPWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>
        {t(
          `The NFP token has recently experienced an exploit. Please refrain from swapping NFP until further notice. More information can be found on the project's twitter page.`,
        )}
      </Text>
      <LinkExternal href="https://twitter.com/nfprompt/status/1768558658697433464?s=20">
        {t('twitter page')}
      </LinkExternal>
    </Box>
  )
}

export default NFPWarning
