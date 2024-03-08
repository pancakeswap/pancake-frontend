import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { bscTokens } from '@pancakeswap/tokens'
import {
  AutoColumn,
  AutoRow,
  Box,
  Column,
  Flex,
  Message,
  RefreshIcon,
  Row,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import { FiatCurrency, OnRampProviderQuote } from 'views/BuyCrypto/types'
import { useChainId } from 'wagmi'
import { BuyCryptoSelector } from '../components/OnRampCurrencySelect'
import { PopOverScreenContainer } from '../components/PopOverScreen/PopOverScreen'
import { ProviderGroupItem } from '../components/ProviderSelector/ProviderGroupItem'
import { ProviderSelector } from '../components/ProviderSelector/ProviderSelector'
import { TransactionFeeDetails } from '../components/TransactionFeeDetails/TransactionFeeDetails'
import {
  OnRampChainId as ChainId,
  fiatCurrencyMap,
  getChainCurrencyWarningMessages,
  onRampCurrenciesMap,
} from '../constants'
import { useBtcAddressValidator } from '../hooks/useBitcoinAddressValidtor'
import { useLimitsAndInputError } from '../hooks/useOnRampInputError'
import { useOnRampQuotes } from '../hooks/useOnRampQuotes'
import InputExtended from '../styles'
import { FormContainer } from './FormContainer'
import { FormHeader } from './FormHeader'

interface OnRampCurrencySelectPopOverProps {
  quotes: OnRampProviderQuote[] | undefined
  selectedQuote: OnRampProviderQuote | undefined
  isFetching: boolean
  isError: boolean
  inputError: string | undefined
  setSelectedQuote: (quote: OnRampProviderQuote) => void
  setShowProvidersPopOver: any
  showProivdersPopOver: boolean
}

export function BuyCryptoForm() {
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoState()

  const theme = useTheme()
  const chainId = useChainId()
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)
  const { isMobile } = useMatchBreakpoints()

  const bestQuoteRef = useRef<OnRampProviderQuote | undefined>(undefined)
  const externalTxIdRef = useRef(v4())

  const [showProivdersPopOver, setShowProvidersPopOver] = useState<boolean>(false)
  const [selectedQuote, setSelectedQuote] = useState<OnRampProviderQuote | undefined>(undefined)
  const { onFieldAInput: handleTypeOutput, onCurrencySelection } = useBuyCryptoActionHandlers()

  const inputCurrency: Currency = useMemo(() => {
    if (!inputCurrencyId) return onRampCurrenciesMap.BNB_56
    return onRampCurrenciesMap[inputCurrencyId]
  }, [inputCurrencyId])

  console.log(inputCurrencyId, inputCurrency)
  const isBtc = Boolean(inputCurrencyId === 'BTC_0')

  const outputCurrency: FiatCurrency = useMemo(() => {
    if (!outputCurrencyId) return fiatCurrencyMap.USD
    return fiatCurrencyMap[outputCurrencyId]
  }, [outputCurrencyId])

  const { inputError, defaultAmt } = useLimitsAndInputError({
    typedValue: typedValue!,
    cryptoCurrency: inputCurrency!,
    fiatCurrency: outputCurrency,
  })

  const {
    data: validAddress,
    isFetching: fetching,
    isError: error,
  } = useBtcAddressValidator({
    address: searchQuery,
    network: 'mainnet',
    currency: inputCurrency,
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
    fiatAmount: typedValue || defaultAmt,
    enabled: Boolean(!inputError && typedValue !== '0'),
  })

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    if (!isMobile) inputRef.current?.focus()
  }, [isMobile])

  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  const resetBuyCryptoState = useCallback(() => {
    setSearchQuery('')
    onCurrencySelection(Field.INPUT, bscTokens.bnb)
    setSelectedQuote(undefined)
    handleTypeOutput('300')
  }, [onCurrencySelection, setSelectedQuote, setSearchQuery, handleTypeOutput])

  useEffect(() => {
    if (!quotes) return
    setSelectedQuote(quotes[0])
    if (bestQuoteRef.current !== quotes[0]) {
      bestQuoteRef.current = quotes[0]
      setSelectedQuote(quotes[0])
    }
  }, [quotes])

  useEffect(() => {
    if (!defaultAmt) return
    handleTypeOutput(defaultAmt)
  }, [defaultAmt, handleTypeOutput])

  return (
    <AutoColumn position="relative">
      <Flex justifyContent="space-between" alignItems="center">
        <FormHeader title={t('Buy Crypto')} subTitle={t('Buy crypto in just a few clicks')} />
        <Box p="24px" mb="18px">
          <RefreshIcon width="24px" height="24px" color="primary" onClick={refetch as unknown as any} />
        </Box>
      </Flex>
      <OnRampCurrencySelectPopOver
        quotes={quotes}
        selectedQuote={selectedQuote}
        isError={isError}
        inputError={inputError}
        isFetching={isFetching}
        setSelectedQuote={setSelectedQuote}
        setShowProvidersPopOver={setShowProvidersPopOver}
        showProivdersPopOver={showProivdersPopOver}
      />
      <FormContainer>
        <Box>
          <BuyCryptoSelector
            id="onramp-fiat"
            onCurrencySelect={onCurrencySelection}
            selectedCurrency={outputCurrency as Currency}
            topElement={
              <Text pl="8px" fontSize="14px" color="textSubtle">
                {t('I want to spend')}
              </Text>
            }
            currencyLoading={Boolean(!inputCurrency)}
            value={typedValue ?? ''}
            onUserInput={handleTypeOutput}
            loading={Boolean(fetching || isFetching || !quotes)}
            error={Boolean(error || isError || inputError)}
            bottomElement={
              <Text px="8px" pb="6px" fontSize="12px" color={theme.colors.failure}>
                {inputError}
              </Text>
            }
          />
          <BuyCryptoSelector
            id="onramp-crypto"
            onCurrencySelect={onCurrencySelection}
            selectedCurrency={inputCurrency as Currency}
            topElement={
              <Text pl="8px" fontSize="14px" color="textSubtle">
                {t('I want to buy')}
              </Text>
            }
            currencyLoading={Boolean(!inputCurrency)}
            bottomElement={<Box pb="12px" />}
            value=""
          />
          {isBtc && (
            <Box pb="16px">
              <Text pl="8px" fontSize="14px" color={validAddress?.result ? 'success' : 'textSubtle'}>
                {t('verify your btc address')}
              </Text>
              <Row height="64px" pt="8px">
                <InputExtended
                  height="60px"
                  id="token-search-input"
                  placeholder={t('paste your BTC address here')}
                  scale="lg"
                  autoComplete="off"
                  value={searchQuery}
                  ref={inputRef as RefObject<HTMLInputElement>}
                  onChange={handleInput}
                  color="primary"
                  isSuccess={Boolean(validAddress?.result)}
                  isWarning={Boolean(searchQuery !== '' && !validAddress?.result)}
                />
              </Row>
            </Box>
          )}

          <ProviderSelector
            id="provider-select"
            onQuoteSelect={setShowProvidersPopOver}
            selectedQuote={selectedQuote ?? bestQuoteRef.current}
            topElement={<Box pt="12px" />}
            bottomElement={<TransactionFeeDetails selectedQuote={selectedQuote} />}
            quoteLoading={isFetching || !quotes}
            quotes={quotes}
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
            externalTxIdRef={externalTxIdRef}
            cryptoCurrency={inputCurrencyId}
            selectedQuote={selectedQuote}
            disabled={isError || Boolean(isBtc && !validAddress?.result)}
            loading={!quotes || isFetching}
            input={searchQuery}
            resetBuyCryptoState={resetBuyCryptoState}
            btcAddress={debouncedQuery}
          />
          <Text color="textSubtle" fontSize="14px" px="4px">
            {t('By continuing you agree to our')}{' '}
            <span style={{ color: `${theme.colors.primary}` }}>{t('cookie policy')}</span>
          </Text>
        </Column>
      </FormContainer>
    </AutoColumn>
  )
}

