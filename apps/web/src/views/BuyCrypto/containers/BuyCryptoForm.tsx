import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import {
  ArrowDropDownIcon,
  AutoColumn,
  AutoRow,
  Box,
  Column,
  Flex,
  Message,
  RowBetween,
  Text,
} from '@pancakeswap/uikit'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { useOnRampCurrency } from 'hooks/Tokens'
import toString from 'lodash/toString'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { calculateDefaultAmount, useBuyCryptoActionHandlers, useBuyCryptoState } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import styled, { useTheme } from 'styled-components'
import formatLocaleNumber from 'utils/formatLocaleNumber'
import { CryptoFormView, OnRampProviderQuote } from 'views/BuyCrypto/types'
import { useChainId } from 'wagmi'
import { BuyCryptoSelector } from '../components/OnRampCurrencySelect'
import { ProviderGroupItem } from '../components/ProviderSelector/ProviderGroupItem'
import { ProviderSelector } from '../components/ProviderSelector/ProviderSelector'
import BuyCryptoTooltip from '../components/Tooltip/Tooltip'
import { FeeTypes, fiatCurrencyMap, getChainCurrencyWarningMessages, providerFeeTypes } from '../constants'
import { useLimitsAndInputError } from '../hooks/useOnRampInputError'
import { useOnRampQuotes } from '../hooks/useOnRampQuotes'
import { FormContainer } from './FormContainer'
import { FormHeader } from './FormHeader'

const FilterdNetworkWrapper = styled(Flex)<{ showProviders: boolean }>`
  position: absolute;
  width: 100%;
  background: white;
  display: flex;
  flex-direction: column;
  height: 440px;
  z-index: 1000;
  transition: bottom 0.3s ease-in-out;
  bottom: ${({ showProviders }) => (!showProviders ? '-100%' : '-15%')};
  border-top-right-radius: 24px;
  border-top-left-radius: 24px;
  box-shadow: 6px 20px 12px 8px rgba(74, 74, 104, 0.1);
`
const NetworkFilterOverlay = styled(Flex)<{ showProviders: boolean }>`
  position: absolute;
  width: 100%;
  z-index: 1000;

  background-color: #e2d2ff;
  height: 100%;
  transition: opacity 0.2s ease-in-out;
  opacity: ${({ showProviders }) => (!showProviders ? '0' : '0.8')};
  pointer-events: ${({ showProviders }) => (showProviders ? 'auto' : 'none')};
`
export const StyledNotificationWrapper = styled.div<{ show: boolean }>`
  display: flex;
  position: relative;
  overflow: hidden;
  padding: ${({ show }) => (show ? '16px 16px' : '0px 16px')};

  box-shadow: ${({ theme }) => theme.shadows.inset};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 16px;
  background-color: ${({ theme, show }) => (show ? theme.colors.input : 'transparent')};
  width: 100%;

  transition: background-color 0.6s ease, padding 0.3s ease-in-out;
  border-bottom: 1.2px solid ${({ theme }) => theme.colors.cardBorder};
`

export const Description = styled.div<{ show: boolean; elementHeight: number }>`
  overflow: hidden;
  width: 100%;
  word-break: break-word;
  transition: max-height 0.33s ease-in-out;
  max-height: ${({ show, elementHeight }) => (show ? `${elementHeight}px` : '0px')};
`
const StyledFeesContainer = styled(Box)`
  &:hover {
    cursor: pointer;
  }
`

// width: 100%;
// display: flex;
// align-items: center;
// justify-content: space-between;
// padding: 16px 16px;
// box-shadow: ${({ theme, error }) => (error ? theme.shadows.danger : theme.shadows.inset)};
// border: 1px solid ${({ theme, error }) => (error ? theme.colors.failure : theme.colors.inputSecondary)};
// border-radius: 16px;
// background: ${({ theme }) => theme.colors.input};
// cursor: pointer;
// position: relative;
// min-width: 136px;
// user-select: none;
// z-index: 20;

// ${({ theme }) => theme.mediaQueries.sm} {
//   min-width: 168px;
// }
// Since getting a quote with a number with more than 2 decimals (e.g., 123.121212),
// the quote provider won't return a quote. Therefore, we restrict the fiat currency input to a maximum of 2 decimals.
const allowTwoDecimalRegex = RegExp(`^\\d+(\\.\\d{0,2})?$`)
type FeeComponents = { providerFee: number; networkFee: number }

