import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDownIcon,
  AutoColumn,
  Box,
  BoxProps,
  Button,
  CheckmarkIcon,
  Flex,
  Skeleton,
  SkeletonText,
  Text,
} from '@pancakeswap/uikit'
import { ReactNode, useMemo } from 'react'
import { styled, useTheme } from 'styled-components'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import OnRampProviderLogo from '../OnRampProviderLogo/OnRampProviderLogo'

const DropDownContainer = styled.div<{ error: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;

  border-radius: 16px;

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
`

interface ProviderGroupItemProps extends BoxProps {
  onQuoteSelect: (quote: OnRampProviderQuote) => void
  quoteLoading: boolean
  selectedQuote: OnRampProviderQuote
  quotes: OnRampProviderQuote[]
  currentQuote: OnRampProviderQuote
  error?: boolean
  errorText?: string
  onInputBlur?: () => void
  disabled?: boolean
  loading?: boolean
  topElement?: ReactNode
  bottomElement?: ReactNode
}

type BadgeProps = { isBestQuote: boolean; text: string; loading: boolean }

const QuoteBadge = ({ isBestQuote, text, loading }: BadgeProps) => {
  const theme = useTheme()
  const Icon = isBestQuote ? CheckmarkIcon : ArrowDownIcon
  const bg = isBestQuote ? theme.colors.success : theme.colors.failure

  return (
    <>
      {loading ? (
        <Skeleton width={40} height={17} isDark />
      ) : (
        <Flex alignItems="center" pl={2} pr={1} py={1} background={bg} borderRadius={9} mx="4px">
          <Text fontSize="11px" textAlign="left" color={theme.colors.background} lineHeight="11px" fontWeight="600">
            {text}
          </Text>
          <Icon width={13} height={13} color={theme.colors.background} />
        </Flex>
      )}
    </>
  )
}

export const percentageDifference = (last: number, current: number) => {
  const difference = current - last
  const percentageIncrease = (difference / last) * 100
  return percentageIncrease.toFixed(3)
}

export const ProviderGroupItem = ({
  onQuoteSelect,
  selectedQuote,
  quoteLoading,
  topElement,
  error,
  quotes,
  currentQuote,
  bottomElement,
  ...props
}: ProviderGroupItemProps) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const isBestQuote = Boolean(quotes?.[0] === currentQuote && !quoteLoading)
  const differenceFromBest = percentageDifference(quotes?.[0]?.quote, currentQuote?.quote)

  const quoteText = useMemo(() => {
    if (isBestQuote) return t('Best price')
    if (error) return t('quote unavailable')
    return t('%change% %', { change: differenceFromBest })
  }, [isBestQuote, differenceFromBest, t, error])

  return (
    <Box width="100%" {...props}>
      <Flex justifyContent="space-between" py="12px" width="100%" alignItems="center">
        {topElement}
      </Flex>
      <DropDownContainer error={error as any}>
        <OptionSelectButton
          width="100%"
          className="open-currency-select-button"
          selected={!!selectedQuote}
          onClick={() => onQuoteSelect(currentQuote)}
          disabled={quoteLoading}
        >
          <Flex>
            <OnRampProviderLogo size={38} provider={currentQuote?.provider} loading={quoteLoading} />
            <AutoColumn px="12px" justifyContent="flex-start" alignItems="flex-start" gap="2px">
              <SkeletonText
                initialHeight={13}
                initialWidth={70}
                loading={quoteLoading}
                fontSize="19px"
                fontWeight={600}
                textAlign="left"
                lineHeight="20px"
              >
                {t('%provider%', { provider: currentQuote?.provider })}
              </SkeletonText>
              <SkeletonText
                loading={quoteLoading}
                initialHeight={13}
                initialWidth={70}
                fontSize="15px"
                textAlign="left"
                color="textSubtle"
                lineHeight="14px"
              >
                {t('1 %asset% = %amount%', {
                  amount: formatLocaleNumber({
                    number: Number(currentQuote.price.toFixed(2)),
                    locale,
                    options: { currency: currentQuote.fiatCurrency, style: 'currency' },
                  }),
                  asset: currentQuote.cryptoCurrency,
                })}
              </SkeletonText>
            </AutoColumn>
          </Flex>

          <Flex>
            <QuoteBadge isBestQuote={isBestQuote} text={quoteText} loading={quoteLoading} />
          </Flex>
        </OptionSelectButton>
      </DropDownContainer>
      <Flex justifyContent="space-between" pt="6px" width="100%" alignItems="center">
        {bottomElement}
      </Flex>
    </Box>
  )
}
