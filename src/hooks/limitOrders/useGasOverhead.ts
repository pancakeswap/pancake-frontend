import { useMemo } from 'react'
import { formatUnits } from '@ethersproject/units'
import { CurrencyAmount, Price, Token, TokenAmount, JSBI, ETHER } from '@pancakeswap/sdk'
import { BigNumber } from '@ethersproject/bignumber'
import { useTradeExactIn } from 'hooks/Trades'
import tryParseAmount from 'utils/tryParseAmount'
import { Rate } from 'state/limitOrders/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { GENERIC_GAS_LIMIT_ORDER_EXECUTION, BIG_INT_TEN } from 'config/constants/exchange'
import getGasPrice from 'utils/getGasPrice'
import getPriceForOneToken from 'views/LimitOrders/utils/getPriceForOneToken'

export default function useGasOverhead(
  inputAmount: CurrencyAmount | undefined,
  outputAmount: CurrencyAmount | undefined,
  rateType: Rate,
): {
  realExecutionPrice: Price | undefined | null
  realExecutionPriceAsString: string | undefined
  gasPrice: string | undefined
} {
  const { chainId } = useActiveWeb3React()

  const gasPrice = getGasPrice()
  const requiredGas = formatUnits(gasPrice ? BigNumber.from(gasPrice).mul(GENERIC_GAS_LIMIT_ORDER_EXECUTION) : '0')
  const requiredGasAsCurrencyAmount = tryParseAmount(requiredGas, ETHER)

  const inputIsBNB = inputAmount?.currency.symbol === 'BNB'

  const gasCostInInputTokens = useTradeExactIn(requiredGasAsCurrencyAmount, inputIsBNB ? null : inputAmount?.currency)

  const bufferedOutputAmount = useMemo(() => {
    if (inputIsBNB) return requiredGasAsCurrencyAmount
    if (!gasCostInInputTokens || !gasCostInInputTokens?.outputAmount) return undefined
    // Add 2000 BPS on top (20%) to account for gas price fluctuations
    const margin = gasCostInInputTokens.outputAmount.asFraction.multiply(2000).divide(10000)
    const adjustedGas = gasCostInInputTokens.outputAmount.asFraction.add(margin)
    const adjustedGasInWei = adjustedGas.multiply(
      JSBI.exponentiate(BIG_INT_TEN, JSBI.BigInt(gasCostInInputTokens.outputAmount.currency.decimals)),
    )
    if (gasCostInInputTokens.outputAmount.currency instanceof Token) {
      return new TokenAmount(gasCostInInputTokens.outputAmount.currency, adjustedGasInWei.toFixed(0))
    }
    return undefined
  }, [gasCostInInputTokens, requiredGasAsCurrencyAmount, inputIsBNB])

  const realInputAmount = useMemo(
    () =>
      bufferedOutputAmount &&
      inputAmount &&
      inputAmount.greaterThan(bufferedOutputAmount) &&
      inputAmount.subtract(bufferedOutputAmount),
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
    ? { realExecutionPrice, gasPrice, realExecutionPriceAsString }
    : {
        realExecutionPrice: undefined,
        realExecutionPriceAsString: undefined,
        gasPrice: undefined,
      }
}
