import { useTranslation } from '@pancakeswap/localization'
import { CheckmarkIcon, Flex, Skeleton, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import { activeCampaigns } from '../ProviderCampaign/ProviderCampaign'

type BadgeProps = {
  selectedQuote?: OnRampProviderQuote
  quotes?: OnRampProviderQuote[]
  loading: boolean
}

export const QuoteBadge = ({ quotes, selectedQuote, loading }: BadgeProps) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const isBestQuote = Boolean(selectedQuote === quotes?.[0] && !loading)
  const isCampaign = Boolean(selectedQuote && activeCampaigns[selectedQuote.provider])

  const text = useMemo(() => {
    if (isCampaign) return t('No Fees')
    if (isBestQuote) return isMobile ? t('Best') : t('Best quote')
    return ''
  }, [isBestQuote, t, isMobile, isCampaign])

  if (!isBestQuote && !isCampaign) return null
  return (
    <>
      {loading ? (
        <Skeleton width={70} height={17} isDark />
      ) : (
        <Flex
          alignItems="center"
          px={2}
          py={1}
          background={isCampaign ? theme.colors.warning : theme.colors.success}
          borderRadius={7}
          mx="4px"
        >
          <Text
            ellipsis
            fontSize="11px"
            textAlign="left"
            color={theme.colors.background}
            lineHeight="11px"
            fontWeight="bold"
            mx="4px"
          >
            {text}
          </Text>
          <CheckmarkIcon width={13} height={13} color={theme.colors.background} />
        </Flex>
      )}
    </>
  )
}
