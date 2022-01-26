import { useTranslation } from 'contexts/Localization'
import useENS from 'hooks/ENS/useENS'
import { useMintExactIn, useMintExactOut } from 'hooks/Mints'
import { useCurrency } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Currency, CurrencyAmount, Mint } from 'peronio-sdk'
import { tryParseAmount, useSwapState } from 'state/swap/hooks'
import { useCurrencyBalances } from 'state/wallet/hooks'
import { isAddress } from 'utils'
import {
  Field,
  // replaceSwapState,
  // selectCurrency,
  // setRecipient,
  // switchCurrencies,
  // typeInput,
  // updateDerivedPairData,
  // updatePairData,
} from './actions'

// TODO: Replace with functionality
export function useMintTokenInfo(): {
  currencies: { [field in Field]?: Currency }
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmount: CurrencyAmount | undefined
  mint: Mint | undefined
  inputError?: string
} {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()

  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
    recipient,
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)
  const recipientLookup = useENS(recipient ?? undefined)
  const to: string | null = (recipient === null ? account : recipientLookup.address) ?? null

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    inputCurrency ?? undefined,
    outputCurrency ?? undefined,
  ])

  const isExactIn: boolean = independentField === Field.INPUT
  const parsedAmount = tryParseAmount(typedValue, (isExactIn ? inputCurrency : outputCurrency) ?? undefined)

  // ACA VA EL REFACTOR!!!! ----------------------------------------------------------------

  const mintOut = useMintExactOut(!isExactIn ? parsedAmount : null, outputCurrency)
  const mintIn = useMintExactIn(isExactIn ? parsedAmount : null, inputCurrency)

  const mint = isExactIn ? mintIn : mintOut

  const currencyBalances = {
    [Field.INPUT]: relevantTokenBalances[0],
    [Field.OUTPUT]: relevantTokenBalances[1],
  }

  //   console.info('currencyBalances: ')
  //   console.dir(currencyBalances)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  let inputError: string | undefined
  if (!account) {
    inputError = t('Connect Wallet')
  }

  if (!parsedAmount) {
    inputError = inputError ?? t('Enter an amount')
  }

  const formattedTo = isAddress(to)
  if (!to || !formattedTo) {
    inputError = inputError ?? t('Enter a recipient')
  }

  // compare input balance to max input based on version
  const [balanceIn, amountIn] = [currencyBalances[Field.INPUT], mint?.inputAmount]

  if (balanceIn && amountIn && balanceIn.lessThan(amountIn)) {
    inputError = t('Insufficient %symbol% balance', { symbol: amountIn.currency.symbol })
  }

  return {
    currencies,
    currencyBalances,
    parsedAmount,
    mint: mint ?? undefined,
    inputError,
  }
}
