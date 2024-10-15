import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import {
  AutoColumn,
  AutoRow,
  Box,
  CloseIcon,
  Flex,
  IconButton,
  Link,
  Row,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { Swap as SwapUI } from '@pancakeswap/widgets-internal'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useBuyCryptoActionHandlers } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useTheme } from 'styled-components'
import { v4 } from 'uuid'
import { OnRampUnit, type OnRampProviderQuote } from 'views/BuyCrypto/types'
import OnBoardingView from 'views/Notifications/containers/OnBoardingView'
import { useBuyCryptoFormState } from 'state/buyCrypto/reducer'
import { BuyCryptoSelector } from '../components/OnRampCurrencySelect'
import { OnRampFlipButton } from '../components/OnRampFlipButton/OnRampFlipButton'
import { PopOverScreenContainer } from '../components/PopOverScreen/PopOverScreen'
import ProviderCampaign from '../components/ProviderCampaign/ProviderCampaign'
import { ProviderGroupItem } from '../components/ProviderSelector/ProviderGroupItem'
import { ProviderSelector } from '../components/ProviderSelector/ProviderSelector'
import { TransactionFeeDetails } from '../components/TransactionFeeDetails/TransactionFeeDetails'
import { formatQuoteDecimals, isFiat } from '../constants'
import { useBtcAddressValidator, type GetBtcAddrValidationReturnType } from '../hooks/useBitcoinAddressValidator'
import { useFiatCurrencyAmount } from '../hooks/useDefaultAmount'
import { useIsBtc } from '../hooks/useIsBtc'
import { useOnRampCurrencyOrder } from '../hooks/useOnRampCurrencyOrder'
import { useLimitsAndInputError } from '../hooks/useOnRampInputError'
import { useOnRampQuotes } from '../hooks/useOnRampQuotes'
import type { ProviderAvailabilities } from '../hooks/useProviderAvailabilities'
import InputExtended, { StyledVerticalLine } from '../styles'
import { FormContainer } from './FormContainer'
import { FormHeader } from './FormHeader'

const EnableNotificationsTooltip = lazy(
  () => import('../components/EnableNotificationTooltip/EnableNotificationsTooltip'),
)

interface NotificationsOnboardPopOverProps {
  setShowNotificationsPopOver: Dispatch<SetStateAction<boolean>>
  showNotificationsPopOver: boolean
}

interface OnRampCurrencySelectPopOverProps {
  quotes: OnRampProviderQuote[] | undefined
  selectedQuote: OnRampProviderQuote | undefined
  isFetching: boolean
  isError: boolean
  setSelectedQuote: (quote: OnRampProviderQuote) => void
  setShowProvidersPopOver: Dispatch<SetStateAction<boolean>>
  showProivdersPopOver: boolean
}
type InputEvent = ChangeEvent<HTMLInputElement>

