import { ChainId } from '@pancakeswap/chains'
import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import {
  AutoColumn,
  AutoRow,
  Box,
  Column,
  Flex,
  Input,
  Message,
  RefreshIcon,
  Row,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { FiatOnRampModalButton } from 'components/FiatOnRampModal/FiatOnRampModal'
import { useOnRampCurrency } from 'hooks/Tokens'
import { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useBuyCryptoActionHandlers, useBuyCryptoState } from 'state/buyCrypto/hooks'
import { Field } from 'state/swap/actions'
import { useTheme } from 'styled-components'
import { safeGetAddress } from 'utils'
import { v4 } from 'uuid'
import { FiatCurrency, OnRampProviderQuote } from 'views/BuyCrypto/types'
import { useChainId } from 'wagmi'
import { BuyCryptoSelector } from '../components/OnRampCurrencySelect'
import { PopOverScreenContainer } from '../components/PopOverScreen/PopOverScreen'
import { ProviderGroupItem } from '../components/ProviderSelector/ProviderGroupItem'
import { ProviderSelector } from '../components/ProviderSelector/ProviderSelector'
import { TransactionFeeDetails } from '../components/TransactionFeeDetails/TransactionFeeDetails'
import { fiatCurrencyMap, getChainCurrencyWarningMessages } from '../constants'
import { useLimitsAndInputError } from '../hooks/useOnRampInputError'
import { useOnRampQuotes } from '../hooks/useOnRampQuotes'
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

  const inputCurrency = useOnRampCurrency(inputCurrencyId)
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
    const checksummedInput = safeGetAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim()
        if (s === 'btc') {
          onCurrencySelection(Field.INPUT, 'native')
        }
      }
    },
    [debouncedQuery, onCurrencySelection],
  )

  useEffect(() => {
    if (!quotes) return
    setSelectedQuote(quotes[0])
    if (bestQuoteRef.current !== quotes[0]) {
      bestQuoteRef.current = quotes[0]
      setSelectedQuote(quotes[0])
    }
  }, [quotes])

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
            currencyLoading={Boolean(!inputCurrency)}
            topElement={
              <Text pl="8px" fontSize="14px" color="textSubtle">
                {t('I want to spend')}
              </Text>
            }
            value={typedValue || defaultAmt}
            onUserInput={handleTypeOutput}
            loading={isFetching || !quotes}
            error={isError || Boolean(inputError)}
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
            currencyLoading={!inputCurrency}
            bottomElement={<Box pb="12px" />}
            value=""
          />
          <Row>
            <Input
              id="token-search-input"
              placeholder={t('paste your BTC address here')}
              scale="lg"
              autoComplete="off"
              value={searchQuery}
              ref={inputRef as RefObject<HTMLInputElement>}
              onChange={handleInput}
              onKeyDown={handleEnter}
            />
          </Row>
          <ProviderSelector
            id="provider-select"
            onQuoteSelect={setShowProvidersPopOver}
            selectedQuote={selectedQuote ?? bestQuoteRef.current}
            topElement={
              <AutoRow justifyContent="space-between">
                <Text fontSize="14px" pl="8px" color="textSubtle">
                  {t('total fees: $%fees%', { fees: selectedQuote?.providerFee })}
                </Text>
              </AutoRow>
            }
            bottomElement={<TransactionFeeDetails selectedQuote={selectedQuote} />}
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
            externalTxIdRef={externalTxIdRef}
            cryptoCurrency={inputCurrencyId}
            selectedQuote={selectedQuote}
            disabled={!quotes || isFetching || isError}
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
      <FormHeader title={t('Choose a provider')} />
      <Box px="16px" pb="16px">
        {quotes &&
          selectedQuote &&
          quotes.map((quote) => {
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
