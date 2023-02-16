import { BigNumber } from '@ethersproject/bignumber'
import { Call, createMulticall } from '@pancakeswap/multicall'
import { ChainId, Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { wrappedCurrencyAmount } from '../utils/currency'
import { getOutputToken } from '../utils/pair'
import IStableSwapInfoABI from '../abis/InfoStableSwap.json'
import { StableSwapPair, Provider, StableSwapFeeRaw } from '../types'
import { STABLE_SWAP_INFO_ADDRESS } from '../constants'

export function getStableSwapFeeCall(pair: StableSwapPair, inputAmount: CurrencyAmount<Currency>): Call {
  const { chainId } = inputAmount.currency
  const wrappedInputAmount = wrappedCurrencyAmount(inputAmount, chainId)
  if (!wrappedInputAmount) {
    throw new Error(`No wrapped token amount found for input amount: ${inputAmount.currency.name}`)
  }

  const { stableSwapAddress } = pair
  const inputToken = wrappedInputAmount.currency
  const outputToken = getOutputToken(pair, inputToken)
  const inputRawAmount = inputAmount.wrapped.quotient.toString()

  const isOutputToken0 = pair.token0.equals(outputToken)
  const args = isOutputToken0 ? [stableSwapAddress, 1, 0, inputRawAmount] : [stableSwapAddress, 0, 1, inputRawAmount]
  return {
    address: pair.infoStableSwapAddress || STABLE_SWAP_INFO_ADDRESS[chainId as ChainId],
    name: 'get_exchange_fee',
    params: args,
  }
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
  const { multicallv2 } = createMulticall(provider)
  const call = getStableSwapFeeCall(pair, inputAmount)
  const outputToken = getOutputToken(pair, inputAmount.currency)

  const [[feeRaw, adminFeeRaw]] = await multicallv2<[[BigNumber, BigNumber]]>({
    abi: IStableSwapInfoABI,
    calls: [call],
    chainId,
    options: {
      requireSuccess: true,
    },
  })

  return {
    fee: CurrencyAmount.fromRawAmount(outputToken, feeRaw.toString()),
    adminFee: CurrencyAmount.fromRawAmount(outputToken, adminFeeRaw.toString()),
  }
}
