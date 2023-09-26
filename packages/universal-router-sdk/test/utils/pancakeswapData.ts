import {
  CurrencyAmount,
  Ether as PancakeEther,
  Pair as PancakePair,
  Percent,
  TradeType,
  computePairAddress as computePancakePairAddress,
  Currency,
  Token,
  Route as RouteV2,
  Trade as TradeV2,
} from '@pancakeswap/sdk'
import { Validation } from '@pancakeswap/smart-router/dist/evm/v3-router/utils/multicallExtended'
import {
  FeeAmount,
  FeeOptions,
  FeeAmount as PancakeFeeAmont,
  Pool,
  Route as RouteV3,
  Trade as TradeV3,
  TICK_SPACINGS,
  encodeSqrtRatioX96,
  nearestUsableTick,
  TickMath,
} from '@pancakeswap/v3-sdk'
import IUniswapV3Pool from '../../src/abis/IUniswapV3Pool.json'
import { ethers } from 'ethers'
import JSBI from 'jsbi'
import { Permit2Permit } from '../../src/utils/inputTokens'
import { SmartRouterTrade, V3Pool, V2Pool, PoolType } from '@pancakeswap/smart-router/evm'

export interface PancakeSwapOptions {
  slippageTolerance: Percent
  recipient?: string
  deadlineOrPreviousBlockhash?: Validation
  inputTokenPermit?: Permit2Permit
  fee?: FeeOptions
}

export enum RouteType {
  V2,
  V3,
  STABLE,
  MIXED,
  MM,
}

