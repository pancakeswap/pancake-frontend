import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, AutoRow, Box, Flex, Link, Row, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Swap as SwapUI } from '@pancakeswap/widgets-internal'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import { OnRampUnit, type OnRampProviderQuote } from 'views/BuyCrypto/types'
import { BuyCryptoSelector } from '../components/OnRampCurrencySelect'
import { OnRampFlipButton } from '../components/OnRampFlipButton/OnRampFlipButton'
import { PopOverScreenContainer } from '../components/PopOverScreen/PopOverScreen'
import { ProviderGroupItem } from '../components/ProviderSelector/ProviderGroupItem'
import { ProviderSelector } from '../components/ProviderSelector/ProviderSelector'
import { TransactionFeeDetails } from '../components/TransactionFeeDetails/TransactionFeeDetails'
import { formatQuoteDecimals, isFiat, onRampCurrenciesMap } from '../constants'
import { useBtcAddressValidator, type GetBtcAddrValidationReturnType } from '../hooks/useBitcoinAddressValidator'
import { useFiatCurrencyAmount } from '../hooks/useDefaultAmount'
import { useIsBtc } from '../hooks/useIsBtc'
import { useOnRampCurrencyOrder } from '../hooks/useOnRampCurrencyOrder'
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
  setShowProvidersPopOver: Dispatch<SetStateAction<boolean>>
  showProivdersPopOver: boolean
}
type InputEvent = ChangeEvent<HTMLInputElement>

export function BuyCryptoForm() {
  const { typedValue, independentField } = useBuyCryptoState()

  const { t } = useTranslation()
  const isBtc = useIsBtc()
  const theme = useTheme()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showProivdersPopOver, setShowProvidersPopOver] = useState<boolean>(false)
  const [selectedQuote, setSelectedQuote] = useState<OnRampProviderQuote | undefined>(undefined)
  const [unit, setUnit] = useState<OnRampUnit>(OnRampUnit.Fiat)

  const bestQuoteRef = useRef<OnRampProviderQuote | undefined>(undefined)
  const debouncedQuery = useDebounce(searchQuery, 200)
  const externalTxIdRef = useRef<string>(v4())

  const { onUserInput, onCurrencySelection, onSwitchTokens } = useBuyCryptoActionHandlers()

  const { cryptoCurrency, fiatCurrency, currencyIn, currencyOut } = useOnRampCurrencyOrder(unit)
  const { data: validAddress, isError: btcError } = useBtcAddressValidator({ address: searchQuery, enabled: isBtc })
  const { fiatValue: defaultAmt } = useFiatCurrencyAmount({ currencyCode: fiatCurrency?.symbol, value_: 150 })

  const { inputError, amountError } = useLimitsAndInputError({
    typedValue: typedValue ?? '',
    cryptoCurrency,
    fiatCurrency,
    unit,
  })

  const { data, isLoading, isError, refetch } = useOnRampQuotes({
    cryptoCurrency: cryptoCurrency?.symbol,
    fiatCurrency: fiatCurrency?.symbol,
    network: cryptoCurrency?.chainId,
    fiatAmount: typedValue,
    onRampUnit: unit,
    enabled: Boolean(!inputError),
  })

  const quotes = useMemo(() => data?.quotes, [data?.quotes])
  const quotesError = useMemo(() => data?.quotesError, [data?.quotesError])

  const outputValue = useMemo((): string | undefined => {
    if (inputError || quotesError || !selectedQuote) return undefined
    const { amount, quote } = selectedQuote
    const output = isFiat(unit) ? quote : amount
    return formatQuoteDecimals(output, unit)
  }, [unit, selectedQuote, inputError, quotesError])

  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  const handleAddressInput = useCallback((event: InputEvent) => setSearchQuery(event.target.value), [])

  const onFlip = useCallback(() => {
    if (!selectedQuote) return
    onSwitchTokens()
    setUnit(isFiat(unit) ? OnRampUnit.Crypto : OnRampUnit.Fiat)

    const fiatAmount = selectedQuote.amount.toFixed(2)
    const quoteAmount = selectedQuote.quote.toFixed(5)

    handleTypeInput(isFiat(unit) ? quoteAmount : fiatAmount)
  }, [onSwitchTokens, unit, selectedQuote, handleTypeInput])

  const resetBuyCryptoState = useCallback(() => {
    if (searchQuery !== '') setSearchQuery('')
    if (unit === OnRampUnit.Crypto) onFlip()
    if (defaultAmt) handleTypeInput(defaultAmt)
    onCurrencySelection(Field.INPUT, onRampCurrenciesMap.BNB_56)
  }, [handleTypeInput, defaultAmt, unit, onFlip, searchQuery, onCurrencySelection])

  useEffect(() => {
    if (!quotes || quotes?.length === 0) return
    setSelectedQuote(quotes[0])
    if (bestQuoteRef.current !== quotes[0]) {
      bestQuoteRef.current = quotes[0]
      setSelectedQuote(quotes[0])
    }
  }, [quotes])

  useEffect(() => {
    if (!defaultAmt || !isFiat(unit)) return
    handleTypeInput(defaultAmt)
  }, [defaultAmt, handleTypeInput, unit])

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
        isFetching={isLoading}
        setSelectedQuote={setSelectedQuote}
        setShowProvidersPopOver={setShowProvidersPopOver}
        showProivdersPopOver={showProivdersPopOver}
      />
      <FormContainer>
        <StyledVerticalLine />

        <BuyCryptoSelector
          id={isFiat(unit) ? 'onramp-fiat' : 'onramp-crypto'}
          onCurrencySelect={onCurrencySelection}
          selectedCurrency={currencyOut}
          currencyLoading={Boolean(!currencyOut)}
          value={typedValue || ''}
          onUserInput={handleTypeInput}
          error={Boolean(inputError)}
          disableInput={false}
          unit={unit}
        />
        <Box width="100%" position="absolute" zIndex="100" left="45%" top="11.7%">
          <SwapUI.SwitchButton onClick={onFlip} />
        </Box>
        <BuyCryptoSelector
          id={isFiat(unit) ? 'onramp-crypto' : 'onramp-fiat'}
          onCurrencySelect={onCurrencySelection}
          selectedCurrency={currencyIn}
          currencyLoading={Boolean(!currencyIn)}
          value={outputValue ?? ''}
          disableInput
          unit={unit}
          inputLoading={Boolean(isLoading || inputError || quotesError)}
        />
        <BitcoinAddressInput
          isBtc={isBtc}
          searchQuery={searchQuery}
          handleInput={handleAddressInput}
          validAddress={validAddress}
        />
        <ProviderSelector
          id="provider-select"
          onQuoteSelect={setShowProvidersPopOver}
          selectedQuote={selectedQuote || bestQuoteRef.current}
          quoteLoading={Boolean(isLoading || inputError || quotesError)}
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
            cryptoCurrency={cryptoCurrency}
            selectedQuote={selectedQuote}
            disabled={Boolean(isError || quotesError || inputError || btcError)}
            loading={Boolean(quotesError || isLoading)}
            resetBuyCryptoState={resetBuyCryptoState}
            btcAddress={debouncedQuery}
            errorText={amountError}
            onRampUnit={unit}
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
    setShowProvidersPopOver((p: boolean) => !p)
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
