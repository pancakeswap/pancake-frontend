import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, Box, BoxProps, Button, Flex, SkeletonText } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { styled } from 'styled-components'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { ABOUT_EQUAL } from 'views/BuyCrypto/constants'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import OnRampProviderLogo from '../OnRampProviderLogo/OnRampProviderLogo'
import { QuoteBadge } from './QuoteBadge'

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
                {`${ABOUT_EQUAL} ${formatLocaleNumber({
                  number: Number(currentQuote.quote.toFixed(4)),
                  locale,
                })} ${currentQuote.cryptoCurrency}`}
              </SkeletonText>
            </AutoColumn>
          </Flex>

          <Flex>
            <QuoteBadge quotes={quotes} selectedQuote={currentQuote} loading={quoteLoading} />
          </Flex>
        </OptionSelectButton>
      </DropDownContainer>
      <Flex justifyContent="space-between" pt="6px" width="100%" alignItems="center">
        {bottomElement}
      </Flex>
    </Box>
  )
}
