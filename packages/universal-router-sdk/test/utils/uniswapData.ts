import JSBI from 'jsbi'
import { ethers } from 'ethers'
import { MixedRouteTrade, MixedRouteSDK, Trade as RouterTrade } from '@uniswap/router-sdk'
import { Trade as V2Trade, Pair, Route as RouteV2, computePairAddress } from '@uniswap/v2-sdk'
import {
  Trade as V3Trade,
  Pool,
  Route as RouteV3,
  nearestUsableTick,
  TickMath,
  TICK_SPACINGS,
  FeeAmount,
} from '@uniswap/v3-sdk'
import { SwapOptions } from '../../src'
import { CurrencyAmount, TradeType, Ether, Token, Percent, Currency } from '@uniswap/sdk-core'
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'
import { TEST_RECIPIENT_ADDRESS } from './addresses'

const V2_FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
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

const FORK_BLOCK = 16075500

export const ETHER = Ether.onChain(1)
export const WETH = new Token(1, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', 18, 'WETH', 'Wrapped Ether')
export const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'dai')
export const USDC = new Token(1, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD Coin')
export const FEE_AMOUNT = FeeAmount.MEDIUM

type UniswapPools = {
  WETH_USDC_V2: Pair
  USDC_DAI_V2: Pair
  WETH_USDC_V3: Pool
  WETH_USDC_V3_LOW_FEE: Pool
  USDC_DAI_V3: Pool
}

export async function getUniswapPools(forkBlock?: number): Promise<UniswapPools> {
  const fork = forkBlock ?? FORK_BLOCK
  const WETH_USDC_V2 = await getPair(WETH, USDC, fork)
  const USDC_DAI_V2 = await getPair(USDC, DAI, fork)

  const WETH_USDC_V3 = await getPool(WETH, USDC, FEE_AMOUNT, fork)
  const WETH_USDC_V3_LOW_FEE = await getPool(WETH, USDC, FeeAmount.LOW, fork)
  const USDC_DAI_V3 = await getPool(USDC, DAI, FeeAmount.LOW, fork)

  return {
    WETH_USDC_V2,
    USDC_DAI_V2,
    WETH_USDC_V3,
    WETH_USDC_V3_LOW_FEE,
    USDC_DAI_V3,
  }
}

function getProvider(): ethers.providers.BaseProvider {
  return new ethers.providers.JsonRpcProvider(process.env['FORK_URL'])
}

export async function getPair(tokenA: Token, tokenB: Token, blockNumber: number): Promise<Pair> {
  const pairAddress = computePairAddress({ factoryAddress: V2_FACTORY, tokenA, tokenB })
  const contract = new ethers.Contract(pairAddress, V2_ABI, getProvider())
  const { reserve0, reserve1 } = await contract.getReserves({ blockTag: blockNumber })
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  return new Pair(CurrencyAmount.fromRawAmount(token0, reserve0), CurrencyAmount.fromRawAmount(token1, reserve1))
}

export async function getPool(tokenA: Token, tokenB: Token, feeAmount: FeeAmount, blockNumber: number): Promise<Pool> {
  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA] // does safety checks
  const poolAddress = Pool.getAddress(token0, token1, feeAmount)
  const contract = new ethers.Contract(poolAddress, IUniswapV3Pool.abi, getProvider())
  let liquidity = await contract.liquidity({ blockTag: blockNumber })
  let { sqrtPriceX96, tick } = await contract.slot0({ blockTag: blockNumber })
  liquidity = JSBI.BigInt(liquidity.toString())
  sqrtPriceX96 = JSBI.BigInt(sqrtPriceX96.toString())

  return new Pool(token0, token1, feeAmount, sqrtPriceX96, liquidity, tick, [
    {
      index: nearestUsableTick(TickMath.MIN_TICK, TICK_SPACINGS[feeAmount]),
      liquidityNet: liquidity,
      liquidityGross: liquidity,
    },
    {
      index: nearestUsableTick(TickMath.MAX_TICK, TICK_SPACINGS[feeAmount]),
      liquidityNet: JSBI.multiply(liquidity, JSBI.BigInt('-1')),
      liquidityGross: liquidity,
    },
  ])
}

// use some sane defaults
export function swapOptions(options: Partial<SwapOptions>): SwapOptions {
  // If theres a fee this counts as "slippage" for the amount out, so take it into account
  let slippageTolerance = new Percent(5, 100)
  if (!!options.fee) slippageTolerance = slippageTolerance.add(options.fee.fee)
  return Object.assign(
    {
      slippageTolerance,
      recipient: TEST_RECIPIENT_ADDRESS,
    },
    options
  )
}

// alternative constructor to create from protocol-specific sdks
export function buildTrade(
  trades: (
    | V2Trade<Currency, Currency, TradeType>
    | V3Trade<Currency, Currency, TradeType>
    | MixedRouteTrade<Currency, Currency, TradeType>
  )[]
): RouterTrade<Currency, Currency, TradeType> {
  return new RouterTrade({
    v2Routes: trades
      .filter((trade) => trade instanceof V2Trade)
      .map((trade) => ({
        routev2: trade.route as RouteV2<Currency, Currency>,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
      })),
    v3Routes: trades
      .filter((trade) => trade instanceof V3Trade)
      .map((trade) => ({
        routev3: trade.route as RouteV3<Currency, Currency>,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
      })),
    mixedRoutes: trades
      .filter((trade) => trade instanceof MixedRouteTrade)
      .map((trade) => ({
        mixedRoute: trade.route as MixedRouteSDK<Currency, Currency>,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
      })),
    tradeType: trades[0].tradeType,
  })
}
