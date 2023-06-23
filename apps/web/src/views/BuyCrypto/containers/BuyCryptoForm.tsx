import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { ArrowDownIcon, Box, Text } from '@pancakeswap/uikit'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import {
  calculateDefaultAmount,
  fetchMinimumBuyAmount,
  useBuyCryptoActionHandlers,
  useBuyCryptoErrorInfo,
} from 'state/buyCrypto/hooks'
import { useOnRampCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'
import toString from 'lodash/toString'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { FormHeader } from './FormHeader'
import { FormContainer } from '../components/FormContainer'
import AssetSelect from '../components/AssetSelect'
import GetQuotesButton from '../components/GetQuotesButton'
import { fiatCurrencyMap } from '../constants'

const CenterWrapper = styled.div`
  position: absolute;
  left: 48.5%;
  top: 33%;
`

// Since getting a quote with a number with more than 2 decimals (e.g., 123.121212),
// the quote provider won't return a quote. Therefore, we restrict the fiat currency input to a maximum of 2 decimals.
const allowTwoDecimalRegex = RegExp(`^\\d+(\\.\\d{0,2})?$`)

export function BuyCryptoForm({
  setModalView,
  modalView,
  buyCryptoState,
  fetchQuotes,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  modalView: CryptoFormView
  buyCryptoState: BuyCryptoState
  fetchQuotes: () => Promise<void>
}) {
  const { t } = useTranslation()
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    minAmount,
    minBaseAmount,
    maxAmount,
    maxBaseAmount,
  } = buyCryptoState

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
    <>
      <FormHeader title={t('Buy Crypto')} subTitle={t('Buy crypto in just a few clicks')} />
      <FormContainer>
        <Box>
          <CurrencyInputPanel
            hideBalanceComp
            id="onramp-input"
            showMaxButton={false}
            value={typedValue}
            currency={outputCurrency}
            onUserInput={handleTypeOutput}
            onCurrencySelect={handleOutputSelect}
            error={Boolean(error)}
            showCommonBases={false}
            tokensToShow={fiatCurrencyMap as any}
            title={
              <Text px="4px" bold fontSize="12px" textTransform="uppercase" color="secondary">
                {t('I want to spend')}
              </Text>
            }
          />
          {error ? (
            <Text py="8px" fontSize="12px" color="red">
              {error}
            </Text>
          ) : null}
        </Box>
        <CenterWrapper>
          <ArrowDownIcon className="icon-down" color="primary" width="22px" />
        </CenterWrapper>

        <AssetSelect onCurrencySelect={handleInputSelect} currency={inputCurrency} />
        <Text color="textSubtle" fontSize="14px" px="4px">
          {t('Proceed to get live aggregated quotes from a variety of different fiat onramp providers.')}
        </Text>
        <GetQuotesButton
          errorText={inputError}
          modalView={modalView}
          setModalView={setModalView}
          fetchQuotes={fetchQuotes}
        />
      </FormContainer>
    </>
  )
}