const FeeItem = ({ feeTitle, quote, index }: { feeTitle: FeeTypes; quote: OnRampProviderQuote; index: number }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const theme = useTheme()
  const FeeEstimates: {
    [feeType: string]: <T extends FeeComponents = FeeComponents>(args: T) => number
  } = {
    [FeeTypes.TotalFees]: (args) => args.networkFee + args.providerFee,
    [FeeTypes.NetworkingFees]: (args) => args.networkFee,
    [FeeTypes.ProviderFees]: (args) => args.providerFee,
  }

  return (
    <RowBetween paddingLeft={index > 0 ? '12px' : '0px'}>
      <Flex alignItems="center" justifyContent="center">
        <Flex justifyContent="center" alignItems="center">
          {index > 0 && (
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: `${theme.colors.textSubtle}`,
                marginRight: '2px',
              }}
            />
          )}
          <Text fontSize="14px" color="textSubtle">
            {feeTitle}
          </Text>
        </Flex>
        {feeTitle === FeeTypes.TotalFees && (
          <BuyCryptoTooltip
            opacity={0.7}
            iconSize="17px"
            tooltipText={t('Note that Fees are just an estimation and may vary slightly when completing a purchase')}
          />
        )}
      </Flex>

      <Text ml="4px" fontSize="14px" color="textSubtle">
        {formatLocaleNumber({
          number: FeeEstimates[feeTitle](quote),
          locale,
        })}{' '}
        {quote.fiatCurrency}
      </Text>
    </RowBetween>
  )
}
export function BuyCryptoForm({ setModalView }: { setModalView: Dispatch<SetStateAction<CryptoFormView>> }) {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const chainId = useChainId()
  const [showProivdersPopOver, setShowProvidersPopOver] = useState<boolean>(false)
  const [selectedQuote, setSelectedQuote] = useState<OnRampProviderQuote | undefined>(undefined)
  const theme = useTheme()
  const [show, setShow] = useState<boolean>(false)
  const [elementHeight, setElementHeight] = useState<number>(500)

  const containerRef = useRef(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bestQuoteRef = useRef<OnRampProviderQuote | undefined>(undefined)

  const handleExpandClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement
      if (target.tagName !== 'BUTTON') setShow(!show)
    },
    [show],
  )

  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoState()

  const inputCurrency = useOnRampCurrency(inputCurrencyId)
  const outputCurrency: {
    symbol: string
    name: string
  } = useMemo(() => {
    if (!outputCurrencyId) return fiatCurrencyMap.USD
    return fiatCurrencyMap[outputCurrencyId]
  }, [outputCurrencyId])

  const { baseCurrency, inputError, defaultAmt } = useLimitsAndInputError({
    typedValue: typedValue!,
    cryptoCurrency: inputCurrency!,
    fiatCurrency: outputCurrency,
  })

  const {
    data: quotes,
    isFetching,
    isError,
    refetch,
  } = useOnRampQuotes({
    cryptoCurrency: inputCurrency?.symbol,
    fiatCurrency: outputCurrency?.symbol,
    network: inputCurrency?.chainId,
    fiatAmount: typedValue,
    enabled: !inputError && typedValue !== '0',
  })

  const { onFieldAInput, onCurrencySelection } = useBuyCryptoActionHandlers()
  const handleTypeOutput = useCallback(
    (value: string) => {
      if (value === '' || allowTwoDecimalRegex.test(value)) {
        onFieldAInput(value)
      }
    },
    [onFieldAInput],
  )
  // need to relocate this

  useEffect(() => {
    onFieldAInput(toString(calculateDefaultAmount(Number(defaultAmt), baseCurrency?.code.toUpperCase())))
  }, [onFieldAInput, baseCurrency?.code, defaultAmt])

  const handleCurrencySelect = useCallback(
    (newCurrency: Currency, field: Field) => {
      onCurrencySelection(field, newCurrency)
    },
    [onCurrencySelection],
  )
  const handleInputSelect = useCallback(
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.INPUT),
    [handleCurrencySelect],
  )
  const handleOutputSelect = useCallback(
    (newCurrency: Currency) => handleCurrencySelect(newCurrency, Field.OUTPUT),
    [handleCurrencySelect],
  )

  const showProvidersOnClick = useCallback(() => {
    setShowProvidersPopOver((p) => !p)
  }, [setShowProvidersPopOver])

  const onQuoteSelect = useCallback(
    (quote: OnRampProviderQuote) => {
      setShowProvidersPopOver((p) => !p)
      setSelectedQuote(quote)
    },
    [setShowProvidersPopOver, setSelectedQuote],
  )

  useEffect(() => {
    if (contentRef.current) setElementHeight(contentRef.current.scrollHeight)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!quotes) return
    if (bestQuoteRef.current !== quotes[0]) {
      bestQuoteRef.current = quotes[0]
      setSelectedQuote(quotes[0])
    }
  }, [quotes])
  return (
    <AutoColumn position="relative">
      <NetworkFilterOverlay showProviders={showProivdersPopOver} onClick={showProvidersOnClick} />
      <FilterdNetworkWrapper showProviders={showProivdersPopOver}>
        <FormHeader title={t('Choose a provider')} />
        <Box px="16px" pb="16px">
          {quotes &&
            bestQuoteRef.current &&
            selectedQuote &&
            quotes.map((quote) => {
              return (
                <ProviderGroupItem
                  id={`provider-select-${quote.provider}`}
                  onQuoteSelect={onQuoteSelect}
                  quotes={quotes}
                  selectedQuote={selectedQuote ?? bestQuoteRef.current}
                  quoteLoading={isFetching || !quotes}
                  bottomElement={<></>}
                  error={isError || Boolean(inputError)}
                  currentQuote={quote}
                />
              )
            })}
        </Box>
      </FilterdNetworkWrapper>
      <FormHeader title={t('Buy Crypto')} subTitle={t('Buy crypto in just a few clicks')} />
      <FormContainer>
        <Box>
          <BuyCryptoSelector
            id="onramp-fiat"
            onCurrencySelect={handleOutputSelect}
            selectedCurrency={outputCurrency as Currency}
            showCommonBases={false}
            topElement={
              <Text pl="8px" fontSize="14px" color="textSubtle">
                {t('I want to spend')}
              </Text>
            }
            error={Boolean(inputError)}
            value={typedValue ?? ''}
            onUserInput={handleTypeOutput}
            bottomElement={
              <Text pt="6px" fontSize="12px" color={theme.colors.failure}>
                {inputError}
              </Text>
            }
            currencyLoading={!outputCurrency}
          />
          <BuyCryptoSelector
            id="onramp-crypto"
            onCurrencySelect={handleInputSelect}
            selectedCurrency={inputCurrency as Currency}
            showCommonBases={false}
            topElement={
              <Text pl="8px" fontSize="14px" color="textSubtle">
                {t('I want to buy')}
              </Text>
            }
            currencyLoading={!inputCurrency}
            bottomElement={<Box pb="12px" />}
            value=""
          />
          <ProviderSelector
            id="provider-select"
            onQuoteSelect={showProvidersOnClick}
            selectedQuote={selectedQuote ?? bestQuoteRef.current}
            topElement={
              <AutoRow justifyContent="space-between">
                <Text fontSize="14px" pl="8px" color="textSubtle">
                  {t('total fees: $%fees%', { fees: selectedQuote?.providerFee })}
                </Text>
              </AutoRow>
            }
            bottomElement={
              <>
                <StyledFeesContainer width="100%">
                  <Flex
                    width="100%"
                    height={28}
                    paddingLeft="8px"
                    justifyContent="space-between"
                    alignItems="center"
                    opacity={0.5}
                    onClick={handleExpandClick}
                  >
                    <Text pt="6px" pb="6px" fontSize="14px" color="text3">
                      {t('Transaction details')}
                    </Text>
                    <ArrowDropDownIcon />
                  </Flex>
                  <StyledNotificationWrapper ref={containerRef} show={show}>
                    <Description ref={contentRef} show={show} elementHeight={elementHeight}>
                      <RowBetween>
                        <Text fontSize="14px">
                          {selectedQuote?.cryptoCurrency} {t('price')}
                        </Text>
                        <Text ml="4px" fontSize="13px">
                          = {formatLocaleNumber({ number: Number(selectedQuote?.price), locale })}{' '}
                          {selectedQuote?.fiatCurrency}
                        </Text>
                      </RowBetween>
                      {selectedQuote &&
                        providerFeeTypes[selectedQuote.provider].map((feeType: FeeTypes, index: number) => {
                          return <FeeItem key={feeType} feeTitle={feeType} quote={selectedQuote} index={index} />
                        })}
                    </Description>
                  </StyledNotificationWrapper>
                </StyledFeesContainer>
              </>
            }
            quoteLoading={isFetching || !quotes}
            quotes={quotes}
            error={isError || Boolean(inputError)}
          />
        </Box>
        {[ChainId.BASE, ChainId.LINEA].includes(chainId) ? (
          <Message variant="warning" padding="16px">
            <Text fontSize="15px" color="#D67E0B">
              {getChainCurrencyWarningMessages(t, chainId)[chainId]}
            </Text>
          </Message>
        ) : null}
        <Column gap="2px" alignItems="center" justifyContent="center">
          <FiatOnRampModalButton
            provider={bestQuoteRef.current?.provider}
            inputCurrency={bestQuoteRef.current?.cryptoCurrency}
            outputCurrency={bestQuoteRef.current?.fiatCurrency}
            amount={bestQuoteRef.current?.amount.toString()}
            disabled={!quotes?.[0] || isFetching || isError}
            setModalView={setModalView}
          />
          <Text color="textSubtle" fontSize="14px" px="4px">
            {t('By continuing you agree to our cookie policy')}
          </Text>
        </Column>
      </FormContainer>
    </AutoColumn>
  )
}
