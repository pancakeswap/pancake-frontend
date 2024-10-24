import { BigintIsh, Currency, getCurrencyAddress, sortCurrencies } from '@pancakeswap/swap-sdk-core'
import { PoolKey, getPoolId } from '@pancakeswap/v4-sdk'
import { Native } from '@pancakeswap/sdk'
import { Address } from 'viem'

import { getPairCombinations } from '../../v3-router/functions'
import { OnChainProvider, PoolType, V4ClPool } from '../../v3-router/types'
import { PoolMeta } from '../../v3-router/providers/poolProviders/internalTypes'
import { createOnChainPoolFactory } from '../../v3-router/providers'
import { clPoolManagerAbi } from '../../abis/ICLPoolManager'
import { CL_HOOKS, CL_PRESETS } from '../constants'

type WithMulticallGasLimit = {
  gasLimit?: BigintIsh
}

type WithClientProvider = {
  clientProvider?: OnChainProvider
}

export type GetV4CandidatePoolsParams = {
  currencyA?: Currency
  currencyB?: Currency
} & WithClientProvider &
  WithMulticallGasLimit

export async function getV4ClCandidatePools({
  currencyA,
  currencyB,
  clientProvider,
  gasLimit,
}: GetV4CandidatePoolsParams) {
  if (!currencyA || !currencyB) {
    throw new Error(`Invalid currencyA ${currencyA} or currencyB ${currencyB}`)
  }
  const native = Native.onChain(currencyA?.chainId)
  const wnative = native.wrapped
  const pairs = await getPairCombinations(currencyA, currencyB)
  const pairsWithNative = [...pairs]
  for (const pair of pairs) {
    const index = pair.findIndex((c) => c.wrapped.equals(wnative))
    if (index >= 0) {
      const pairWithNative = [...pair]
      pairWithNative[index] = native
      pairsWithNative.push(pairWithNative as [Currency, Currency])
    }
  }
  return getV4ClPoolsWithoutTicks(pairsWithNative, clientProvider)
}

type V4ClPoolMeta = PoolMeta & {
  fee: number
  poolManager: Address
  tickSpacing: number
  hooks: Address
}

export const getV4ClPoolsWithoutTicks = createOnChainPoolFactory<V4ClPool, V4ClPoolMeta>({
  abi: clPoolManagerAbi,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    const [currency0, currency1] = sortCurrencies([currencyA, currencyB])
    const metas: V4ClPoolMeta[] = []
    for (const { fee, tickSpacing } of CL_PRESETS) {
      for (const hooks of CL_HOOKS) {
        const poolKey: PoolKey<'CL'> = {
          currency0: getCurrencyAddress(currency0),
          currency1: getCurrencyAddress(currency1),
          fee,
          parameters: {
            tickSpacing,
          },
          // TODO: use constant from v4 sdk
          poolManager: '0x26Ca53c8C5CE90E22aA1FadDA68AB9a08f7BA06f' as const,
          hooks,
        }
        const id = getPoolId(poolKey)
        metas.push({
          currencyA,
          currencyB,
          fee,
          tickSpacing,
          hooks,
          poolManager: poolKey.poolManager,
          id,
        })
      }
    }
    return metas
  },
  buildPoolInfoCalls: ({ id, poolManager: address }) => [
    {
      address,
      functionName: 'getLiquidity',
      args: [id],
    },
    {
      address,
      functionName: 'getSlot0',
      args: [id],
    },
  ],
  buildPool: ({ currencyA, currencyB, fee, id, tickSpacing, poolManager }, [liquidity, slot0]) => {
    if (!slot0 || !slot0[0]) {
      return null
    }
    const [sqrtPriceX96, tick] = slot0
    const [currency0, currency1] = sortCurrencies([currencyA, currencyB])
    return {
      id,
      type: PoolType.V4CL,
      currency0,
      currency1,
      fee,
      liquidity: BigInt(liquidity.toString()),
      sqrtRatioX96: BigInt(sqrtPriceX96.toString()),
      tick: Number(tick),
      tickSpacing,
      poolManager,
    }
  },
})
