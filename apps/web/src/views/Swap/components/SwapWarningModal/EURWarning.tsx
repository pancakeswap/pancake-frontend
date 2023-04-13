import { useTranslation } from '@pancakeswap/localization'
import { Text, Link } from '@pancakeswap/uikit'

const EURWarning = () => {
  const { t } = useTranslation()

  // Break translation sentences into pieces because the current translation approach doesn't support Link interpolation.
  return (
    <>
      <Text mb="16px">
        {t(
          'Please exercise due caution when trading / providing liquidity for the agEUR token. The protocol was recently affected by the',
        )}{' '}
        <Link style={{ display: 'inline' }} external href="https://twitter.com/eulerfinance/status/1635218198042918918">
          {t('Euler hack')}
        </Link>
      </Text>
      <Text>
        {t('For more information, please refer to Angle Protocol’s')}{' '}
        <Link
          style={{ display: 'inline' }}
          external
          href="https://twitter.com/AngleProtocol/status/1635293731082612738"
        >
          {t('announcement')}.
        </Link>
      </Text>
    </>
  )
}

export default EURWarning
