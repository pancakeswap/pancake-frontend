/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Currency, Percent } from '@pancakeswap/sdk'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'

import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { useSwapState } from 'state/swap/hooks'
import { Field } from 'state/swap/actions'
import { useCurrency } from 'hooks/Tokens'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { CommonBasesType } from 'components/SearchModal/types'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { currencyId } from 'utils/currencyId'

import { FormContainer } from '../components'
import useWarningImport from '../../hooks/useWarningImport'

export function FormMain() {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const warningSwapHandler = useWarningImport()
  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const { wrapType } = useWrapCallback(inputCurrency, outputCurrency, typedValue)
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()
  const [inputBalance, outputBalance] = useCurrencyBalances(account, [inputCurrency, outputCurrency])
  const maxAmountInput = maxAmountSpend(inputBalance)

  const handleTypeInput = useCallback((value: string) => onUserInput(Field.INPUT, value), [onUserInput])
  const handleTypeOutput = useCallback((value: string) => onUserInput(Field.OUTPUT, value), [onUserInput])

  const handlePercentInput = useCallback(
    (percent: number) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleInputSelect = useCallback(
    (newCurrencyInput: Currency) => {
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      warningSwapHandler(newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const isTypingInput = independentField === Field.INPUT
  const isWrapping = wrapType !== WrapType.NOT_APPLICABLE
  const inputValue = isTypingInput ? typedValue : ''
  const outputValue = isTypingInput ? '' : typedValue

  return (
    <FormContainer>
      <CurrencyInputPanel
        id="swap-currency-input"
        showBUSD
        showMaxButton
        showCommonBases
        label={isTypingInput && !isWrapping ? t('From (estimated)') : t('From')}
        value={inputValue}
        maxAmount={maxAmountInput}
        showQuickInputButton
        currency={inputCurrency}
        onUserInput={handleTypeInput}
        onPercentInput={handlePercentInput}
        onMax={handleMaxInput}
        onCurrencySelect={handleInputSelect}
        otherCurrency={outputCurrency}
        commonBasesType={CommonBasesType.SWAP_LIMITORDER}
      />
    </FormContainer>
  )
}
