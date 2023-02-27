import { BigNumber } from '@ethersproject/bignumber'
import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Call, createMulticall } from '@pancakeswap/multicall'

import { Provider, StableSwapPair } from '../types'
import { wrappedCurrencyAmount } from '../utils/currency'
import { getOutputToken } from '../utils/pair'
import IStableSwapABI from '../abis/StableSwapPair.json'

interface Options {
  provider: Provider
}

export async function getStableSwapOutputAmount(
  pair: StableSwapPair,
  inputAmount: CurrencyAmount<Currency>,
  { provider }: Options,
): Promise<CurrencyAmount<Currency>> {
  const { multicallv2 } = createMulticall(provider)

  const wrappedInputAmount = wrappedCurrencyAmount(inputAmount, inputAmount.currency.chainId)
  if (!wrappedInputAmount) {
    throw new Error(`No wrapped token amount found for input amount: ${inputAmount.currency.name}`)
  }

  // eslint-disable-next-line prefer-destructuring
  const chainId: ChainId = inputAmount.currency.chainId
  const inputToken = wrappedInputAmount.currency
  const outputToken = getOutputToken(pair, inputToken)
  const inputRawAmount = inputAmount.wrapped.quotient.toString()

  const isOutputToken0 = pair.token0.equals(outputToken)
  const args = isOutputToken0 ? [1, 0, inputRawAmount] : [0, 1, inputRawAmount]
  const call: Call = {
    address: pair.stableSwapAddress,
    name: 'get_dy',
    params: args,
  }
  const result = await multicallv2<BigNumber[]>({
    abi: IStableSwapABI,
    calls: [call],
    chainId,
    options: {
      requireSuccess: true,
    },
  })

  return CurrencyAmount.fromRawAmount(outputToken, result.toString())
}
