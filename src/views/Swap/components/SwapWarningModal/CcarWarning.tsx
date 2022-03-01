import { useTranslation } from 'contexts/Localization'
import { Text, Link } from '@pancakeswap/uikit'

const CcarWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>
        {t('Crypto Cars (CCAR) has been migrated to')}{' '}
        <Link
          style={{ display: 'inline' }}
          external
          href="https://bscscan.com/token/0x322e5015Cc464Ada7f99dE7131CE494dE1834396"
        >
          {t('a new contract address.')}
        </Link>{' '}
        {t(
          'Trading on the old address may result in the complete loss of your assets. For more information please refer to',
        )}{' '}
        <Link style={{ display: 'inline' }} external href="https://t.me/Crypto_Cars_Official/465037">
          {t('the announcement.')}
        </Link>
      </Text>
    </>
  )
}

export default CcarWarning
