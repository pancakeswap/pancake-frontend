import { ChainId } from '@pancakeswap/chains'
import { getPermit2Address } from '@pancakeswap/permit2-sdk'
import { CurrencyAmount, ERC20Token, Pair, Percent } from '@pancakeswap/sdk'
import { PoolType, SmartRouter, StablePool, V2Pool, V3Pool } from '@pancakeswap/smart-router/evm'
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
import { getUniversalRouterAddress } from '../../src'
import { Provider } from './clients'
import { BUSD, CAKE, ETHER, USDC, USDT, WBNB, WETH9 } from './constants/tokens'

const fixtureTokensAddresses = (chainId: ChainId) => {
  return {
    ETHER: ETHER.on(chainId),
    USDC: USDC[chainId],
    USDT: USDT[chainId],
    CAKE: CAKE[chainId],
    WETH: WETH9[chainId],
    BUSD: BUSD[chainId],
    WBNB: WBNB[chainId],
  }
}

export const getStablePool = async (
  tokenA: ERC20Token,
  tokenB: ERC20Token,
  provider: Provider,
  liquidity?: bigint,
): Promise<StablePool> => {
  const pools = await SmartRouter.getStableCandidatePools({
    currencyA: tokenA,
    currencyB: tokenB,
    onChainProvider: provider,
  })

  if (!pools.length) throw new ReferenceError(`No Stable Pool found with token ${tokenA.symbol}/${tokenB.symbol}`)
  const stablePool = pools[0] as StablePool

  if (liquidity) {
    stablePool.balances[0] = CurrencyAmount.fromRawAmount(stablePool.balances[0].currency, liquidity)
    stablePool.balances[1] = CurrencyAmount.fromRawAmount(stablePool.balances[1].currency, liquidity)
  }

  return stablePool
}

const getPair = (tokenA: ERC20Token, tokenB: ERC20Token, liquidity: bigint) => {
  // eslint-disable-next-line no-console
  console.assert(tokenA.chainId === tokenB.chainId, 'Invalid token pair')

  // @notice: to match off-chain testing ,we can use fixed liquid to match snapshots
  const reserve0 = liquidity
  const reserve1 = liquidity

  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  return new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))
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
export const convertPairToV2Pool = (pair: Pair): V2Pool => ({
  type: PoolType.V2,
  reserve0: pair.reserve0,
  reserve1: pair.reserve1,
})

export const convertV3PoolToSDKPool = ({ token0, token1, fee, sqrtRatioX96, liquidity, tick, ticks }: V3Pool) =>
  new Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick, ticks)
export const convertV2PoolToSDKPool = ({ reserve1, reserve0 }: V2Pool) => new Pair(reserve0.wrapped, reserve1.wrapped)

const fixturePool = ({
  tokenA,
  tokenB,
  feeAmount = FeeAmount.MEDIUM,
  reserve,
}: {
  tokenA: ERC20Token
  tokenB: ERC20Token
  feeAmount: FeeAmount
  reserve:
    | {
        reserve0: bigint
        reserve1: bigint
      }
    | bigint
}) => {
  // eslint-disable-next-line no-console
  console.assert(tokenA.chainId === tokenB.chainId, 'Invalid token pair')

  const reserve0 = typeof reserve === 'bigint' ? reserve : reserve.reserve0
  const reserve1 = typeof reserve === 'bigint' ? reserve : reserve.reserve1
  const sqrtPriceX96 = encodeSqrtRatioX96(reserve0, reserve1)
  // fixture to full range liquidity
  const liquidity = BigInt(Math.floor(Math.sqrt(Number(reserve0 * reserve1))))

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

export const fixtureAddresses = async (chainId: ChainId, liquidity: bigint) => {
  const tokens = fixtureTokensAddresses(chainId)
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const { USDC, USDT, WETH, WBNB } = tokens

  const v2Pairs = {
    WETH_USDC_V2: getPair(WETH, USDC, liquidity),
    WBNB_USDC_V2: getPair(WBNB, USDC, liquidity),
    USDC_USDT_V2: getPair(USDT, USDC, liquidity),
  }

  const v3Pools = {
    WETH_USDC_V3_MEDIUM: fixturePool({
      tokenA: WETH,
      tokenB: USDC,
      feeAmount: FeeAmount.MEDIUM,
      reserve: liquidity,
    }),
    WETH_USDC_V3_MEDIUM_ADDRESS: computePoolAddress({
      deployerAddress: DEPLOYER_ADDRESSES[chainId],
      tokenA: WETH,
      tokenB: USDC,
      fee: FeeAmount.MEDIUM,
    }),
    WETH_USDC_V3_LOW: fixturePool({
      tokenA: WETH,
      tokenB: USDC,
      reserve: liquidity,
      feeAmount: FeeAmount.LOW,
    }),
    WBNB_USDC_V3_MEDIUM: fixturePool({
      tokenA: WBNB,
      tokenB: USDC,
      feeAmount: FeeAmount.MEDIUM,
      reserve: liquidity,
    }),
    USDC_USDT_V3_LOW: fixturePool({ tokenA: USDC, tokenB: USDT, feeAmount: FeeAmount.LOW, reserve: liquidity }),
    USDC_USDT_V3_LOW_ADDRESS: computePoolAddress({
      deployerAddress: DEPLOYER_ADDRESSES[chainId],
      tokenA: USDC,
      tokenB: USDT,
      fee: FeeAmount.LOW,
    }),
  }

  const UNIVERSAL_ROUTER = getUniversalRouterAddress(chainId)
  const PERMIT2 = getPermit2Address(chainId)

  return {
    ...tokens,
    ...v2Pairs,
    ...v3Pools,
    UNIVERSAL_ROUTER,
    PERMIT2,
  }
}
