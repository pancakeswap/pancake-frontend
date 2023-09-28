import { ChainId } from '@pancakeswap/chains'
import { CurrencyAmount, ERC20Token, Pair, Percent, computePairAddress, pancakePairV2ABI } from '@pancakeswap/sdk'
import { PoolType, SmartRouter, StablePool, V3Pool } from '@pancakeswap/smart-router/evm'
import {
  DEPLOYER_ADDRESSES,
  FeeAmount,
  Pool,
  TICK_SPACINGS,
  TickMath,
  computePoolAddress,
  encodeSqrtRatioX96,
  nearestUsableTick,
} from '@pancakeswap/v3-sdk'
import { CAKE, ETHER, USDC, USDT, WETH9, BUSD } from './constants/tokens'
import { V2_FACTORY_ADDRESSES } from './constants/addresses'
import { Provider, getPublicClient } from './clients'
import { PERMIT2_ADDRESS, UNIVERSAL_ROUTER_ADDRESS } from '../../src'
import { v3PoolAbi } from './constants/abi'

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

export const convertPoolToV3Pool = (pool: Pool): V3Pool => {
  return {
    type: PoolType.V3,
    token0: pool.token0,
    token1: pool.token1,
    fee: pool.fee,
    sqrtRatioX96: pool.sqrtRatioX96,
    liquidity: pool.liquidity,
    tick: pool.tickCurrent,
    address: Pool.getAddress(pool.token0, pool.token1, pool.fee),
    token0ProtocolFee: new Percent(0, 100),
    token1ProtocolFee: new Percent(0, 100),
  }
}

const fixturePool = ({
  tokenA,
  tokenB,
  feeAmount = FeeAmount.MEDIUM,
  reserve,
}: {
  tokenA: ERC20Token
  tokenB: ERC20Token
  feeAmount: FeeAmount
  reserve?:
    | {
        reserve0: bigint
        reserve1: bigint
      }
    | bigint
}) => {
  return async (getClient: Provider): Promise<Pool> => {
    const chainId = tokenA.chainId as ChainId
    // eslint-disable-next-line no-console
    console.assert(tokenA.chainId === tokenB.chainId, 'Invalid token pair')

    const poolAddress = computePoolAddress({
      deployerAddress: DEPLOYER_ADDRESSES[chainId],
      fee: feeAmount,
      tokenA,
      tokenB,
    })
    let sqrtPriceX96: bigint
    let liquidity: bigint

    if (!reserve) {
      ;[sqrtPriceX96] = await getClient({ chainId }).readContract({
        abi: v3PoolAbi,
        address: poolAddress,
        functionName: 'slot0',
      })
      liquidity = await getClient({ chainId }).readContract({
        abi: v3PoolAbi,
        address: poolAddress,
        functionName: 'liquidity',
      })
    } else {
      const reserve0 = typeof reserve === 'bigint' ? reserve : reserve.reserve0
      const reserve1 = typeof reserve === 'bigint' ? reserve : reserve.reserve1
      sqrtPriceX96 = encodeSqrtRatioX96(reserve0, reserve1)
      // fixture to full range liquidity
      liquidity = BigInt(Math.floor(Math.sqrt(Number(reserve0 * reserve1))))
    }
    return new Pool(tokenA, tokenB, feeAmount, sqrtPriceX96, liquidity, TickMath.getTickAtSqrtRatio(sqrtPriceX96), [
      {
        index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
        liquidityNet: liquidity,
        liquidityGross: liquidity,
      },
      {
        index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
        liquidityNet: -liquidity,
        liquidityGross: liquidity,
      },
    ])
  }
}

export const fixtureAddresses = async (chainId: ChainId, liquidity?: bigint) => {
  const tokens = fixtureTokensAddresses(chainId)
  const { ETHER, USDC, USDT, WETH, CAKE } = tokens

  const v2Pairs = {
    WETH_USDC_V2: await getPair(WETH, USDC, liquidity)(getPublicClient),
    USDC_USDT_V2: await getPair(USDT, USDC, liquidity)(getPublicClient),
  }

  const v3Pools = {
    WETH_USDC_V3_MEDIUM: await fixturePool({
      tokenA: WETH,
      tokenB: USDC,
      feeAmount: FeeAmount.MEDIUM,
      reserve: liquidity,
    })(getPublicClient),
    USDC_USDT_V3_LOW: await fixturePool({ tokenA: USDC, tokenB: USDT, feeAmount: FeeAmount.LOW, reserve: liquidity })(
      getPublicClient
    ),
  }

  const UNIVERSAL_ROUTER = UNIVERSAL_ROUTER_ADDRESS(chainId)
  const PERMIT2 = PERMIT2_ADDRESS(chainId)

  return {
    ...tokens,
    ...v2Pairs,
    ...v3Pools,
    UNIVERSAL_ROUTER,
    PERMIT2,
  }
}
