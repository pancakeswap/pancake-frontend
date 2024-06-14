import { ChainId } from '@pancakeswap/chains'
import { Currency, ERC20Token } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { tickToPrice } from '@pancakeswap/v3-sdk'
import BN from 'bignumber.js'
import chunk from 'lodash/chunk'
import { Address, PublicClient, formatUnits, getAddress } from 'viem'

import { getCurrencyListUsdPrice } from '@pancakeswap/price-api-sdk'
import { DEFAULT_COMMON_PRICE, PriceHelper } from '../constants/common'
import { getFarmApr } from './apr'
import { FarmV3SupportedChainId, supportedChainIdV3 } from './const'
import { ComputedFarmConfigV3, FarmV3Data, FarmV3DataWithPrice } from './types'

const chainlinkAbi = [
  {
    inputs: [],
    name: 'latestAnswer',
    outputs: [{ internalType: 'int256', name: '', type: 'int256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export async function farmV3FetchFarms({
  farms,
  provider,
  masterChefAddress,
  chainId,
  totalAllocPoint,
  commonPrice,
}: {
  farms: ComputedFarmConfigV3[]
  provider: ({ chainId }: { chainId: number }) => PublicClient
  masterChefAddress: Address
  chainId: number
  totalAllocPoint: bigint
  commonPrice: CommonPrice
}) {
  const [poolInfos, cakePrice, v3PoolData] = await Promise.all([
    fetchPoolInfos(farms, chainId, provider, masterChefAddress),
    provider({ chainId: ChainId.BSC })
      .readContract({
        abi: chainlinkAbi,
        address: '0xB6064eD41d4f67e353768aA239cA86f4F73665a1',
        functionName: 'latestAnswer',
      })
      .then((res) => formatUnits(res, 8)),
    fetchV3Pools(farms, chainId, provider),
  ])

  const lmPoolInfos = await fetchLmPools(
    v3PoolData.map((v3Pool) => (v3Pool[1] ? v3Pool[1] : null)).filter(Boolean) as Address[],
    chainId,
    provider,
  )

  const farmsData = farms
    .map((farm, index) => {
      const { token, quoteToken, ...f } = farm
      if (!v3PoolData[index][1]) {
        return null
      }
      const lmPoolAddress = v3PoolData[index][1]
      return {
        ...f,
        token,
        quoteToken,
        lmPool: lmPoolAddress,
        lmPoolLiquidity: lmPoolInfos[lmPoolAddress].liquidity,
        _rewardGrowthGlobalX128: lmPoolInfos[lmPoolAddress].rewardGrowthGlobalX128,
        ...getV3FarmsDynamicData({
          tick: v3PoolData[index][0][1],
          token0: farm.token,
          token1: farm.quoteToken,
        }),
        ...getFarmAllocation({
          allocPoint: poolInfos[index]?.[0],
          totalAllocPoint,
        }),
      }
    })
    .filter(Boolean) as FarmV3Data[]

  const defaultCommonPrice: CommonPrice = supportedChainIdV3.includes(chainId)
    ? DEFAULT_COMMON_PRICE[chainId as FarmV3SupportedChainId]
    : {}
  const combinedCommonPrice: CommonPrice = {
    ...defaultCommonPrice,
    ...commonPrice,
  }

  const farmsWithPrice = getFarmsPrices(farmsData, cakePrice, combinedCommonPrice)

  return farmsWithPrice
}

const masterchefV3Abi = [
  {
    inputs: [],
    name: 'latestPeriodCakePerSecond',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
      { internalType: 'contract IPancakeV3Pool', name: 'v3Pool', type: 'address' },
      { internalType: 'address', name: 'token0', type: 'address' },
      { internalType: 'address', name: 'token1', type: 'address' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
      { internalType: 'uint256', name: 'totalLiquidity', type: 'uint256' },
      { internalType: 'uint256', name: 'totalBoostLiquidity', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolLength',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAllocPoint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

export async function fetchMasterChefV3Data({
  provider,
  masterChefAddress,
  chainId,
}: {
  provider: ({ chainId }: { chainId: number }) => PublicClient
  masterChefAddress: Address
  chainId: number
}): Promise<{
  poolLength: bigint
  totalAllocPoint: bigint
  latestPeriodCakePerSecond: bigint
}> {
  const [poolLength, totalAllocPoint, latestPeriodCakePerSecond] = await provider({ chainId }).multicall({
    contracts: [
      {
        address: masterChefAddress,
        abi: masterchefV3Abi,
        functionName: 'poolLength',
      },
      {
        address: masterChefAddress,
        abi: masterchefV3Abi,
        functionName: 'totalAllocPoint',
      },
      {
        address: masterChefAddress,
        abi: masterchefV3Abi,
        functionName: 'latestPeriodCakePerSecond',
      },
    ],
    allowFailure: false,
  })

  return {
    poolLength,
    totalAllocPoint,
    latestPeriodCakePerSecond,
  }
}

/**
 *
 * @returns
 * ```
   {
    // allocPoint: BigNumber
    0: bigint
    // v3Pool: string
    1: Address
    // token0: string
    2: Address
    // token1: string
    3: Address
    // fee: number
    4: number
    // totalLiquidity: BigNumber
    5: bigint
    // totalBoostLiquidity: BigNumber
    6: bigint
  }[]
 * ```
 */
const fetchPoolInfos = async (
  farms: ComputedFarmConfigV3[],
  chainId: number,
  provider: ({ chainId }: { chainId: number }) => PublicClient,
  masterChefAddress: Address,
) => {
  try {
    const calls = farms.map(
      (farm) =>
        ({
          abi: masterchefV3Abi,
          address: masterChefAddress,
          functionName: 'poolInfo',
          args: [BigInt(farm.pid)] as const,
        } as const),
    )

    const masterChefMultiCallResult = await provider({ chainId }).multicall({
      contracts: calls,
      allowFailure: false,
    })

    let masterChefChunkedResultCounter = 0
    return calls.map((masterChefCall) => {
      if (masterChefCall === null) {
        return null
      }
      const data = masterChefMultiCallResult[masterChefChunkedResultCounter]
      masterChefChunkedResultCounter++
      return data
    })
  } catch (error) {
    console.error('MasterChef Pool info data error', error)
    throw error
  }
}

export const getCakeApr = (poolWeight: string, activeTvlUSD: BN, cakePriceUSD: string, cakePerSecond: string) => {
  return getFarmApr({
    poolWeight,
    tvlUsd: activeTvlUSD,
    cakePriceUsd: cakePriceUSD,
    cakePerSecond,
    precision: 6,
  })
}

const getV3FarmsDynamicData = ({ token0, token1, tick }: { token0: ERC20Token; token1: ERC20Token; tick: number }) => {
  const tokenPriceVsQuote = tickToPrice(token0, token1, tick)

  return {
    tokenPriceVsQuote: tokenPriceVsQuote.toSignificant(6),
  }
}

const getFarmAllocation = ({ allocPoint, totalAllocPoint }: { allocPoint?: bigint; totalAllocPoint?: bigint }) => {
  const _allocPoint = typeof allocPoint !== 'undefined' ? new BN(allocPoint.toString()) : BIG_ZERO
  const poolWeight = !!totalAllocPoint && !_allocPoint.isZero() ? _allocPoint.div(totalAllocPoint.toString()) : BIG_ZERO

  return {
    poolWeight: poolWeight.toString(),
    multiplier: !_allocPoint.isZero() ? `${+_allocPoint.div(10).toString()}X` : `0X`,
  }
}

const lmPoolAbi = [
  {
    inputs: [],
    name: 'lmLiquidity',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardGrowthGlobalX128',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const v3PoolAbi = [
  {
    inputs: [],
    name: 'lmPool',
    outputs: [{ internalType: 'contract IPancakeV3LmPool', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      { internalType: 'uint160', name: 'sqrtPriceX96', type: 'uint160' },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      { internalType: 'uint16', name: 'observationIndex', type: 'uint16' },
      { internalType: 'uint16', name: 'observationCardinality', type: 'uint16' },
      { internalType: 'uint16', name: 'observationCardinalityNext', type: 'uint16' },
      { internalType: 'uint32', name: 'feeProtocol', type: 'uint32' },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

type Slot0 = [
  // sqrtPriceX96: BigNumber
  bigint,
  // tick: number
  number,
  // observationIndex: number
  number,
  // observationCardinality: number
  number,
  // observationCardinalityNext: number
  number,
  // feeProtocol: number
  // unlocked: boolean
  boolean,
]
type LmPool = `0x${string}`

async function fetchLmPools(
  lmPoolAddresses: Address[],
  chainId: number,
  provider: ({ chainId }: { chainId: number }) => PublicClient,
) {
  const lmPoolCalls = lmPoolAddresses.flatMap(
    (address) =>
      [
        {
          abi: lmPoolAbi,
          address,
          functionName: 'lmLiquidity',
        },
        {
          abi: lmPoolAbi,
          address,
          functionName: 'rewardGrowthGlobalX128',
        },
      ] as const,
  )

  const chunkSize = lmPoolCalls.length / lmPoolAddresses.length

  const resp = await provider({ chainId }).multicall({
    contracts: lmPoolCalls,
    allowFailure: true,
  })

  const chunked = chunk(resp, chunkSize)

  const lmPools: Record<
    string,
    {
      liquidity: string
      rewardGrowthGlobalX128: string
    }
  > = {}

  for (const [index, res] of chunked.entries()) {
    lmPools[lmPoolAddresses[index]] = {
      liquidity: res?.[0]?.result?.toString() ?? '0',
      rewardGrowthGlobalX128: res?.[1]?.result?.toString() ?? '0',
    }
  }

  return lmPools
}

async function fetchV3Pools(
  farms: ComputedFarmConfigV3[],
  chainId: number,
  provider: ({ chainId }: { chainId: number }) => PublicClient,
) {
  const v3PoolCalls = farms.flatMap(
    (f) =>
      [
        {
          abi: v3PoolAbi,
          address: f.lpAddress,
          functionName: 'slot0',
        },
        {
          abi: v3PoolAbi,
          address: f.lpAddress,
          functionName: 'lmPool',
        },
      ] as const,
  )

  const chunkSize = v3PoolCalls.length / farms.length
  const resp = await provider({ chainId }).multicall({
    contracts: v3PoolCalls,
    allowFailure: false,
  })

  return chunk(resp, chunkSize) as [Slot0, LmPool][]
}

export type LPTvl = {
  token0: string
  token1: string
  updatedAt: string
}

export type TvlMap = {
  [key: string]: LPTvl | null
}

export type CommonPrice = {
  [address: string]: string
}

export const fetchCommonTokenUSDValue = async (priceHelper?: PriceHelper): Promise<CommonPrice> => {
  return fetchTokenUSDValues(priceHelper?.list || [])
}

export const fetchTokenUSDValues = async (currencies: Currency[] = []): Promise<CommonPrice> => {
  const commonTokenUSDValue: CommonPrice = {}
  if (!supportedChainIdV3.includes(currencies[0]?.chainId)) {
    return commonTokenUSDValue
  }

  if (currencies.length > 0) {
    const prices = await getCurrencyListUsdPrice(currencies)

    Object.entries(prices || {}).forEach(([key, value]) => {
      const [, address] = key.split(':')
      commonTokenUSDValue[getAddress(address)] = value.toString()
    })
  }

  return commonTokenUSDValue
}

export function getFarmsPrices(
  farms: FarmV3Data[],
  cakePriceUSD: string,
  commonPrice: CommonPrice,
): FarmV3DataWithPrice[] {
  const commonPriceFarms = farms.map((farm) => {
    let tokenPriceBusd = BIG_ZERO
    let quoteTokenPriceBusd = BIG_ZERO

    // try to get price via common price
    if (commonPrice[farm.quoteToken.address]) {
      quoteTokenPriceBusd = new BN(commonPrice[farm.quoteToken.address])
    }
    if (commonPrice[farm.token.address]) {
      tokenPriceBusd = new BN(commonPrice[farm.token.address])
    }

    // try price via CAKE
    if (
      tokenPriceBusd.isZero() &&
      farm.token.chainId in CAKE &&
      farm.token.equals(CAKE[farm.token.chainId as keyof typeof CAKE])
    ) {
      tokenPriceBusd = new BN(cakePriceUSD)
    }
    if (
      quoteTokenPriceBusd.isZero() &&
      farm.quoteToken.chainId in CAKE &&
      farm.quoteToken.equals(CAKE[farm.quoteToken.chainId as keyof typeof CAKE])
    ) {
      quoteTokenPriceBusd = new BN(cakePriceUSD)
    }

    // try to get price via token price vs quote
    if (tokenPriceBusd.isZero() && !quoteTokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
      tokenPriceBusd = quoteTokenPriceBusd.times(farm.tokenPriceVsQuote)
    }
    if (quoteTokenPriceBusd.isZero() && !tokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
      quoteTokenPriceBusd = tokenPriceBusd.div(farm.tokenPriceVsQuote)
    }

    return {
      ...farm,
      tokenPriceBusd,
      quoteTokenPriceBusd,
    }
  })

  return commonPriceFarms.map((farm) => {
    let { tokenPriceBusd, quoteTokenPriceBusd } = farm
    // if token price is zero, try to get price from existing farms
    if (tokenPriceBusd.isZero()) {
      const ifTokenPriceFound = commonPriceFarms.find(
        (f) =>
          (farm.token.equals(f.token) && !f.tokenPriceBusd.isZero()) ||
          (farm.token.equals(f.quoteToken) && !f.quoteTokenPriceBusd.isZero()),
      )
      if (ifTokenPriceFound) {
        tokenPriceBusd = farm.token.equals(ifTokenPriceFound.token)
          ? ifTokenPriceFound.tokenPriceBusd
          : ifTokenPriceFound.quoteTokenPriceBusd
      }
      if (quoteTokenPriceBusd.isZero()) {
        const ifQuoteTokenPriceFound = commonPriceFarms.find(
          (f) =>
            (farm.quoteToken.equals(f.token) && !f.tokenPriceBusd.isZero()) ||
            (farm.quoteToken.equals(f.quoteToken) && !f.quoteTokenPriceBusd.isZero()),
        )
        if (ifQuoteTokenPriceFound) {
          quoteTokenPriceBusd = farm.quoteToken.equals(ifQuoteTokenPriceFound.token)
            ? ifQuoteTokenPriceFound.tokenPriceBusd
            : ifQuoteTokenPriceFound.quoteTokenPriceBusd
        }

        // try to get price via token price vs quote
        if (tokenPriceBusd.isZero() && !quoteTokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
          tokenPriceBusd = quoteTokenPriceBusd.times(farm.tokenPriceVsQuote)
        }
        if (quoteTokenPriceBusd.isZero() && !tokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
          quoteTokenPriceBusd = tokenPriceBusd.div(farm.tokenPriceVsQuote)
        }

        if (tokenPriceBusd.isZero()) {
          console.error(`Can't get price for ${farm.token.address}`)
        }
        if (quoteTokenPriceBusd.isZero()) {
          console.error(`Can't get price for ${farm.quoteToken.address}`)
        }
      }
    }

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toString(),
      // adjust the quote token price by the token price vs quote
      quoteTokenPriceBusd:
        !quoteTokenPriceBusd.isZero() && farm.tokenPriceVsQuote
          ? tokenPriceBusd.div(farm.tokenPriceVsQuote).toString()
          : quoteTokenPriceBusd.toString(),
    }
  })
}
