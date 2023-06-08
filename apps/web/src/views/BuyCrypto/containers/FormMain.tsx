/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { ArrowDownIcon, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { fetchMinimumBuyAmount, useBuyCryptoActionHandlers, useBuyCryptoErrorInfo } from 'state/buyCrypto/hooks'
import { useAllOnRampTokens, useFiatCurrency, useOnRampCurrency } from 'hooks/Tokens'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-cycle
import { BuyCryptoState } from 'state/buyCrypto/reducer'
// eslint-disable-next-line import/no-cycle
import styled from 'styled-components'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '..'
import { FormContainer } from '../components/FormContainer'
import AssetSelect from '../components/AssetSelect'
// eslint-disable-next-line import/no-cycle
import GetQuotesButton from '../components/GetQuotesButton'

const CenterWrapper = styled.div`
  position: absolute;
  left: 48.5%;
  top: 33%;
`
interface Props {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  modalView: CryptoFormView
  buyCryptoState: BuyCryptoState
  fetchQuotes: () => Promise<void>
}

export function FormMain({ setModalView, modalView, buyCryptoState, fetchQuotes }: Props) {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const router = useRouter()
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    minAmount,
    minBaseAmount,
  } = buyCryptoState

  const allC = useAllOnRampTokens()
  const { amountError: error, inputError } = useBuyCryptoErrorInfo(
    typedValue,
    minAmount,
    minBaseAmount,
    outputCurrencyId,
    inputCurrencyId,
  )
  const inputCurrency: any = useOnRampCurrency(inputCurrencyId)

  const outputCurrency: any = useFiatCurrency(outputCurrencyId)
  const { onFieldAInput, onCurrencySelection, onMinAmountUdate } = useBuyCryptoActionHandlers()
  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  const handleTypeOutput = useCallback((value: string) => onFieldAInput(value), [onFieldAInput])

  // need to reloacte this
  const fetchMinBuyAmounts = useCallback(async () => {
    const minAmounts = await fetchMinimumBuyAmount(outputCurrencyId, inputCurrencyId)
    onMinAmountUdate(minAmounts.base?.minBuyAmount.toString(), minAmounts.quote?.minBuyAmount.toString())
  }, [inputCurrencyId, outputCurrencyId, onMinAmountUdate])

  useEffect(() => {
    fetchMinBuyAmounts()
  }, [fetchMinBuyAmounts])

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onFieldAInput(maxAmountInput.toExact())
    }
  }, [maxAmountInput, onFieldAInput])

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
    <FormContainer>
      <CurrencyInputPanel
        id="onramp-input"
        showMaxButton={false}
        value={typedValue}
        currency={outputCurrency}
        onUserInput={handleTypeOutput}
        onCurrencySelect={handleOutputSelect}
        error={error}
        showCommonBases={false}
      />
      <CenterWrapper>
        <ArrowDownIcon className="icon-down" color="primary" width="22px" />
      </CenterWrapper>

      <AssetSelect onCurrencySelect={handleInputSelect} currency={inputCurrency} />
      <Text color="textSubtle" fontSize="14px" px="4px">
        {t('Proceed to get live aggregated quotes quotes from a variety of different fiat onramp providers.')}
      </Text>
      <GetQuotesButton
        errorText={inputError}
        modalView={modalView}
        setModalView={setModalView}
        fetchQuotes={fetchQuotes}
      />
    </FormContainer>
  )
}
