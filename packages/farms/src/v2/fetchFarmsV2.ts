import { ChainId } from '@pancakeswap/chains'
import { BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { CurrencyParams, getCurrencyKey, getCurrencyListUsdPrice } from '@pancakeswap/price-api-sdk'
import BN from 'bignumber.js'
import { Address, PublicClient, formatUnits } from 'viem'
import { FarmV2SupportedChainId, supportedChainIdV2 } from '../const'
import { SerializedFarmConfig, isStableFarm } from '../types'
import { getFarmLpTokenPrice, getFarmsPrices } from './farmPrices'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { fetchStableFarmData } from './fetchStableFarmData'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'

const evmNativeStableLpMap: Record<
  FarmV2SupportedChainId,
  {
    address: Address
    wNative: string
    stable: string
  }
> = {
  [ChainId.ETHEREUM]: {
    address: '0x2E8135bE71230c6B1B4045696d41C09Db0414226',
    wNative: 'WETH',
    stable: 'USDC',
  },
  [ChainId.GOERLI]: {
    address: '0xf5bf0C34d3c428A74Ceb98d27d38d0036C587200',
    wNative: 'WETH',
    stable: 'tUSDC',
  },
  [ChainId.BSC]: {
    address: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    wNative: 'WBNB',
    stable: 'BUSD',
  },
  [ChainId.BSC_TESTNET]: {
    address: '0x4E96D2e92680Ca65D58A0e2eB5bd1c0f44cAB897',
    wNative: 'WBNB',
    stable: 'BUSD',
  },
}

export const getTokenAmount = (balance: BN, decimals: number) => {
  return balance.div(getFullDecimalMultiplier(decimals))
}

export type FetchFarmsParams = {
  farms: SerializedFarmConfig[]
  provider: ({ chainId }: { chainId: number }) => PublicClient
  isTestnet: boolean
  masterChefAddress: string
  chainId: number
  totalRegularAllocPoint: bigint
  totalSpecialAllocPoint: bigint
}

export async function farmV2FetchFarms({
  farms,
  provider,
  isTestnet,
  masterChefAddress,
  chainId,
  totalRegularAllocPoint,
  totalSpecialAllocPoint,
}: FetchFarmsParams) {
  if (!supportedChainIdV2.includes(chainId)) {
    return []
  }

  const stableFarms = farms.filter(isStableFarm)

  const [stableFarmsResults, poolInfos, lpDataResults] = await Promise.all([
    fetchStableFarmData(stableFarms, chainId, provider),
    fetchMasterChefData(farms, isTestnet, provider, masterChefAddress),
    fetchPublicFarmsData(farms, chainId, provider, masterChefAddress),
  ])

  const stableFarmsData = (stableFarmsResults as StableLpData[]).map(formatStableFarm)

  const stableFarmsDataMap = stableFarms.reduce<Record<number, FormatStableFarmResponse>>((map, farm, index) => {
    return {
      ...map,
      [farm.pid]: stableFarmsData[index],
    }
  }, {})

  const lpData = lpDataResults.map(formatClassicFarmResponse)

  const farmsData = farms.map((farm, index) => {
    try {
      return {
        ...farm,
        ...(stableFarmsDataMap[farm.pid]
          ? getStableFarmDynamicData({
              ...lpData[index],
              ...stableFarmsDataMap[farm.pid],
              token0Decimals: farm.token.decimals,
              token1Decimals: farm.quoteToken.decimals,
              price1: stableFarmsDataMap[farm.pid].price1,
            })
          : getClassicFarmsDynamicData({
              ...lpData[index],
              ...stableFarmsDataMap[farm.pid],
              token0Decimals: farm.token.decimals,
              token1Decimals: farm.quoteToken.decimals,
            })),
        ...getFarmAllocation({
          allocPoint: poolInfos[index]?.allocPoint,
          isRegular: poolInfos[index]?.isRegular,
          totalRegularAllocPoint,
          totalSpecialAllocPoint,
        }),
      }
    } catch (error) {
      console.error(error, farm, index, {
        allocPoint: poolInfos[index]?.allocPoint,
        isRegular: poolInfos[index]?.isRegular,
        token0Decimals: farm.token.decimals,
        token1Decimals: farm.quoteToken.decimals,
        totalRegularAllocPoint,
        totalSpecialAllocPoint,
      })
      throw error
    }
  })

  const decimals = 18
  const farmsDataWithPrices = getFarmsPrices(
    farmsData,
    evmNativeStableLpMap[chainId as FarmV2SupportedChainId],
    decimals,
  )

  const tokensWithoutPrice = farmsDataWithPrices.reduce<Map<string, CurrencyParams>>((acc, cur) => {
    if (cur.tokenPriceBusd === '0') {
      acc.set(cur.token.address, cur.token)
    }
    if (cur.quoteTokenPriceBusd === '0') {
      acc.set(cur.quoteToken.address, cur.quoteToken)
    }
    return acc
  }, new Map<string, CurrencyParams>())
  const tokenInfoList = Array.from(tokensWithoutPrice.values())
  if (tokenInfoList.length) {
    const prices = await getCurrencyListUsdPrice(tokenInfoList)

    return farmsDataWithPrices.map((f) => {
      if (f.tokenPriceBusd !== '0' && f.quoteTokenPriceBusd !== '0') {
        return f
      }
      const tokenKey = getCurrencyKey(f.token)
      const quoteTokenKey = getCurrencyKey(f.quoteToken)
      const tokenPrice = new BN(tokenKey ? prices[tokenKey] ?? 0 : 0)
      const quoteTokenPrice = new BN(quoteTokenKey ? prices[quoteTokenKey] ?? 0 : 0)
      const lpTokenPrice = getFarmLpTokenPrice(f, tokenPrice, quoteTokenPrice, decimals)
      return {
        ...f,
        tokenPriceBusd: tokenPrice.toString(),
        quoteTokenPriceBusd: quoteTokenPrice.toString(),
        lpTokenPrice: lpTokenPrice.toString(),
      }
    })
  }

  return farmsDataWithPrices
}

const masterChefV2Abi = [
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'poolInfo',
    outputs: [
      { internalType: 'uint256', name: 'accCakePerShare', type: 'uint256' },
      { internalType: 'uint256', name: 'lastRewardBlock', type: 'uint256' },
      { internalType: 'uint256', name: 'allocPoint', type: 'uint256' },
      { internalType: 'uint256', name: 'totalBoostedShare', type: 'uint256' },
      { internalType: 'bool', name: 'isRegular', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolLength',
    outputs: [{ internalType: 'uint256', name: 'pools', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalRegularAllocPoint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSpecialAllocPoint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: '_isRegular', type: 'bool' }],
    name: 'cakePerBlock',
    outputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

const masterChefFarmCalls = (farm: SerializedFarmConfig, masterChefAddress: string) => {
  const { pid } = farm

  return pid || pid === 0
    ? ({
        abi: masterChefV2Abi,
        address: masterChefAddress as Address,
        functionName: 'poolInfo',
        args: [BigInt(pid)],
      } as const)
    : null
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined
}

export const fetchMasterChefData = async (
  farms: SerializedFarmConfig[],
  isTestnet: boolean,
  provider: ({ chainId }: { chainId: number }) => PublicClient,
  masterChefAddress: string,
) => {
  try {
    const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm, masterChefAddress))
    const masterChefAggregatedCalls = masterChefCalls.filter(notEmpty)

    const chainId = isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC
    const masterChefMultiCallResult = await provider({ chainId }).multicall({
      contracts: masterChefAggregatedCalls,
      allowFailure: false,
    })

    let masterChefChunkedResultCounter = 0
    return masterChefCalls.map((masterChefCall) => {
      if (masterChefCall === null) {
        return null
      }
      const data = masterChefMultiCallResult[masterChefChunkedResultCounter]
      masterChefChunkedResultCounter++
      return {
        accCakePerShare: data[0],
        lastRewardBlock: data[1],
        allocPoint: data[2],
        totalBoostedShare: data[3],
        isRegular: data[4],
      }
    })
  } catch (error) {
    console.error('MasterChef Pool info data error', error)
    throw error
  }
}

export const fetchMasterChefV2Data = async ({
  provider,
  isTestnet,
  masterChefAddress,
}: {
  provider: ({ chainId }: { chainId: number }) => PublicClient
  isTestnet: boolean
  masterChefAddress: Address
}) => {
  try {
    const chainId = isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC
    const [poolLength, totalRegularAllocPoint, totalSpecialAllocPoint, cakePerBlock] = await provider({
      chainId,
    }).multicall({
      contracts: [
        {
          abi: masterChefV2Abi,
          address: masterChefAddress,
          functionName: 'poolLength',
        },
        {
          abi: masterChefV2Abi,
          address: masterChefAddress,
          functionName: 'totalRegularAllocPoint',
        },
        {
          abi: masterChefV2Abi,
          address: masterChefAddress,
          functionName: 'totalSpecialAllocPoint',
        },
        {
          abi: masterChefV2Abi,
          address: masterChefAddress,
          functionName: 'cakePerBlock',
          args: [true],
        },
      ],
      allowFailure: false,
    })

    return {
      poolLength,
      totalRegularAllocPoint,
      totalSpecialAllocPoint,
      cakePerBlock,
    }
  } catch (error) {
    console.error('Get MasterChef data error', error)
    throw error
  }
}

type StableLpData = [balanceResponse, balanceResponse, balanceResponse, balanceResponse]

type FormatStableFarmResponse = {
  tokenBalanceLP: BN
  quoteTokenBalanceLP: BN
  price1: bigint
}

const formatStableFarm = (stableFarmData: StableLpData): FormatStableFarmResponse => {
  const [balance1, balance2, _, _price1] = stableFarmData
  return {
    tokenBalanceLP: new BN(balance1.toString()),
    quoteTokenBalanceLP: new BN(balance2.toString()),
    price1: _price1,
  }
}

const getStableFarmDynamicData = ({
  lpTokenBalanceMC,
  lpTotalSupply,
  quoteTokenBalanceLP,
  tokenBalanceLP,
  token0Decimals,
  token1Decimals,
  price1,
}: FormatClassicFarmResponse & {
  token1Decimals: number
  token0Decimals: number
  price1: bigint
}) => {
  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = getTokenAmount(tokenBalanceLP, token0Decimals)
  const quoteTokenAmountTotal = getTokenAmount(quoteTokenBalanceLP, token1Decimals)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio =
    !lpTotalSupply.isZero() && !lpTokenBalanceMC.isZero() ? lpTokenBalanceMC.div(lpTotalSupply) : BIG_ZERO

  const tokenPriceVsQuote = formatUnits(price1, token0Decimals)

  // Amount of quoteToken in the LP that are staked in the MC
  const quoteTokenAmountMcFixed = quoteTokenAmountTotal.times(lpTokenRatio)

  // Amount of token in the LP that are staked in the MC
  const tokenAmountMcFixed = tokenAmountTotal.times(lpTokenRatio)

  const quoteTokenAmountMcFixedByTokenAmount = tokenAmountMcFixed.times(tokenPriceVsQuote)

  const lpTotalInQuoteToken = quoteTokenAmountMcFixed.plus(quoteTokenAmountMcFixedByTokenAmount)

  return {
    tokenAmountTotal: tokenAmountTotal.toString(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
    lpTotalSupply: lpTotalSupply.toString(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
    tokenPriceVsQuote,
  }
}

type balanceResponse = bigint

export type ClassicLPData = [balanceResponse, balanceResponse, balanceResponse, balanceResponse]

type FormatClassicFarmResponse = {
  tokenBalanceLP: BN
  quoteTokenBalanceLP: BN
  lpTokenBalanceMC: BN
  lpTotalSupply: BN
}

const formatClassicFarmResponse = (farmData: ClassicLPData): FormatClassicFarmResponse => {
  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply] = farmData
  return {
    tokenBalanceLP: new BN(tokenBalanceLP.toString()),
    quoteTokenBalanceLP: new BN(quoteTokenBalanceLP.toString()),
    lpTokenBalanceMC: new BN(lpTokenBalanceMC.toString()),
    lpTotalSupply: new BN(lpTotalSupply.toString()),
  }
}

interface FarmAllocationParams {
  allocPoint?: bigint
  isRegular?: boolean
  totalRegularAllocPoint: bigint
  totalSpecialAllocPoint: bigint
}

const getFarmAllocation = ({
  allocPoint,
  isRegular,
  totalRegularAllocPoint,
  totalSpecialAllocPoint,
}: FarmAllocationParams) => {
  const _allocPoint = allocPoint ? new BN(allocPoint.toString()) : BIG_ZERO
  const totalAlloc = isRegular ? totalRegularAllocPoint : totalSpecialAllocPoint
  const poolWeight = !!totalAlloc && !!_allocPoint ? _allocPoint.div(totalAlloc.toString()) : BIG_ZERO

  return {
    poolWeight: poolWeight.toString(),
    multiplier: !_allocPoint.isZero() ? `${+_allocPoint.div(10).toString()}X` : `0X`,
  }
}

const getClassicFarmsDynamicData = ({
  lpTokenBalanceMC,
  lpTotalSupply,
  quoteTokenBalanceLP,
  tokenBalanceLP,
  token0Decimals,
  token1Decimals,
}: FormatClassicFarmResponse & {
  token0Decimals: number
  token1Decimals: number
  lpTokenStakedAmount?: string
}) => {
  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = getTokenAmount(tokenBalanceLP, token0Decimals)
  const quoteTokenAmountTotal = getTokenAmount(quoteTokenBalanceLP, token1Decimals)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio =
    !lpTotalSupply.isZero() && !lpTokenBalanceMC.isZero() ? lpTokenBalanceMC.div(lpTotalSupply) : BIG_ZERO

  // // Amount of quoteToken in the LP that are staked in the MC
  const quoteTokenAmountMcFixed = quoteTokenAmountTotal.times(lpTokenRatio)

  // // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMcFixed.times(BIG_TWO)

  return {
    tokenAmountTotal: tokenAmountTotal.toString(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
    lpTotalSupply: lpTotalSupply.toString(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
    tokenPriceVsQuote:
      !quoteTokenAmountTotal.isZero() && !tokenAmountTotal.isZero()
        ? quoteTokenAmountTotal.div(tokenAmountTotal).toString()
        : BIG_ZERO.toString(),
    lpTokenStakedAmount: lpTokenBalanceMC.toString(),
  }
}
