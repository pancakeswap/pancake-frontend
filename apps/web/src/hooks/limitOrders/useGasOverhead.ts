import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { CurrencyAmount, Price, Currency } from '@pancakeswap/sdk'
import { useTradeExactIn } from 'hooks/Trades'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { Rate } from 'state/limitOrders/types'
import { GENERIC_GAS_LIMIT_ORDER_EXECUTION } from 'config/constants/exchange'
import getPriceForOneToken from 'views/LimitOrders/utils/getPriceForOneToken'
import { useGasPrice } from 'state/user/hooks'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useActiveChainId } from '../useActiveChainId'

export default function useGasOverhead(
  inputAmount: CurrencyAmount<Currency> | undefined,
  outputAmount: CurrencyAmount<Currency> | undefined,
  rateType: Rate,
): {
  realExecutionPrice: Price<Currency, Currency> | undefined | null
  realExecutionPriceAsString: string | undefined
} {
  const { chainId } = useActiveChainId()
  const native = useNativeCurrency()

  const gasPrice = useGasPrice()
  const requiredGas = formatUnits(gasPrice ? gasPrice * GENERIC_GAS_LIMIT_ORDER_EXECUTION : 0n, 18)
  const requiredGasAsCurrencyAmount = tryParseAmount(requiredGas, native)

  const inputIsBNB = inputAmount?.currency.symbol === 'BNB'

  const gasCostInInputTokens = useTradeExactIn(requiredGasAsCurrencyAmount, inputIsBNB ? null : inputAmount?.currency)

  const bufferedOutputAmount = useMemo(() => {
    if (inputIsBNB) return requiredGasAsCurrencyAmount
    if (!gasCostInInputTokens || !gasCostInInputTokens?.outputAmount) return undefined
    // Add 2000 BPS on top (20%) to account for gas price fluctuations

    return gasCostInInputTokens.outputAmount.add(gasCostInInputTokens.outputAmount.multiply(2000).divide(10000))
  }, [gasCostInInputTokens, requiredGasAsCurrencyAmount, inputIsBNB])

  const realInputAmount = useMemo(
    () => bufferedOutputAmount && inputAmount && inputAmount.subtract(bufferedOutputAmount),
    [bufferedOutputAmount, inputAmount],
  )

  const realExecutionPrice = useMemo(() => {
    if (!inputAmount || (!gasCostInInputTokens && !inputIsBNB) || !realInputAmount || !outputAmount) return null

    if (inputIsBNB && requiredGasAsCurrencyAmount.greaterThan(inputAmount.asFraction)) return undefined
    if (gasCostInInputTokens && gasCostInInputTokens.outputAmount.greaterThan(inputAmount.asFraction)) return undefined
    return getPriceForOneToken(realInputAmount, outputAmount)
  }, [realInputAmount, outputAmount, inputAmount, gasCostInInputTokens, inputIsBNB, requiredGasAsCurrencyAmount])

  const realExecutionPriceAsString = useMemo(() => {
    if (!realExecutionPrice) return 'never executes'
    return rateType === Rate.DIV ? realExecutionPrice.invert().toSignificant(6) : realExecutionPrice.toSignificant(6)
  }, [rateType, realExecutionPrice])

  return chainId
    ? { realExecutionPrice, realExecutionPriceAsString }
    : {
        realExecutionPrice: undefined,
        realExecutionPriceAsString: undefined,
      }
}