export function BuyCryptoForm({ providerAvailabilities }: { providerAvailabilities: ProviderAvailabilities }) {
  const { typedValue, independentField } = useBuyCryptoFormState()

  const { t } = useTranslation()
  const isBtc = useIsBtc()
  const theme = useTheme()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showProivdersPopOver, setShowProvidersPopOver] = useState<boolean>(false)
  const [showNotificationsPopOver, setShowNotificationsPopOver] = useState<boolean>(false)
  const [selectedQuote, setSelectedQuote] = useState<OnRampProviderQuote | undefined>(undefined)
  const [unit, setUnit] = useState<OnRampUnit>(OnRampUnit.Fiat)

  const bestQuoteRef = useRef<OnRampProviderQuote | undefined>(undefined)
  const debouncedQuery = useDebounce(searchQuery, 200)
  const externalTxIdRef = useRef<string>()

  useEffect(() => {
    externalTxIdRef.current = v4()
  }, [])

  const { onUserInput, onCurrencySelection, onSwitchTokens } = useBuyCryptoActionHandlers()

  const { cryptoCurrency, fiatCurrency, currencyIn, currencyOut } = useOnRampCurrencyOrder(unit)
  const { fiatValue: defaultAmt } = useFiatCurrencyAmount({ currencyCode: fiatCurrency?.symbol, unit })

  const { inputError, amountError } = useLimitsAndInputError({
    typedValue: typedValue ?? '',
    cryptoCurrency,
    fiatCurrency,
    unit,
  })

  const { data: validAddress, isError: btcQueryError } = useBtcAddressValidator({
    address: searchQuery,
    enabled: isBtc,
  })

  const isInValidBtcAddress = useMemo(() => {
    return Boolean(!validAddress?.result && !btcQueryError && isBtc)
  }, [isBtc, btcQueryError, validAddress?.result])

  const {
    data: quotes,
    isLoading,
    isError: quotesError,
    refetch,
  } = useOnRampQuotes({
    cryptoCurrency: cryptoCurrency?.symbol,
    fiatCurrency: fiatCurrency?.symbol,
    network: cryptoCurrency?.chainId,
    fiatAmount: typedValue,
    providerAvailabilities,
    onRampUnit: unit,
    enabled: Boolean(!inputError),
  })

  const outputValue = useMemo(() => {
    if (inputError || !selectedQuote) return undefined
    const output = isFiat(unit) ? selectedQuote.quote : selectedQuote.amount
    return formatQuoteDecimals(output, unit)
  }, [unit, selectedQuote, inputError])

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
  }, [handleTypeInput, defaultAmt, unit, onFlip, searchQuery])

  useEffect(() => {
    if (!quotes || bestQuoteRef.current === quotes[0]) return
    bestQuoteRef.current = quotes[0]
    setSelectedQuote(quotes[0])
  }, [quotes])

  return (
    <AutoColumn position="relative">
      <Flex justifyContent="space-between" alignItems="center">
        <FormHeader title={t('Buy Crypto')} subTitle={t('Buy crypto in just a few clicks')} />
        <OnRampFlipButton refetch={refetch} />
      </Flex>
      <OnRampCurrencySelectPopOver
        quotes={quotes}
        selectedQuote={selectedQuote}
        isError={quotesError || Boolean(inputError)}
        isFetching={isLoading}
        setSelectedQuote={setSelectedQuote}
        setShowProvidersPopOver={setShowProvidersPopOver}
        showProivdersPopOver={showProivdersPopOver}
      />
      <NotificationsOnboardPopover
        setShowNotificationsPopOver={setShowNotificationsPopOver}
        showNotificationsPopOver={showNotificationsPopOver}
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
          fiatCurrency={fiatCurrency}
          error={Boolean(inputError)}
          disableInput={false}
          unit={unit}
        />
        <Box width="100%" position="absolute" zIndex="100" left="45%" top="53px">
          <SwapUI.SwitchButton onClick={onFlip} />
        </Box>
        <BuyCryptoSelector
          id={isFiat(unit) ? 'onramp-crypto' : 'onramp-fiat'}
          inputLoading={Boolean(isLoading || inputError || quotesError)}
          onCurrencySelect={onCurrencySelection}
          selectedCurrency={currencyIn}
          currencyLoading={Boolean(!currencyIn)}
          fiatCurrency={fiatCurrency}
          value={outputValue ?? '0.0'}
          disableInput
          unit={unit}
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
          loading={isLoading}
          quotesError={quotesError}
        />

        <ProviderCampaign />
        <Box>
          {Boolean(!inputError && !isInValidBtcAddress && !quotesError) && (
            <Suspense fallback={null}>
              <EnableNotificationsTooltip
                showNotificationsPopOver={showNotificationsPopOver}
                setShowNotificationsPopOver={setShowNotificationsPopOver}
              />
            </Suspense>
          )}

          <FiatOnRampModalButton
            externalTxIdRef={externalTxIdRef}
            cryptoCurrency={cryptoCurrency}
            selectedQuote={selectedQuote}
            disabled={Boolean(inputError || isInValidBtcAddress || quotesError)}
            loading={isLoading}
            resetBuyCryptoState={resetBuyCryptoState}
            btcAddress={debouncedQuery}
            errorText={quotesError ? t('No Quotes') : amountError}
            onRampUnit={unit}
          />
          <Flex alignItems="center" justifyContent="center">
            <Text color="textSubtle" fontSize="14px" px="4px" textAlign="center">
              {t('By continuing you agree to our')}
            </Text>
            <Link
              color={theme.colors.primary}
              style={{ color: `${theme.colors.primary}` }}
              display="flex"
              fontSize="14px"
              href="https://pancakeswap.finance/terms-of-service"
              external
            >
              {t('terms of service')}
            </Link>
          </Flex>
        </Box>
      </FormContainer>
    </AutoColumn>
  )
}

const NotificationsOnboardPopover = ({
  setShowNotificationsPopOver,
  showNotificationsPopOver,
}: NotificationsOnboardPopOverProps) => {
  const showProvidersOnClick = useCallback(() => {
    setShowNotificationsPopOver((p: boolean) => !p)
  }, [setShowNotificationsPopOver])

  return (
    <PopOverScreenContainer showPopover={showNotificationsPopOver} onClick={showProvidersOnClick}>
      <Box minHeight="552px">
        <AutoRow borderBottom="1" paddingX="8px" justifyContent="flex-end">
          <IconButton onClick={showProvidersOnClick} variant="text">
            <CloseIcon color="primary" />
          </IconButton>
        </AutoRow>

        <OnBoardingView onExternalDismiss={showProvidersOnClick} />
      </Box>
    </PopOverScreenContainer>
  )
}

const OnRampCurrencySelectPopOver = ({
  quotes,
  selectedQuote,
  isFetching,
  isError,
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
      showProvidersOnClick()
      setSelectedQuote(quote)
    },
    [showProvidersOnClick, setSelectedQuote],
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
                error={isError}
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
  const inputRef = useRef<HTMLInputElement>(null)
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
        ref={inputRef}
        onChange={handleInput}
        color="primary"
        isSuccess={Boolean(validAddress?.result)}
        isWarning={Boolean(searchQuery !== '' && !validAddress?.result)}
      />
    </Row>
  )
}
