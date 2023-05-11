import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { Provider, StableSwapPair } from '../types'
import { wrappedCurrencyAmount } from '../../evm/utils/currency'
import { getOutputToken } from '../utils/pair'
import { stableSwapPairABI } from '../../evm/abis/StableSwapPair'

interface Options {
  provider: Provider
}

export async function getStableSwapOutputAmount(
  pair: StableSwapPair,
  inputAmount: CurrencyAmount<Currency>,
  { provider }: Options,
): Promise<CurrencyAmount<Currency>> {
  const wrappedInputAmount = wrappedCurrencyAmount(inputAmount, inputAmount.currency.chainId)
  if (!wrappedInputAmount) {
    throw new Error(`No wrapped token amount found for input amount: ${inputAmount.currency.name}`)
  }

  // eslint-disable-next-line prefer-destructuring
  const chainId: ChainId = inputAmount.currency.chainId
  const inputToken = wrappedInputAmount.currency
  const outputToken = getOutputToken(pair, inputToken)
  const inputRawAmount = inputAmount.wrapped.quotient

  const isOutputToken0 = pair.token0.equals(outputToken)
  const args = isOutputToken0 ? ([1n, 0n, inputRawAmount] as const) : ([0n, 1n, inputRawAmount] as const)

  const client = provider({ chainId })
  const [result] = await client.multicall({
    contracts: [
      {
        abi: stableSwapPairABI,
        address: pair.stableSwapAddress,
        functionName: 'get_dy',
        args,
      },
    ],
    allowFailure: false,
  })

  return CurrencyAmount.fromRawAmount(outputToken, result)
}