const V2_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'getReserves',
    outputs: [
      {
        internalType: 'uint112',
        name: 'reserve0',
        type: 'uint112',
      },
      {
        internalType: 'uint112',
        name: 'reserve1',
        type: 'uint112',
      },
      {
        internalType: 'uint32',
        name: 'blockTimestampLast',
        type: 'uint32',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

export const PANCAKE_ETHER = PancakeEther.onChain(5)
export const PANCAKE_USDC = new Token(5, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6', 6, 'USDC', 'USD Coin')
export const PANCAKE_WETH = new Token(5, '0x07865c6E87B9F70255377e024ace6630C1Eaa37F', 18, 'WETH', 'Wrapped Ether')
export const FEE_AMOUNT = FeeAmount.MEDIUM

export function getProvider(): ethers.providers.BaseProvider {
  return new ethers.providers.JsonRpcProvider('https://goerli.infura.io/v3/3f4ad76a6b444342bde910d098ff8a4e')
}

export async function getPancakePair(
  tokenA: Token,
  tokenB: Token
): Promise<{ pair: PancakePair; reserve0: any; reserve1: any }> {
  const pairAddress = computePancakePairAddress({
    factoryAddress: '0x1097053Fd2ea711dad45caCcc45EfF7548fCB362',
    tokenA,
    tokenB,
  })
  const contract = new ethers.Contract(pairAddress, V2_ABI, getProvider())
  const { reserve0, reserve1 } = await contract.getReserves()
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return {
    pair: new PancakePair(
      CurrencyAmount.fromRawAmount(token0, reserve0),
      CurrencyAmount.fromRawAmount(token1, reserve1)
    ),
    reserve0: reserve0,
    reserve1: reserve1,
  }
}

export async function getPancakePool(
  tokenA: Token,
  tokenB: Token,
  feeAmount: PancakeFeeAmont
): Promise<{ pool: Pool; liquidity: any; tick: any }> {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const poolAddress = Pool.getAddress(token0, token1, feeAmount)
  const contract = new ethers.Contract(poolAddress, IUniswapV3Pool.abi, getProvider())
  let liquidity = await contract.liquidity()
  let { sqrtPriceX96, tick } = await contract.slot0()
  liquidity = JSBI.BigInt(liquidity.toString())
  sqrtPriceX96 = JSBI.BigInt(sqrtPriceX96.toString())

  return {
    pool: new Pool(token0, token1, feeAmount, sqrtPriceX96, liquidity, tick, [
      {
        index: nearestUsableTick(tick, TICK_SPACINGS[feeAmount]),
        liquidityNet: liquidity,
        liquidityGross: liquidity,
      },
      {
        index: nearestUsableTick(tick, TICK_SPACINGS[feeAmount]),
        liquidityNet: JSBI.multiply(liquidity, JSBI.BigInt('-1')),
        liquidityGross: liquidity,
      },
    ]),
    liquidity,
    tick,
  }
}

export function pancakeSwapOptions(options: Partial<PancakeSwapOptions>): PancakeSwapOptions {
  // If theres a fee this counts as "slippage" for the amount out, so take it into account
  let slippageTolerance = new Percent(10, 100)
  if (!!options.fee) slippageTolerance = slippageTolerance.add(options.fee.fee)
  return Object.assign(
    {
      slippageTolerance,
      recipient: '0x13E7f71a3E8847399547CE127B8dE420B282E4E4',
    },
    options
  )
}

export const convertV3PoolToSDKPool = ({ token0, token1, fee, sqrtRatioX96, liquidity, tick, ticks }: V3Pool) =>
  new Pool(token0.wrapped, token1.wrapped, fee, sqrtRatioX96, liquidity, tick, ticks)

export const convertV2PoolToSDKPool = ({ reserve1, reserve0 }: V2Pool) =>
  new PancakePair(reserve0.wrapped, reserve1.wrapped)

export const makeV3Trade = async (
  pools: V3Pool[],
  tokenIn: Currency,
  tokenOut: Currency,
  amount: CurrencyAmount<Currency>,
  tradeType: TradeType
): Promise<SmartRouterTrade<TradeType>> => {
  const v3Pools = pools.map(convertV3PoolToSDKPool)
  const v3Trade = await TradeV3.fromRoute(new RouteV3(v3Pools, tokenIn, tokenOut), amount, tradeType)
  return {
    tradeType,
    inputAmount: v3Trade.inputAmount,
    outputAmount: v3Trade.outputAmount,
    routes: [
      {
        type: RouteType.V3,
        pools,
        path: v3Trade.swaps[0].route.tokenPath,
        percent: 100,
        inputAmount: v3Trade.inputAmount,
        outputAmount: v3Trade.outputAmount,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(tokenIn, 0),
    blockNumber: 0,
  }
}

export const makeV3Pool = (token0: Token, token1: Token, liquidityNum: number, tick: any): V3Pool => {
  const liquidity = BigInt(liquidityNum)
  return {
    type: PoolType.V3,
    token0,
    token1,
    fee: 500,
    liquidity,
    sqrtRatioX96: encodeSqrtRatioX96(1, 1),
    tick: tick,
    address: Pool.getAddress(token0, token1, 500),
    token0ProtocolFee: new Percent(0, 100),
    token1ProtocolFee: new Percent(0, 100),
    ticks: [
      {
        index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[500]),
        liquidityNet: liquidity,
        liquidityGross: liquidity,
      },
      {
        index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[500]),
        liquidityNet: -liquidity,
        liquidityGross: liquidity,
      },
    ],
  }
}

export const makeV2Trade = (
  pools: V2Pool[],
  tokenIn: Currency,
  tokenOut: Currency,
  amount: CurrencyAmount<Currency>,
  tradeType: TradeType
): SmartRouterTrade<TradeType> => {
  const v2Pools = pools.map(convertV2PoolToSDKPool)

  const getTrade = tradeType === TradeType.EXACT_INPUT ? TradeV2.exactIn : TradeV2.exactOut
  const route = new RouteV2(v2Pools, tokenIn, tokenOut)
  const v2Trade = getTrade(route, amount)
  return {
    tradeType,
    inputAmount: v2Trade.inputAmount,
    outputAmount: v2Trade.outputAmount,
    routes: [
      {
        type: RouteType.V2,
        pools,
        path: v2Trade.route.path,
        percent: 100,
        inputAmount: v2Trade.inputAmount,
        outputAmount: v2Trade.outputAmount,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(tokenIn, 0n),
    blockNumber: 0,
  }
}
