import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { infoStableSwapABI } from '../../evm/abis/InfoStableSwap'
import { STABLE_SWAP_INFO_ADDRESS } from '../../evm/constants'
import { wrappedCurrencyAmount } from '../../evm/utils/currency'
import { Provider, StableSwapFeeRaw, StableSwapPair } from '../types'
import { getOutputToken } from '../utils/pair'

export function getStableSwapFeeCall(pair: StableSwapPair, inputAmount: CurrencyAmount<Currency>) {
  const { chainId } = inputAmount.currency
  const wrappedInputAmount = wrappedCurrencyAmount(inputAmount, chainId)
  if (!wrappedInputAmount) {
    throw new Error(`No wrapped token amount found for input amount: ${inputAmount.currency.name}`)
  }

  const { stableSwapAddress } = pair
  const inputToken = wrappedInputAmount.currency
  const outputToken = getOutputToken(pair, inputToken)
  const inputRawAmount = inputAmount.wrapped.quotient

  const isOutputToken0 = pair.token0.equals(outputToken)
  const args = isOutputToken0
    ? ([stableSwapAddress, 1n, 0n, inputRawAmount] as const)
    : ([stableSwapAddress, 0n, 1n, inputRawAmount] as const)
  return {
    abi: infoStableSwapABI,
    address: pair.infoStableSwapAddress || STABLE_SWAP_INFO_ADDRESS[chainId as ChainId],
    functionName: 'get_exchange_fee',
    args,
  } as const
}

interface Options {
  provider: Provider
}

export async function getStableSwapFee(
  pair: StableSwapPair,
  inputAmount: CurrencyAmount<Currency>,
  { provider }: Options,
): Promise<StableSwapFeeRaw> {
  // eslint-disable-next-line prefer-destructuring
  const chainId: ChainId = inputAmount.currency.chainId
  const call = getStableSwapFeeCall(pair, inputAmount)
  const outputToken = getOutputToken(pair, inputAmount.currency)

  const client = provider({ chainId })

  const [[feeRaw, adminFeeRaw]] = await client.multicall({
    contracts: [call],
    allowFailure: false,
  })

  return {
    fee: CurrencyAmount.fromRawAmount(outputToken, feeRaw),
    adminFee: CurrencyAmount.fromRawAmount(outputToken, adminFeeRaw),
  }
}
