import { Call, MultiCallV2 } from '@pancakeswap/multicall'
import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { tickToPrice } from '@pancakeswap/v3-sdk'
import BN from 'bignumber.js'
import { BigNumber, FixedNumber } from 'ethers'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import chunk from 'lodash/chunk'
import { GetResult } from '@pancakeswap/utils/abitype'
import { DEFAULT_COMMON_PRICE, PriceHelper } from '../constants/common'
import { FIXED_ZERO } from './const'
import { FarmConfigV3, FarmV3Data, FarmV3DataWithPrice } from './types'

export async function farmV3FetchFarms({
  farms,
  multicallv2,
  masterChefAddress,
  chainId,
  totalAllocPoint,
  commonPrice,
}: {
  farms: FarmConfigV3[]
  multicallv2: MultiCallV2
  masterChefAddress: string
  chainId: number
  totalAllocPoint: BigNumber
  commonPrice: CommonPrice
}) {
  const [poolInfos, cakePrice, v3PoolData] = await Promise.all([
    fetchPoolInfos(farms, chainId, multicallv2, masterChefAddress),
    (await fetch('https://farms-api.pancakeswap.com/price/cake')).json(),
    fetchV3Pools(farms, chainId, multicallv2),
  ])

  const lmPoolInfos = await fetchLmPools(
    v3PoolData.map((v3Pool) => v3Pool[1][0]),
    chainId,
    multicallv2,
  )

  const farmsData = farms.map((farm, index) => {
    const { token, quoteToken, ...f } = farm
    const lmPoolAddress = v3PoolData[index][1][0]
    return {
      ...f,
      token,
      quoteToken,
      lmPool: lmPoolAddress,
      lmPoolLiquidity: lmPoolInfos[lmPoolAddress].liquidity,
      _rewardGrowthGlobalX128: lmPoolInfos[lmPoolAddress].rewardGrowthGlobalX128,
      ...getV3FarmsDynamicData({
        ...(v3PoolData[index][0] as any),
        token0: farm.token,
        token1: farm.quoteToken,
      }),
      ...getFarmAllocation({
        allocPoint: poolInfos[index]?.allocPoint,
        totalAllocPoint,
      }),
    }
  })

  const combinedCommonPrice: CommonPrice = {
    ...DEFAULT_COMMON_PRICE[chainId as ChainId],
    ...commonPrice,
  }

  const farmsWithPrice = getFarmsPrices(farmsData, cakePrice.price, combinedCommonPrice)

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
]

export async function fetchMasterChefV3Data({
  multicallv2,
  masterChefAddress,
  chainId,
}: {
  multicallv2: MultiCallV2
  masterChefAddress: string
  chainId: number
}): Promise<{
  poolLength: BigNumber
  totalAllocPoint: BigNumber
  latestPeriodCakePerSecond: BigNumber
}> {
  const [[poolLength], [totalAllocPoint], [latestPeriodCakePerSecond]] = await multicallv2({
    abi: masterchefV3Abi,
    calls: [
      {
        address: masterChefAddress,
        name: 'poolLength',
      },
      {
        address: masterChefAddress,
        name: 'totalAllocPoint',
      },
      {
        address: masterChefAddress,
        name: 'latestPeriodCakePerSecond',
      },
    ],
    chainId,
  })

  return {
    poolLength,
    totalAllocPoint,
    latestPeriodCakePerSecond,
  }
}

const fetchPoolInfos = async (
  farms: FarmConfigV3[],
  chainId: number,
  multicallv2: MultiCallV2,
  masterChefAddress: string,
): Promise<
  {
    allocPoint: BigNumber
    v3Pool: string
    token0: string
    token1: string
    fee: number
    totalLiquidity: BigNumber
    totalBoostLiquidity: BigNumber
  }[]
