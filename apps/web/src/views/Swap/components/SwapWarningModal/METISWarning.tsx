import { Box, Link, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const METISWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>{t('Caution - METIS Token')}</Text>
      <Text>
        {t(
          'Please exercise due caution when trading / providing liquidity for the METIS token. The protocol was recently affected by the',
        )}
        <Link m="0 4px" style={{ display: 'inline' }} href="https://twitter.com/MetisDAO/status/1676431481621676032">
          {t('PolyNetwork Exploit.')}
        </Link>
        {t('For more information, please refer to MetisDAO’s')}
        <Link ml="4px" style={{ display: 'inline' }} href="https://twitter.com/MetisDAO">
          {t('Twitter')}
        </Link>
      </Text>
    </Box>
  )
}

export default METISWarning
