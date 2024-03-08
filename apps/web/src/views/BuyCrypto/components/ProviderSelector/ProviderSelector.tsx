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
} from '@pancakeswap/uikit'
import { ReactNode, useMemo } from 'react'
import { styled, useTheme } from 'styled-components'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import OnRampProviderLogo from '../OnRampProviderLogo/OnRampProviderLogo'

const DropDownContainer = styled.div<{ error: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 12px;
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
        <Flex alignItems="center" pl={2} pr={1} py={0.5} background={bg} borderRadius={7} mx="4px">
          <Text fontSize="11px" textAlign="left" color={theme.colors.background} lineHeight="11px" fontWeight="bold">
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
  topElement,
  error,
  quotes,
  bottomElement,
  ...props
}: ProviderSelectorProps) => {
  const { t } = useTranslation()
  const isBestQuote = Boolean(selectedQuote === quotes?.[0] && !quoteLoading)
  const differenceFromBest = percentageDifference(selectedQuote?.quote, quotes?.[0]?.quote)

  const quoteText = useMemo(() => {
    if (isBestQuote) return t('Best price')
    if (error) return t('quote unavailable')
    return t('%change% %', { change: differenceFromBest })
  }, [isBestQuote, differenceFromBest, t, error])

  return (
    <Box width="100%" {...props}>
      <Flex justifyContent="space-between" py="4px" width="100%" alignItems="center">
        {topElement}
      </Flex>
      <DropDownContainer error={error as any}>
        <OptionSelectButton
          width="100%"
          className="open-currency-select-button"
          selected={!!selectedQuote}
          onClick={() => onQuoteSelect?.(true)}
          disabled={quoteLoading}
        >
          <Flex>
            <OnRampProviderLogo size={32} provider={selectedQuote?.provider} loading={quoteLoading} />
            <AutoColumn px="12px" justifyContent="flex-start" alignItems="flex-start" gap="2px">
              <SkeletonText
                initialHeight={13}
                initialWidth={70}
                loading={quoteLoading}
                fontSize="18px"
                fontWeight={600}
                textAlign="left"
                lineHeight="16px"
              >
                {t('%provider%', { provider: selectedQuote?.provider })}
              </SkeletonText>
              <SkeletonText
                loading={quoteLoading}
                initialHeight={13}
                initialWidth={70}
                fontSize="14px"
                textAlign="left"
                color="textSubtle"
                lineHeight="14px"
              >
                {t('%amount% %asset%', {
                  amount: selectedQuote?.quote.toFixed(5),
                  asset: selectedQuote?.cryptoCurrency,
                })}
              </SkeletonText>
            </AutoColumn>
          </Flex>

          <Flex>
            <QuoteBadge isBestQuote={isBestQuote} text={quoteText} loading={quoteLoading} />
            <ArrowDropDownIcon />
          </Flex>
        </OptionSelectButton>
      </DropDownContainer>
      <Flex justifyContent="space-between" width="100%" alignItems="center">
        {bottomElement}
      </Flex>
    </Box>
  )
}
