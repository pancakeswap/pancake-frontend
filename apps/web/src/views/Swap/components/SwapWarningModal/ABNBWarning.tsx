import { LinkExternal, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const ABNBWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('Warning: aBNB token from Ankr has been exploited. Please proceed with caution.')}</Text>
      <LinkExternal href="https://twitter.com/ankr/status/1598503332477280256">{t('Learn More')}</LinkExternal>
    </>
  )
}

export default ABNBWarning
