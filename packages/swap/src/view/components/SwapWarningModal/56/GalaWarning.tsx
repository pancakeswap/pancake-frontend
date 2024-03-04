import { Box, LinkExternal, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const GalaWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>{t('Warning: The pGALA token pool is not a valid token trading pair - please stop buying.')}</Text>
      <LinkExternal href="https://twitter.com/pNetworkDeFi/status/1588266897061031936">
        {t('For more info, please see pGALA’s twitter.')}
      </LinkExternal>
    </Box>
  )
}

export default GalaWarning
