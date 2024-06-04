import { Box, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const LUSDWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>{t('Caution - lUSD Token')}</Text>
      <Text>
        {t(
          'Please exercise due caution when trading or providing liquidity for the lUSD token. The protocol was recently affected by an ',
        )}
        <Link
          external
          style={{ display: 'inline' }}
          href="https://twitter.com/LinearFinance/status/1704818417880936535"
        >
          {t('exploit.')}
        </Link>
        {t('For more information, please refer to Linear Finance’s')}
        <Link external ml="4px" style={{ display: 'inline' }} href="https://twitter.com/LinearFinance">
          {t('Twitter')}
        </Link>
      </Text>
    </Box>
  )
}

export default LUSDWarning
