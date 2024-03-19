import { useTranslation } from '@pancakeswap/localization'
import { Box, Link, Text } from '@pancakeswap/uikit'

export const Step1 = () => {
  const { t } = useTranslation()

  return (
    <Box mr={['6px']}>
      <Text bold as="span" color="#FFFFFF" fontSize={['12px', '12px', '14px']}>
        {t('In the event of any')}
      </Text>
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        {t('token distribution,')}
      </Text>
      <Text bold as="span" color="#FFFFFF" fontSize={['12px', '12px', '14px']}>
        {t('we will distribute')}
      </Text>
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        100%
      </Text>
      <Text bold as="span" color="#FFFFFF" fontSize={['12px', '12px', '14px']}>
        {t('of the proceeds to the')}
      </Text>
      <Text bold as="span" color="#FCC631" fontSize={['12px', '12px', '14px']}>
        {t('CAKE community.')}
      </Text>
      <Link
        external
        display="inline !important"
        fontSize={['12px', '12px', '14px']}
        href="https://docs.pancakeswap.finance/token-distribution"
      >
        {t('Learn More')}
      </Link>
    </Box>
  )
}
