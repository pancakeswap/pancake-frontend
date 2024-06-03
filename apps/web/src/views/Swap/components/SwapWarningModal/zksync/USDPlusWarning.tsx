import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Text } from '@pancakeswap/uikit'

const USDPlusWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text as="span">
        {t(
          `Overnight has temporarily paused USD+ operations on zkSync due to the recent Velocore exploit.Swap, approve, and add / remove liquidity functions are currently unavailable. More information can be found on Overnight's`,
        )}
      </Text>
      <Link
        external
        m="0 4px"
        style={{ display: 'inline' }}
        href="https://twitter.com/overnight_fi/status/1797552748789195237"
      >
        {t('twitter page')}.
      </Link>
    </Box>
  )
}

export default USDPlusWarning