const OnRampCurrencySelectPopOver = ({
  quotes,
  selectedQuote,
  isFetching,
  isError,
  inputError,
  setSelectedQuote,
  setShowProvidersPopOver,
  showProivdersPopOver,
}: OnRampCurrencySelectPopOverProps) => {
  const { t } = useTranslation()

  const showProvidersOnClick = useCallback(() => {
    setShowProvidersPopOver((p: any) => !p)
  }, [setShowProvidersPopOver])

  const onQuoteSelect = useCallback(
    (quote: OnRampProviderQuote) => {
      setShowProvidersPopOver((p: any) => !p)
      setSelectedQuote(quote)
    },
    [setShowProvidersPopOver, setSelectedQuote],
  )

  return (
    <PopOverScreenContainer showPopover={showProivdersPopOver} onClick={showProvidersOnClick}>
      <AutoRow borderBottom="1" borderColor="cardBorder" paddingX="24px" py="16px">
        <Text fontSize="20px" fontWeight="600">
          {t('Choose a provider')}
        </Text>
      </AutoRow>
      <Box px="8px" pb="20px">
        {quotes &&
          selectedQuote &&
          quotes
            .filter((quote) => !quote.error)
            .map((quote) => {
              return (
                <ProviderGroupItem
                  key={quote.provider}
                  id={`provider-select-${quote.provider}`}
                  onQuoteSelect={onQuoteSelect}
                  quotes={quotes}
                  selectedQuote={selectedQuote ?? quotes[0]}
                  quoteLoading={isFetching || !quotes}
                  error={isError || Boolean(inputError)}
                  currentQuote={quote}
                />
              )
            })}
      </Box>
    </PopOverScreenContainer>
  )
}
