import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount, ERC20Token, Pair, computePairAddress, pancakePairV2ABI } from '@pancakeswap/sdk'
import { SmartRouter, StablePool } from '@pancakeswap/smart-router/evm'
import { CAKE, ETHER, USDC, USDT, WETH9, BUSD } from './constants/tokens'
import { V2_FACTORY_ADDRESSES } from './constants/addresses'
import { Provider, getPublicClient } from './clients'
import { PERMIT2_ADDRESS, UNIVERSAL_ROUTER_ADDRESS } from '../../src'

const fixtureTokensAddresses = (chainId: ChainId) => {
  return {
    ETHER: ETHER.on(chainId),
    USDC: USDC[chainId],
    USDT: USDT[chainId],
    CAKE: CAKE[chainId],
    WETH: WETH9[chainId],
    BUSD: BUSD[chainId],
  }
}

export const getStablePool = async (
  tokenA: ERC20Token,
  tokenB: ERC20Token,
  provider: Provider
): Promise<StablePool> => {
  const pools = await SmartRouter.getStableCandidatePools({
    currencyA: tokenA,
    currencyB: tokenB,
    onChainProvider: provider,
  })

  if (!pools.length) throw new ReferenceError(`No Stable Pool found with token ${tokenA.symbol}/${tokenB.symbol}`)

  return pools[0]
}

const getPair = (tokenA: ERC20Token, tokenB: ERC20Token, liquidity?: bigint) => {
  return async (getClient: Provider) => {
    // eslint-disable-next-line no-console
    console.assert(tokenA.chainId === tokenB.chainId, 'Invalid token pair')
    const chainId = tokenA.chainId as ChainId
    const client = getClient({ chainId })
    const pairAddress = computePairAddress({ factoryAddress: V2_FACTORY_ADDRESSES[chainId], tokenA, tokenB })

    let reserve0: bigint
    let reserve1: bigint
    // @notice: to match off-chain testing ,we can use fixed liquid to match snapshots
    if (liquidity) {
      reserve0 = liquidity
      reserve1 = liquidity
    } else {
      ;[reserve0, reserve1] = await client.readContract({
        abi: pancakePairV2ABI,
        address: pairAddress,
        functionName: 'getReserves',
      })
    }
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

    return new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))
  }
}

export const fixtureAddresses = async (chainId: ChainId, liquidity?: bigint) => {
  const tokens = fixtureTokensAddresses(chainId)
  const { ETHER, USDC, USDT, WETH, CAKE } = tokens

  const v2Pairs = {
    WETH_USDC_V2: await getPair(WETH, USDC, liquidity)(getPublicClient),
    USDC_USDT_V2: await getPair(USDT, USDC, liquidity)(getPublicClient),
  }

  const v3Pools = {}

  const UNIVERSAL_ROUTER = UNIVERSAL_ROUTER_ADDRESS(chainId)
  const PERMIT2 = PERMIT2_ADDRESS

  return {
    ...tokens,
    ...v2Pairs,
    ...v3Pools,
    UNIVERSAL_ROUTER,
    PERMIT2,
  }
}
