import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDownIcon,
  ArrowDropDownIcon,
  AutoColumn,
  Box,
  BoxProps,
  Button,
  CheckmarkIcon,
  Flex,
  Skeleton,
  SkeletonText,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { styled, useTheme } from 'styled-components'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import OnRampProviderLogo from '../OnRampProviderLogo/OnRampProviderLogo'

const DropDownContainer = styled.div<{ error: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  box-shadow: ${({ theme, error }) => (error ? theme.shadows.danger : theme.shadows.inset)};
  border: 1px solid ${({ theme, error }) => (error ? theme.colors.failure : theme.colors.inputSecondary)};
  border-radius: 16px;
  background: ${({ theme }) => theme.colors.input};
  cursor: pointer;
  position: relative;
  min-width: 136px;
  user-select: none;
  z-index: 20;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 168px;
  }
`

const OptionSelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })`
  padding: 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0px;
  background-color: transparent !important;
`

interface ProviderSelectorProps extends BoxProps {
  id: string
  quoteLoading: boolean
  selectedQuote: OnRampProviderQuote | undefined
  quotes: OnRampProviderQuote[] | undefined

  onQuoteSelect?: (q: boolean) => void
  error?: boolean
  errorText?: string
  disabled?: boolean
  loading?: boolean
}

type BadgeProps = { isBestQuote: boolean; text: string; loading: boolean }

const QuoteBadge = ({ isBestQuote, text, loading }: BadgeProps) => {
  const theme = useTheme()
  const Icon = isBestQuote ? CheckmarkIcon : ArrowDownIcon
  const bg = isBestQuote ? theme.colors.success : theme.colors.failure

  return (
    <>
      {loading ? (
        <Skeleton width={70} height={17} isDark />
      ) : (
        <Flex alignItems="center" pl={2} pr={1} py={0.5} background={bg} borderRadius={7} mx="4px">
          <Text
            ellipsis
            fontSize="11px"
            textAlign="left"
            color={theme.colors.background}
            lineHeight="11px"
            fontWeight="bold"
          >
            {text}
          </Text>
          <Icon width={13} height={13} color={theme.colors.background} />
        </Flex>
      )}
    </>
  )
}

export const percentageDifference = (last: number | undefined, current: number | undefined) => {
  if (!last || !current) return 0
  const difference = current - last
  const percentageIncrease = (difference / last) * 100
  return percentageIncrease.toFixed(3)
}

export const ProviderSelector = ({
  onQuoteSelect,
  selectedQuote,
  quoteLoading,
  error,
  quotes,
  ...props
}: ProviderSelectorProps) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const isBestQuote = Boolean(selectedQuote === quotes?.[0] && !quoteLoading)
  const differenceFromBest = percentageDifference(quotes?.[0]?.quote, selectedQuote?.quote)

  const quoteText = useMemo(() => {
    if (isBestQuote) return isMobile ? t('Best') : t('Best price')
    if (error) return t('quote unavailable')
    return t('%change% %', { change: differenceFromBest })
  }, [isBestQuote, differenceFromBest, t, error, isMobile])

  return (
    <Box width="100%" {...props}>
      <DropDownContainer error={error as any}>
        <OptionSelectButton
          width="100%"
          className="open-currency-select-button"
          selected={!!selectedQuote}
          onClick={() => onQuoteSelect?.(true)}
          disabled={quoteLoading}
        >
          <Flex alignItems="center" width="100%">
            <OnRampProviderLogo size={32} provider={selectedQuote?.provider} loading={quoteLoading} />
            <AutoColumn px="12px" justifyContent="flex-start" alignItems="flex-start" gap="2px">
              <SkeletonText
                initialHeight={13}
                initialWidth={70}
                loading={quoteLoading}
                fontSize="18px"
                fontWeight={600}
                textAlign="left"
                lineHeight="18px"
                ellipsis
              >
                {t('%provider%', { provider: selectedQuote?.provider })}
              </SkeletonText>
              <SkeletonText
                loading={quoteLoading}
                initialHeight={13}
                initialWidth={70}
                fontSize="12px"
                textAlign="left"
                color="textSubtle"
                lineHeight="12px"
                ellipsis
              >
                {selectedQuote &&
                  t('1 %asset% = %amount%', {
                    amount: formatLocaleNumber({
                      number: Number(selectedQuote.price.toFixed(2)),
                      locale,
                      options: { currency: selectedQuote.fiatCurrency, style: 'currency' },
                    }),
                    asset: selectedQuote.cryptoCurrency,
                  })}
              </SkeletonText>
            </AutoColumn>
          </Flex>

          <Flex>
            <QuoteBadge isBestQuote={isBestQuote} text={quoteText} loading={quoteLoading} />
            {!quoteLoading && <ArrowDropDownIcon />}
          </Flex>
        </OptionSelectButton>
      </DropDownContainer>
    </Box>
  )
}
