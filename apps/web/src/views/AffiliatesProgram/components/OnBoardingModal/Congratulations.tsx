import { useMemo } from 'react'
import { Flex, Text, Button, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useTheme } from 'styled-components'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'

const Congratulations = () => {
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()

  const perpetualUrl = useMemo(() => getPerpetualUrl({ chainId, languageCode: code, isDark }), [chainId, code, isDark])

  return (
    <Flex flexDirection="column" padding={['24px', '24px', '24px', '24px', '80px 24px']}>
      <Text lineHeight="110%" maxWidth="190px" fontSize={['24px']} bold m="12px 0">
        {t('Congratulations! You’re all set!')}
      </Text>
      <Text color="textSubtle" fontSize="14px" mb="24px">
        {t('Start trading and enjoy referral discounts!')}
      </Text>
      <Link external href="/swap" width="100% !important">
        <Button width="100%">{t('Start Trading')}</Button>
      </Link>
      <Link external href={perpetualUrl} width="100% !important">
        <Button width="100%" m="8px 0" variant="secondary">
          {t('Try out our Perpetuals Platform')}
        </Button>
      </Link>
      <Link external href="/" width="100% !important">
        <Button width="100%" variant="secondary">
          {t('Learn More')}
        </Button>
      </Link>
    </Flex>
  )
}

export default Congratulations
