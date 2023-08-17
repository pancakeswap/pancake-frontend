import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Text, Box } from '@pancakeswap/uikit'
import {
  calculateDefaultAmount,
  fetchMinimumBuyAmount,
  useBuyCryptoActionHandlers,
  useBuyCryptoErrorInfo,
  useBuyCryptoState,
} from 'state/buyCrypto/hooks'
import { useOnRampCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import { useTheme } from 'styled-components'
import toString from 'lodash/toString'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import GetQuotesButton from '../components/GetQuotesButton'
import { fiatCurrencyMap } from '../constants'
import { CurrencySelect } from '../components/OnRampCurrencySelect'

// Since getting a quote with a number with more than 2 decimals (e.g., 123.121212),
// the quote provider won't return a quote. Therefore, we restrict the fiat currency input to a maximum of 2 decimals.
const allowTwoDecimalRegex = RegExp(`^\\d+(\\.\\d{0,2})?$`)

export function BuyCryptoForm({
  setModalView,
  fetchQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  fetchQuotes: () => Promise<void>
}) {
  const { t } = useTranslation()
  const theme = useTheme()
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    minAmount,
    minBaseAmount,
    maxAmount,
    maxBaseAmount,
  } = useBuyCryptoState()

  const { amountError: error, inputError } = useBuyCryptoErrorInfo(
    typedValue,
    minAmount,
    minBaseAmount,
    maxAmount,
    maxBaseAmount,
    outputCurrencyId,
    inputCurrencyId,
  )
  const inputCurrency = useOnRampCurrency(inputCurrencyId)

  const outputCurrency: any = fiatCurrencyMap[outputCurrencyId]
  const { onFieldAInput, onCurrencySelection, onLimitAmountUpdate } = useBuyCryptoActionHandlers()
  const handleTypeOutput = useCallback(
    (value: string) => {
      if (value === '' || allowTwoDecimalRegex.test(value)) {
        onFieldAInput(value)
      }
    },
    [onFieldAInput],
  )
  // need to reloacte this
  const fetchMinBuyAmounts = useCallback(async () => {
    const limitAmounts = await fetchMinimumBuyAmount(outputCurrencyId, inputCurrencyId)

    if (!limitAmounts) return

    onFieldAInput(toString(calculateDefaultAmount(limitAmounts.baseCurrency?.minBuyAmount)))

    onLimitAmountUpdate(
      limitAmounts.baseCurrency?.minBuyAmount,
      limitAmounts.quoteCurrency?.minBuyAmount,
      limitAmounts.baseCurrency?.maxBuyAmount,
      limitAmounts.quoteCurrency?.maxBuyAmount,
    )
  }, [outputCurrencyId, inputCurrencyId, onFieldAInput, onLimitAmountUpdate])

  useEffect(() => {
    fetchMinBuyAmounts()
  }, [fetchMinBuyAmounts])

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

  return (
    <Box p="4px">
      <FormHeader title={t('Buy Crypto')} subTitle={t('Buy crypto in just a few clicks')} />
      <FormContainer>
        <Box>
          <CurrencySelect
            id="onramp-input"
            onCurrencySelect={handleOutputSelect}
            selectedCurrency={outputCurrency as Currency}
            showCommonBases={false}
            topElement={<Text color="textSubtle">{t('I want to spend')}</Text>}
            error={Boolean(error)}
            value={typedValue}
            onUserInput={handleTypeOutput}
            bottomElement={
              <Text pt="6px" pb="12px" fontSize="12px" color={theme.colors.failure}>
                {error}
              </Text>
            }
            currencyLoading={!outputCurrency}
          />
          <CurrencySelect
            id="onramp-output"
            onCurrencySelect={handleInputSelect}
            selectedCurrency={inputCurrency as Currency}
            showCommonBases={false}
            topElement={<Text color="textSubtle">{t('I want to buy')}</Text>}
            currencyLoading={!inputCurrency}
            bottomElement={<></>}
          />
        </Box>
        <Text color="textSubtle" fontSize="14px" px="4px">
          {t('Proceed to get live aggregated quotes from a variety of different fiat onramp providers.')}
        </Text>
        <GetQuotesButton errorText={inputError} setModalView={setModalView} fetchQuotes={fetchQuotes} />
      </FormContainer>
    </Box>
  )
}
