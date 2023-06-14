import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'
import { BuyCryptoState } from 'state/buyCrypto/reducer'
import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/sdk'
import { ArrowDownIcon, Text } from '@pancakeswap/uikit'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { fetchMinimumBuyAmount, useBuyCryptoActionHandlers, useBuyCryptoErrorInfo } from 'state/buyCrypto/hooks'
import { useOnRampCurrency } from 'hooks/Tokens'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '../index'
import { FormHeader } from './FormHeader'
import { FormContainer } from '../components/FormContainer'
import AssetSelect from '../components/AssetSelect'
// eslint-disable-next-line import/no-cycle
import GetQuotesButton from '../components/GetQuotesButton'
import { fiatCurrencyMap } from '../constants'

const CenterWrapper = styled.div`
  position: absolute;
  left: 48.5%;
  top: 33%;
`
export function BuyCryptoForum({
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
  } = buyCryptoState

  const { amountError: error, inputError } = useBuyCryptoErrorInfo(
    typedValue,
    minAmount,
    minBaseAmount,
    outputCurrencyId,
    inputCurrencyId,
  )
  const inputCurrency = useOnRampCurrency(inputCurrencyId)

  const outputCurrency: any = fiatCurrencyMap[outputCurrencyId]
  const { onFieldAInput, onCurrencySelection, onMinAmountUdate } = useBuyCryptoActionHandlers()
  const handleTypeOutput = useCallback((value: string) => onFieldAInput(value), [onFieldAInput])

  // need to reloacte this
  const fetchMinBuyAmounts = useCallback(async () => {
    const minAmounts = await fetchMinimumBuyAmount(outputCurrencyId, inputCurrencyId)
    onMinAmountUdate(minAmounts.base?.minBuyAmount.toString(), minAmounts.quote?.minBuyAmount.toString())
  }, [inputCurrencyId, outputCurrencyId, onMinAmountUdate])

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
      <FormHeader
        refreshDisabled={false}
        onRefresh={() => null}
        title={t('Buy Crypto')}
        subTitle={t('Buy crypto in just a few clicks')}
      />
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
    </>
  )
}
