import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Text } from '@pancakeswap/uikit'

const MPendleWarning = () => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="380px">
      <Text>
        {t('Caution - mPENDLE Token')}
        <br />
        {t(
          'Please exercise due caution when trading / providing liquidity for the mPENDLE token. The protocol recently encountered a',
        )}{' '}
        <Link style={{ display: 'inline' }} external href="https://x.com/Penpiexyz_io/status/1831058385330118831">
          {t('security compromise')}
        </Link>
        . {t('For more information, please refer to Penpie’s')}{' '}
        <Link style={{ display: 'inline' }} external href="https://x.com/penpiexyz_io">
          {t('Twitter')}
        </Link>
        .
        <br />
      </Text>
    </Box>
  )
}

export default MPendleWarning
