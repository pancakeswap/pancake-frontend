import { Call, MultiCallV2 } from '@pancakeswap/multicall'
import { ERC20Token } from '@pancakeswap/sdk'
import { tickToPrice } from '@pancakeswap/v3-sdk'
import { BigNumber, FixedNumber } from 'ethers'
import chunk from 'lodash/chunk'
import { DEFAULT_STABLE_COINS, PriceHelper, DEFAULT_COMMON_PRICE } from '../constants/common'
import { FIXED_100, FIXED_ONE, FIXED_ZERO } from './const'
import { FarmConfigV3, FarmV3Data, FarmV3DataWithPrice } from './types'
import { getTokenAmount } from './v2/fetchFarmsV2'

const masterchefV3Abi = [
  {
    inputs: [],
    name: 'lastestPeriodCakePerSecond',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
      { internalType: 'contract ILMPool', name: 'LMPool', type: 'address' },
      { internalType: 'contract IUniswapV3Pool', name: 'v3Pool', type: 'address' },
      { internalType: 'address', name: 'token0', type: 'address' },
      { internalType: 'address', name: 'token1', type: 'address' },
      { internalType: 'uint24', name: 'fee', type: 'uint24' },
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
        name: 'lastestPeriodCakePerSecond',
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
    LMPool: string
    allocPoint: BigNumber
    fee: number
    token0: string
    token1: string
    v3Pool: string
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

export async function farmV3FetchFarms({
  farms,
  multicallv2,
  masterChefAddress,
  chainId,
  totalAllocPoint,
  latestPeriodCakePerSecond,
  tvlMap,
  commonPrice,
}: {
  farms: FarmConfigV3[]
  multicallv2: MultiCallV2
  masterChefAddress: string
  chainId: number
  totalAllocPoint: BigNumber
  latestPeriodCakePerSecond: BigNumber
  tvlMap: TvlMap
  commonPrice: CommonPrice
}) {
  const poolInfos = await fetchPoolInfos(farms, chainId, multicallv2, masterChefAddress)
  const cakePrice = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
  const lpData = await (
    await fetchPublicFarmsData(farms, chainId, multicallv2)
  ).map(([tokenBalanceLP, quoteTokenBalanceLP]: any[]) => ({
    tokenBalanceLP: FixedNumber.from(tokenBalanceLP[0]),
    quoteTokenBalanceLP: FixedNumber.from(quoteTokenBalanceLP[0]),
  }))

  const slot0s = await fetchSlot0s(farms, chainId, multicallv2)

  const farmsData = farms.map((farm, index) => {
    // alias backward compatible for v2 farms
    const { token0, token1, ...f } = farm
    return {
      ...f,
      token: token0.serialize,
      quoteToken: token1.serialize,
      ...getClassicFarmsDynamicData({
        ...lpData[index],
        ...slot0s[index],
        token0: farm.token0,
        token1: farm.token1,
      }),
      ...getFarmAllocation({
        allocPoint: poolInfos[index]?.allocPoint,
        totalAllocPoint,
      }),
    }
  })

  const combinedCommonPrice = {
    ...DEFAULT_COMMON_PRICE[chainId],
    ...commonPrice,
  }

  const farmsWithPrice = await getFarmsPrices(
    farmsData,
    chainId,
    tvlMap,
    cakePrice.price,
    latestPeriodCakePerSecond,
    combinedCommonPrice,
  )
  return farmsWithPrice
}

const getCakeApr = (poolWeight: string, activeTvlUSD: FixedNumber, cakePriceUSD: string, cakePerSeconds: BigNumber) => {
  let cakeApr = '0'

  if (
    !cakePriceUSD ||
    !activeTvlUSD ||
    activeTvlUSD.isZero() ||
    !cakePerSeconds ||
    cakePerSeconds.isZero() ||
    !poolWeight
  ) {
    return cakeApr
  }

  const cakeRewardPerYear = FixedNumber.from(cakePerSeconds.mul(365 * 60 * 60 * 24)).divUnsafe(FixedNumber.from(1e12))

  const cakeRewardPerYearForPool = FixedNumber.from(poolWeight)
    .mulUnsafe(cakeRewardPerYear)
    .mulUnsafe(FixedNumber.from(cakePriceUSD))
    .divUnsafe(FixedNumber.from(activeTvlUSD))
    .mulUnsafe(FIXED_100)

  if (!cakeRewardPerYearForPool.isZero()) {
    cakeApr = cakeRewardPerYearForPool.toUnsafeFloat().toFixed(2)
  }

  return cakeApr
}

const getClassicFarmsDynamicData = ({
  quoteTokenBalanceLP,
  tokenBalanceLP,
  token0,
  token1,
  tick,
}: {
  quoteTokenBalanceLP: FixedNumber
  tokenBalanceLP: FixedNumber
  token0: ERC20Token
  token1: ERC20Token
  tick: number
}) => {
  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = getTokenAmount(tokenBalanceLP, token0.decimals)
  const quoteTokenAmountTotal = getTokenAmount(quoteTokenBalanceLP, token1.decimals)
  const tokenPriceVsQuote = tickToPrice(token0, token1, tick)

  return {
    tokenAmountTotal: tokenAmountTotal.toString(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
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

async function fetchPublicFarmsData(farms: FarmConfigV3[], chainId: number, multicallv2: MultiCallV2) {
  try {
    const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
    const chunkSize = farmCalls.length / farms.length
    const farmMultiCallResult = await multicallv2({
      abi: [
        {
          constant: true,
          inputs: [
            {
              name: '_owner',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              name: 'balance',
              type: 'uint256',
            },
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function',
        },
      ],
      calls: farmCalls,
      chainId,
    })
    return chunk(farmMultiCallResult, chunkSize)
  } catch (error) {
    console.error('MasterChef Public Data error ', error)
    throw error
  }
}

const v3PoolAbi = [
  {
    inputs: [],
    name: 'slot0',
    outputs: [
      {
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      { internalType: 'int24', name: 'tick', type: 'int24' },
      {
        internalType: 'uint16',
        name: 'observationIndex',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinality',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'observationCardinalityNext',
        type: 'uint16',
      },
      {
        internalType: 'uint8',
        name: 'feeProtocol',
        type: 'uint8',
      },
      { internalType: 'bool', name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

async function fetchSlot0s(farms: FarmConfigV3[], chainId: number, multicallv2: MultiCallV2) {
  return multicallv2({
    abi: v3PoolAbi,
    calls: farms.map((f) => ({
      address: f.lpAddress,
      name: 'slot0',
    })),
    chainId,
  })
}

const fetchFarmCalls = (farm: FarmConfigV3) => {
  const { lpAddress, token0, token1 } = farm

  return [
    // Balance of token in the LP contract
    {
      address: token0.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: token1.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
  ]
}

export type TvlMap = {
  [key: string]: {
    token0: string
    token1: string
    updatedAt: string
  }
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

const getFarmsPrices = async (
  farms: FarmV3Data[],
  chainId: number,
  tvls: TvlMap,
  cakePriceUSD: string,
  latestPeriodCakePerSecond: BigNumber,
  commonPrice: CommonPrice,
): Promise<FarmV3DataWithPrice[]> => {
  return farms.map((farm) => {
    let tokenPriceBusd = FIXED_ZERO
    let quoteTokenPriceBusd = FIXED_ZERO

    const stableTokens = DEFAULT_STABLE_COINS[chainId as keyof typeof DEFAULT_STABLE_COINS]

    let tvl = FIXED_ZERO

    if (commonPrice[farm.quoteToken.address]) {
      quoteTokenPriceBusd = FixedNumber.from(commonPrice[farm.quoteToken.address])
    }

    if (commonPrice[farm.token.address]) {
      tokenPriceBusd = FixedNumber.from(commonPrice[farm.quoteToken.address])
    }

    if (stableTokens?.some((stableToken) => stableToken.address === farm.token.address)) {
      tokenPriceBusd = FIXED_ONE
    }

    if (stableTokens?.some((stableToken) => stableToken.address === farm.quoteToken.address)) {
      quoteTokenPriceBusd = FIXED_ONE
    }

    if (tokenPriceBusd.isZero() && !quoteTokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
      tokenPriceBusd = quoteTokenPriceBusd.mulUnsafe(FixedNumber.from(farm.tokenPriceVsQuote))
    }
    if (quoteTokenPriceBusd.isZero() && !tokenPriceBusd.isZero() && farm.tokenPriceVsQuote) {
      quoteTokenPriceBusd = tokenPriceBusd.divUnsafe(FixedNumber.from(farm.tokenPriceVsQuote))
    }

    if (!tokenPriceBusd.isZero() && !quoteTokenPriceBusd.isZero() && tvls[farm.lpAddress]) {
      tvl = tokenPriceBusd
        .mulUnsafe(FixedNumber.from(tvls[farm.lpAddress].token0))
        .addUnsafe(quoteTokenPriceBusd.mulUnsafe(FixedNumber.from(tvls[farm.lpAddress].token1)))
    }

    return {
      ...farm,
      cakeApr: getCakeApr(farm.poolWeight, tvl, cakePriceUSD, latestPeriodCakePerSecond),
      activeTvlUSD: tvl.toString(),
      tokenPriceBusd: tokenPriceBusd.toString(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toString(),
    }
  })
}
