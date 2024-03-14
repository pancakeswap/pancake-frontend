import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, AutoRow, Box, Flex, Row, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import { OnRampProviderQuote } from 'views/BuyCrypto/types'
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
import { GetBtcAddrValidationReturnType, useBtcAddressValidator } from '../hooks/useBitcoinAddressValidator'
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
  const { data: validAddress, isFetching: fetching, isError: error } = btcValidationResults

  const { inputError, defaultAmt, amountError } = useLimitsAndInputError({
    typedValue: typedValue!,
    cryptoCurrency,
    fiatCurrency,
    isFiatFlow,
  })
  const {
    data: quotes,
    isFetching,
    isError,
    refetch,
  } = useOnRampQuotes({
    cryptoCurrency: cryptoCurrency?.symbol,
    fiatCurrency: fiatCurrency?.symbol,
    network: cryptoCurrency?.chainId,
    fiatAmount: typedValue || defaultAmt,
    enabled: Boolean(!inputError),
    isFiat: 'true',
  })

  const handleInput = useCallback((event) => {
    const input = event.target.value
    setSearchQuery(input)
  }, [])

  const resetBuyCryptoState = useCallback(() => {
    setSearchQuery('')
    handleTypeInput(defaultAmt)
  }, [handleTypeInput, defaultAmt])

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
          id={!isFiatFlow ? 'onramp-fiat' : 'onramp-crypto'}
          onCurrencySelect={onCurrencySelection}
          selectedCurrency={outputCurrency}
          currencyLoading={Boolean(!outputCurrency)}
          value={outputValue || ''}
          onUserInput={handleTypeInput}
          loading={Boolean(fetching || isFetching || !quotes)}
          error={Boolean(error || isError || Boolean(inputError && isTypingInput))}
          disableInput={false}
        />
        <BuyCryptoSelector
          id={!isFiatFlow ? 'onramp-crypto' : 'onramp-fiat'}
          onCurrencySelect={onCurrencySelection}
          onUserInput={handleTypeOutput}
          selectedCurrency={inputCurrency}
          currencyLoading={Boolean(!inputCurrency)}
          value={inputError ? '' : inputValue ?? ''}
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
          quoteLoading={Boolean(isFetching || inputError || !quotes)}
          quotes={quotes}
        />

        <TransactionFeeDetails
          selectedQuote={selectedQuote}
          currency={cryptoCurrency}
          independentField={independentField}
          inputError={inputError}
        />

        <Box>
          <FiatOnRampModalButton
            externalTxIdRef={externalTxIdRef}
            cryptoCurrency={inputCurrencyId}
            selectedQuote={selectedQuote}
            disabled={isError || Boolean(inputError) || Boolean(isBtc && !validAddress?.result)}
            loading={!quotes || isFetching}
            input={searchQuery}
            resetBuyCryptoState={resetBuyCryptoState}
            btcAddress={debouncedQuery}
            errorText={amountError}
          />
          <Text color="textSubtle" fontSize="14px" px="4px" textAlign="center">
            {t('By continuing you agree to our')}{' '}
            <span style={{ color: `${theme.colors.primary}` }}>{t('cookie policy')}</span>
          </Text>
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
  handleInput: (event: any) => void
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
