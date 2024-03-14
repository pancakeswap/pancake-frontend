import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Text } from '@pancakeswap/uikit'

export const Step1 = () => {
  const { t } = useTranslation()

  return (
    <Box mr={['6px']}>
      <Text bold small as="span" color="#FFFFFF">
        {t('In the event of any')}
      </Text>
      <Text bold small as="span" color="#FCC631">
        {t('token distribution:')}
      </Text>
      <Text bold small as="span" color="#FFFFFF">
        {t('We will distribute')}
      </Text>
      <Text bold small as="span" color="#FCC631">
        100%
      </Text>
      <Text bold small as="span" color="#FFFFFF">
        {t('of the proceeds to the CAKE community.')}
      </Text>
      <Text bold small as="span" color="#FCC631">
        {t('CAKE community.')}
      </Text>
      <Link display="inline !important" small external href="https://docs.pancakeswap.finance/token-distribution">
        {t('Learn More')}
      </Link>
    </Box>
  )
}
