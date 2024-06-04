import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, Link } from '@pancakeswap/uikit'

const SafemoonWarning = () => {
  const { t } = useTranslation()

  // Break translation sentences into pieces because the current translation approach doesn't support Link interpolation.
  return (
    <Box maxWidth="380px">
      <Text>
        {t('SAFEMOON has been migrated to')}{' '}
        <Link
          style={{ display: 'inline' }}
          external
          href="https://bscscan.com/address/0x42981d0bfbAf196529376EE702F2a9Eb9092fcB5"
        >
          {t('a new contract address.')}
        </Link>{' '}
        {t(
          'Trading on the old address may result in the complete loss of your assets. For more information please refer to',
        )}{' '}
        <Link style={{ display: 'inline' }} external href="https://twitter.com/safemoon/status/1477770592031887360">
          {t("Safemoon's announcement")}.
        </Link>
      </Text>
    </Box>
  )
}

export default SafemoonWarning
