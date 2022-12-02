import { LinkExternal, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const HayWarning = () => {
  const { t } = useTranslation()

  return (
    <>
      <Text>{t('Warning: HAY is currently depegged due to aBNB token exploits. Please proceed with caution.')}</Text>
      <LinkExternal href="https://twitter.com/Helio_Money/status/1598508192312352768">{t('Learn More')}</LinkExternal>
    </>
  )
}

export default HayWarning
