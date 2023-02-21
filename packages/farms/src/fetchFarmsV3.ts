import { Call, MultiCallV2 } from '@pancakeswap/multicall'
import { ChainId, ERC20Token } from '@pancakeswap/sdk'
import { bscTokens, ethereumTokens } from '@pancakeswap/tokens'
import { tickToPrice } from '@pancakeswap/v3-sdk'
import { BigNumber, FixedNumber } from 'ethers'
import chunk from 'lodash/chunk'
import { FIXED_ZERO } from './const'
import { getTokenAmount } from './fetchFarmsV2'
import { FarmV3Data, FarmV3DataWithPrice, SerializedFarmConfig, SerializedFarmPublicData } from './types'

const whitelistedUSDValueTokens = {
  [ChainId.ETHEREUM]: {
    chain: 'ethereum',
    list: [ethereumTokens.weth, ethereumTokens.usdc],
  },
  [ChainId.BSC]: {
    chain: 'bsc',
    list: [bscTokens.wbnb, bscTokens.usdc, bscTokens.busd],
  },
} satisfies Record<
  number,
  {
    chain: string
    list: ERC20Token[]
  }
>

const supportedChainIdSubgraph = [ChainId.BSC, ChainId.GOERLI, ChainId.ETHEREUM]

const masterchefV3Abi = [
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
}) {
  const [[poolLength], [totalAllocPoint]] = await multicallv2({
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
    ],
    chainId,
  })

  return {
    poolLength,
    totalAllocPoint,
  }
}

const fetchPoolInfos = async (
  farms: SerializedFarmConfig[],
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
}: {
  farms: SerializedFarmConfig[]
  multicallv2: MultiCallV2
  masterChefAddress: string
  chainId: number
  totalAllocPoint: BigNumber
}) {
  const poolInfos = await fetchPoolInfos(farms, chainId, multicallv2, masterChefAddress)

  const lpData = await (
    await fetchPublicFarmsData(farms, chainId, multicallv2)
  ).map(([tokenBalanceLP, quoteTokenBalanceLP]: any[]) => ({
    tokenBalanceLP: FixedNumber.from(tokenBalanceLP[0]),
    quoteTokenBalanceLP: FixedNumber.from(quoteTokenBalanceLP[0]),
  }))

  const slot0s = await fetchSlot0s(farms, chainId, multicallv2)

  const tvls: TvlMap = {}
  if (supportedChainIdSubgraph) {
    const results = await Promise.all(
      farms.map((f) => fetch(`/api/farm-tvl/${chainId}/${f.lpAddress}`).then((res) => res.json())),
    )
    results.forEach((r, i) => {
      tvls[farms[i].lpAddress] = r.formatted
    })
  }

  const farmsData = farms.map((farm, index) => {
    return {
      ...farm,
      ...getClassicFarmsDynamicData({
        ...lpData[index],
        ...slot0s[index],
        token0: farm.token,
        token1: farm.quoteToken,
      }),
      ...getFarmAllocation({
        allocPoint: poolInfos[index]?.allocPoint,
        totalAllocPoint,
      }),
    }
  })

  const farmsWithPrice = await getFarmsPrices(farmsData, chainId, tvls)
  return farmsWithPrice
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

async function fetchPublicFarmsData(farms: SerializedFarmConfig[], chainId: number, multicallv2: MultiCallV2) {
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

async function fetchSlot0s(farms: SerializedFarmConfig[], chainId: number, multicallv2: MultiCallV2) {
  return multicallv2({
    abi: v3PoolAbi,
    calls: farms.map((f) => ({
      address: f.lpAddress,
      name: 'slot0',
    })),
    chainId,
  })
}

const fetchFarmCalls = (farm: SerializedFarmPublicData) => {
  const { lpAddress, token, quoteToken } = farm

  return [
    // Balance of token in the LP contract
    {
      address: token.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      address: quoteToken.address,
      name: 'balanceOf',
      params: [lpAddress],
    },
  ]
}

export type TvlMap = {
  [key: string]: {
    token0: string
    token1: string
  }
}

const getFarmsPrices = async (farms: FarmV3Data[], chainId: number, tvls: TvlMap): Promise<FarmV3DataWithPrice[]> => {
  const commonPairsUSDValue: { [address: string]: string } = {}
  if (
    whitelistedUSDValueTokens[chainId as keyof typeof whitelistedUSDValueTokens] &&
    whitelistedUSDValueTokens[chainId as keyof typeof whitelistedUSDValueTokens].list.length > 0
  ) {
    const list = whitelistedUSDValueTokens[chainId as keyof typeof whitelistedUSDValueTokens].list
      .map(
        (token) =>
          `${whitelistedUSDValueTokens[chainId as keyof typeof whitelistedUSDValueTokens].chain}:${token.address}`,
      )
      .join(',')
    const result: { coins: { [key: string]: { price: string } } } = await fetch(
      `https://coins.llama.fi/prices/current/${list}`,
    ).then((res) => res.json())

    Object.entries(result.coins || {}).forEach(([key, value]) => {
      const [, address] = key.split(':')
      commonPairsUSDValue[address] = value.price
    })
  }

  return farms.map((farm) => {
    let tokenPriceBusd = FIXED_ZERO
    let quoteTokenPriceBusd = FIXED_ZERO

    let tvl = FIXED_ZERO

    if (commonPairsUSDValue[farm.quoteToken.address]) {
      quoteTokenPriceBusd = FixedNumber.from(commonPairsUSDValue[farm.quoteToken.address])
    }

    if (commonPairsUSDValue[farm.token.address]) {
      tokenPriceBusd = FixedNumber.from(commonPairsUSDValue[farm.quoteToken.address])
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
      activeTVL: tvl.toString(),
      tokenPriceBusd: tokenPriceBusd.toString(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toString(),
    }
  })
}
