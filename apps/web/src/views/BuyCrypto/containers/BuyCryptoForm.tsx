import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, AutoRow, Box, Flex, Link, Row, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import type { OnRampProviderQuote } from 'views/BuyCrypto/types'
import { BuyCryptoSelector } from '../components/OnRampCurrencySelect'
import { OnRampFlipButton } from '../components/OnRampFlipButton/OnRampFlipButton'
import { PopOverScreenContainer } from '../components/PopOverScreen/PopOverScreen'
import { ProviderGroupItem } from '../components/ProviderSelector/ProviderGroupItem'
import { ProviderSelector } from '../components/ProviderSelector/ProviderSelector'
import { TransactionFeeDetails } from '../components/TransactionFeeDetails/TransactionFeeDetails'
import {
  fiatCurrencyMap,
  formatQuoteDecimals,
  getOnRampCryptoById,
  getOnRampFiatById,
  onRampCurrenciesMap,
} from '../constants'
import { useBtcAddressValidator, type GetBtcAddrValidationReturnType } from '../hooks/useBitcoinAddressValidator'
import { useLimitsAndInputError } from '../hooks/useOnRampInputError'
import { useOnRampQuotes } from '../hooks/useOnRampQuotes'
import InputExtended, { StyledVerticalLine } from '../styles'
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
    independentField,
    inputFlowType,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useBuyCryptoState()

  const theme = useTheme()
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const bestQuoteRef = useRef<OnRampProviderQuote | undefined>(undefined)
  const externalTxIdRef = useRef(v4())

  const [showProivdersPopOver, setShowProvidersPopOver] = useState<boolean>(false)
  const [selectedQuote, setSelectedQuote] = useState<OnRampProviderQuote | undefined>(undefined)
  const { onUserInput, onCurrencySelection } = useBuyCryptoActionHandlers()

  const isFiatFlow = Boolean(inputFlowType === 'fiat')

  const cryptoCurrency = useMemo(() => {
    if (!inputCurrencyId || !outputCurrencyId) return onRampCurrenciesMap.BNB_56
    const isInputAFiat = Object.keys(fiatCurrencyMap).includes(inputCurrencyId)
    const currencyId = isInputAFiat ? outputCurrencyId : inputCurrencyId
    return getOnRampCryptoById(currencyId)
  }, [inputCurrencyId, outputCurrencyId])

  const fiatCurrency = useMemo(() => {
    if (!inputCurrencyId || !outputCurrencyId) return fiatCurrencyMap.BNB_56
    const isInputAFiat = Object.keys(fiatCurrencyMap).includes(inputCurrencyId)
    const currencyId = isInputAFiat ? inputCurrencyId : outputCurrencyId
    return getOnRampFiatById(currencyId)
  }, [inputCurrencyId, outputCurrencyId])

  const inputCurrency = isFiatFlow ? fiatCurrency : cryptoCurrency
  const outputCurrency = isFiatFlow ? cryptoCurrency : fiatCurrency

  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  const isBtc = Boolean(inputCurrencyId === 'BTC_0')
  const isTypingInput = independentField === Field.INPUT
  // const isTypingOutput = independentField === Field.OUTPUT

  const outputValue = useMemo(() => {
    const formattedQuote = formatQuoteDecimals(selectedQuote?.quote, typedValue)
    return isTypingInput ? typedValue : formattedQuote
  }, [typedValue, isTypingInput, selectedQuote])

  const inputValue = useMemo(() => {
    const formattedQuote = formatQuoteDecimals(selectedQuote?.quote, typedValue)
    return isTypingInput ? formattedQuote : typedValue
  }, [typedValue, isTypingInput, selectedQuote])

  const btcValidationResults = useBtcAddressValidator({ address: searchQuery })
  const { data: validAddress, isError: btcError } = btcValidationResults
  const addressError = Boolean(btcError || (isBtc && !validAddress?.result))

  const { inputError, defaultAmt, amountError } = useLimitsAndInputError({
    typedValue: typedValue!,
    cryptoCurrency,
    fiatCurrency,
    isFiatFlow,
  })
  const { data, isFetching, isError, refetch } = useOnRampQuotes({
    cryptoCurrency: cryptoCurrency?.symbol,
    fiatCurrency: fiatCurrency?.symbol,
    network: cryptoCurrency?.chainId,
    fiatAmount: typedValue || defaultAmt,
    enabled: Boolean(!inputError),
  })

  const quotes = data?.quotes
  const quotesError = data?.quotesError

  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  const resetBuyCryptoState = useCallback(() => {
    setSearchQuery('')
    handleTypeInput(defaultAmt)
  }, [handleTypeInput, defaultAmt])

  useEffect(() => {
    if (!quotes || quotes?.length === 0) return
    setSelectedQuote(quotes[0])
    if (bestQuoteRef.current !== quotes[0]) {
      bestQuoteRef.current = quotes[0]
      setSelectedQuote(quotes[0])
    }
  }, [quotes])

  useEffect(() => {
    if (!defaultAmt) return
    handleTypeOutput(defaultAmt)
    handleTypeInput(defaultAmt)
  }, [defaultAmt, handleTypeOutput, handleTypeInput])

  return (
    <AutoColumn position="relative">
      <Flex justifyContent="space-between" alignItems="center">
        <FormHeader title={t('Buy Crypto')} subTitle={t('Buy crypto in just a few clicks')} />
        <OnRampFlipButton refetch={refetch} />
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
        <StyledVerticalLine />

        <BuyCryptoSelector
          id="onramp-fiat"
          onCurrencySelect={onCurrencySelection}
          selectedCurrency={outputCurrency}
          currencyLoading={Boolean(!outputCurrency)}
          value={outputValue || ''}
          onUserInput={handleTypeInput}
          error={Boolean(inputError)}
          disableInput={false}
        />
        <BuyCryptoSelector
          id="onramp-crypto"
          onCurrencySelect={onCurrencySelection}
          onUserInput={handleTypeOutput}
          selectedCurrency={inputCurrency}
          currencyLoading={Boolean(!inputCurrency)}
          value={inputError || quotesError ? '' : inputValue ?? ''}
          disableInput
        />
        <BitcoinAddressInput
          isBtc={isBtc}
          searchQuery={searchQuery}
          handleInput={handleInput}
          validAddress={validAddress}
        />
        <ProviderSelector
          id="provider-select"
          onQuoteSelect={setShowProvidersPopOver}
          selectedQuote={selectedQuote || bestQuoteRef.current}
          quoteLoading={Boolean(isFetching || inputError || quotesError)}
          quotes={quotes}
        />

        <TransactionFeeDetails
          selectedQuote={selectedQuote}
          currency={cryptoCurrency}
          independentField={independentField}
          inputError={inputError}
          quotesError={quotesError}
        />

        <Box>
          <FiatOnRampModalButton
            externalTxIdRef={externalTxIdRef}
            cryptoCurrency={inputCurrencyId}
            selectedQuote={selectedQuote}
            disabled={Boolean(isError || quotesError || inputError || addressError)}
            loading={Boolean(quotesError || isFetching)}
            input={searchQuery}
            resetBuyCryptoState={resetBuyCryptoState}
            btcAddress={debouncedQuery}
            errorText={amountError}
          />
          <Flex alignItems="center" justifyContent="center">
            <Text color="textSubtle" fontSize="14px" px="4px" textAlign="center">
              {t('By continuing you agree to our')}{' '}
            </Text>
            <Link
              color={theme.colors.primary}
              style={{ color: `${theme.colors.primary}` }}
              display="flex"
              fontSize="14px"
              href="https://pancakeswap.finance/terms-of-service"
              referrerPolicy="no-referrer"
              target="_blank"
            >
              {t('terms of service')}
            </Link>
          </Flex>
        </Box>
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
    setShowProvidersPopOver((p) => !p)
  }, [setShowProvidersPopOver])

  const onQuoteSelect = useCallback(
    (quote: OnRampProviderQuote) => {
      setShowProvidersPopOver((p) => !p)
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
          quotes.map((quote) => {
            return (
              <ProviderGroupItem
                key={quote.provider}
                id={`provider-select-${quote.provider}`}
                onQuoteSelect={onQuoteSelect}
                quotes={quotes}
                selectedQuote={selectedQuote || quotes[0]}
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

const BitcoinAddressInput = ({
  isBtc,
  handleInput,
  searchQuery,
  validAddress,
}: {
  isBtc: boolean
  searchQuery: string
  validAddress: GetBtcAddrValidationReturnType | undefined
  handleInput: (event) => void
}) => {
  const inputRef = useRef<HTMLInputElement>()
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()

  useEffect(() => {
    if (!isMobile) inputRef.current?.focus()
  }, [isMobile])

  return (
    <Row height="56px" display={isBtc ? 'block' : 'none'} zIndex="50">
      <InputExtended
        height="56px"
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
  )
}
