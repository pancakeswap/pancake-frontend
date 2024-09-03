import { useTranslation } from '@pancakeswap/localization'
import { ArrowDropDownIcon, AutoColumn, Box, BoxProps, Button, Flex, SkeletonText } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
import OnRampProviderLogo from '../OnRampProviderLogo/OnRampProviderLogo'
import { QuoteBadge } from './QuoteBadge'

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

  return (
    <Box width="100%" {...props}>
      <DropDownContainer error={error as any}>
        <OptionSelectButton
          width="100%"
          className="open-currency-select-button"
          selected={!!selectedQuote}
          onClick={() => onQuoteSelect?.(true)}
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
            <QuoteBadge quotes={quotes} selectedQuote={selectedQuote} loading={quoteLoading} />
            {!quoteLoading && <ArrowDropDownIcon />}
          </Flex>
        </OptionSelectButton>
      </DropDownContainer>
    </Box>
  )
}