> => {
  try {
    const calls: Call[] = farms.map((farm) => ({
      address: masterChefAddress,
      name: 'poolInfo',
      params: [farm.pid],
    }))

    const masterChefMultiCallResult = await multicallv2({
      abi: masterchefV3Abi,
      calls,
      chainId,
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
  let cakeApr = '0'

  if (
    !cakePriceUSD ||
    !activeTvlUSD ||
    activeTvlUSD.isZero() ||
    !cakePerSecond ||
    +cakePerSecond === 0 ||
    !poolWeight
  ) {
    return cakeApr
  }

  const cakeRewardPerYear = new BN(cakePerSecond).times(365 * 60 * 60 * 24)

  const cakeRewardPerYearForPool = new BN(poolWeight)
    .times(cakeRewardPerYear)
    .times(cakePriceUSD)
    .div(activeTvlUSD.toString())
    .times(100)

  if (!cakeRewardPerYearForPool.isZero()) {
    cakeApr = cakeRewardPerYearForPool.toFixed(6)
  }

  return cakeApr
}

const getV3FarmsDynamicData = ({ token0, token1, tick }: { token0: ERC20Token; token1: ERC20Token; tick: number }) => {
  const tokenPriceVsQuote = tickToPrice(token0, token1, tick)

  return {
    tokenPriceVsQuote: tokenPriceVsQuote.toSignificant(6),
  }
}

const getFarmAllocation = ({
  allocPoint,
  totalAllocPoint,
}: {
  allocPoint?: BigNumber
  totalAllocPoint?: BigNumber
}) => {
  const _allocPoint = allocPoint ? FixedNumber.from(allocPoint) : FIXED_ZERO
  const poolWeight =
    !totalAllocPoint?.isZero() && !_allocPoint.isZero()
      ? _allocPoint.divUnsafe(FixedNumber.from(totalAllocPoint))
      : FIXED_ZERO

  return {
    poolWeight: poolWeight.toString(),
    multiplier: !_allocPoint.isZero() ? `${+_allocPoint.divUnsafe(FixedNumber.from(10)).toString()}X` : `0X`,
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

type Slot0 = GetResult<typeof v3PoolAbi, 'slot0'>
type LmPool = GetResult<typeof v3PoolAbi, 'lmPool'>

type LmLiquidity = GetResult<typeof lmPoolAbi, 'lmLiquidity'>
type LmRewardGrowthGlobalX128 = GetResult<typeof lmPoolAbi, 'rewardGrowthGlobalX128'>

async function fetchLmPools(lmPoolAddresses: string[], chainId: number, multicallv2: MultiCallV2) {
  const lmPoolCalls = lmPoolAddresses.flatMap((address) => [
    {
      address,
      name: 'lmLiquidity',
    },
    {
      address,
      name: 'rewardGrowthGlobalX128',
    },
  ])

  const chunkSize = lmPoolCalls.length / lmPoolAddresses.length

  const resp = await multicallv2({
    abi: lmPoolAbi,
    calls: lmPoolCalls,
    chainId,
  })

  const chunked = chunk(resp, chunkSize) as [LmLiquidity, LmRewardGrowthGlobalX128][]

  const lmPools: Record<
    string,
    {
      liquidity: string
      rewardGrowthGlobalX128: string
    }
  > = {}

  for (const [index, res] of chunked.entries()) {
    lmPools[lmPoolAddresses[index]] = {
      liquidity: res?.[0]?.toString() ?? '0',
      rewardGrowthGlobalX128: res?.[1]?.toString() ?? '0',
    }
  }

  return lmPools
}

async function fetchV3Pools(farms: FarmConfigV3[], chainId: number, multicallv2: MultiCallV2) {
  const v3PoolCalls = farms.flatMap((f) => [
    {
      address: f.lpAddress,
      name: 'slot0',
    },
    {
      address: f.lpAddress,
      name: 'lmPool',
    },
  ])

  const chunkSize = v3PoolCalls.length / farms.length
  const resp = await multicallv2({
    abi: v3PoolAbi,
    calls: v3PoolCalls,
    chainId,
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
  const commonTokenUSDValue: CommonPrice = {}
  if (priceHelper && priceHelper.list.length > 0) {
    const list = priceHelper.list.map((token) => `${priceHelper.chain}:${token.address}`).join(',')
    const result: { coins: { [key: string]: { price: string } } } = await fetch(
      `https://coins.llama.fi/prices/current/${list}`,
    ).then((res) => res.json())

    Object.entries(result.coins || {}).forEach(([key, value]) => {
      const [, address] = key.split(':')
      commonTokenUSDValue[address] = value.price
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
