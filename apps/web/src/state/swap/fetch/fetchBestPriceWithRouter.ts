import { TradeType } from '@pancakeswap/sdk'
import { RouteType } from '@pancakeswap/smart-router/evm'

export interface RequestBody {
  networkId: number
  baseToken: string
  baseTokenName: string
  baseTokenNumDecimals: number
  quoteToken: string
  quoteTokenName: string
  quoteTokenNumDecimals: number
  baseTokenAmount?: string
  quoteTokenAmount?: string
  trader: string
}

interface Token {
  address: string
  chainId: number
  decimals: number
  symbol: string
}

interface Pair {
  liquidityToken?: Token
  stableSwapAddress?: string
  token0: Token
  token1: Token
  reserve0: string
  reserve1: string
}

export interface SmartRouterResponse {
  tradeType: TradeType
  route: {
    input: Token
    output: Token
    routeType: RouteType
    pairs: Pair[]
    path: Token[]
  }
  outputAmount: string
  inputAmount: string
}

// const body: RequestBody = {
//   networkId: 56,
//   baseToken: '0xa1faa113cbE53436Df28FF0aEe54275c13B40975',
//   baseTokenName: 'APLA',
//   baseTokenNumDecimals: 18,
//   quoteToken: '0x0782b6d8c4551B9760e74c0545a9bCD90bdc41E5',
//   quoteTokenName: 'HAY',
//   quoteTokenNumDecimals: 18,
//   baseTokenAmount: '1000000000000000000',
//   trader: 'huan',
// }

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
}

export const getBestPriceWithRouter = (requestBody: RequestBody): Promise<SmartRouterResponse> =>
  fetch('/smartRouter', {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  }).then((response) => response.json())
