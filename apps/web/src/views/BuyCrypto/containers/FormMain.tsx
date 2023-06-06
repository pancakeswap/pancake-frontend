/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import {
  fetchMinimumBuyAmount,
  useBuyCryptoActionHandlers,
  useBuyCryptoErrorInfo,
  useBuyCryptoState,
} from 'state/buyCrypto/hooks'
import { useAllOnRampTokens, useFiatCurrency, useOnRampCurrency } from 'hooks/Tokens'
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react'
import { Field } from 'state/swap/actions'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { FiatOnRampModalButtonMercury } from 'components/FiatOnRampModal/MercuryoOnrampModal'
import { useRouter } from 'next/router'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '..'
import { FormContainer } from '../components/FormContainer'
import AssetSelect from '../components/AssetSelect'
// eslint-disable-next-line import/no-cycle
import GetQuotesButton from '../components/GetQuotesButton'

interface Props {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  modalView: CryptoFormView
}

export function FormMain({ setModalView, modalView }: Props) {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const router = useRouter()
  const {
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    minAmount,
    minBaseAmount,
  } = useBuyCryptoState()

  const allC = useAllOnRampTokens()
  const { amountError: error, inputError } = useBuyCryptoErrorInfo(
    typedValue,
    minAmount,
    minBaseAmount,
    outputCurrencyId,
    inputCurrencyId,
  )
  const inputCurrency = useOnRampCurrency(inputCurrencyId)

  const outputCurrency = useFiatCurrency(outputCurrencyId)
  const { onFieldAInput, onCurrencySelection, onMinAmountUdate } = useBuyCryptoActionHandlers()
  const [inputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = useMemo(() => maxAmountSpend(inputBalance), [inputBalance])
  const handleTypeOutput = useCallback((value: string) => onFieldAInput(value), [onFieldAInput])

  // need to reloacte this
  useEffect(() => {
    ;(async () => {
      const minAmounts = await fetchMinimumBuyAmount(outputCurrencyId, inputCurrencyId)
      onMinAmountUdate(minAmounts.base.minBuyAmount.toString(), minAmounts.quote.minBuyAmount.toString())
    })()
  }, [inputCurrencyId, outputCurrencyId, onMinAmountUdate])

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
      <AssetSelect onCurrencySelect={handleInputSelect} currency={inputCurrency} />
      <Text color="textSubtle" fontSize="14px" px="4px">
        {t('Proceed to get live aggregated quotes quotes from a variety of different fiat onramp providers.')}
      </Text>
      <GetQuotesButton errorText={inputError} modalView={modalView} setModalView={setModalView} />
      <FiatOnRampModalButtonMercury />
    </FormContainer>
  )
}
