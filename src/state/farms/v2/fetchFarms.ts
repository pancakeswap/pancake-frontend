import { ChainId } from '@pancakeswap/sdk'
import { multicallv2 } from 'utils/multicall'
import masterChefV2Abi from 'config/abi/masterchef.json'
import { SerializedFarmConfig } from 'config/constants/types'
import addresses from 'config/constants/contracts'
import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { fetchPublicFarmsData } from './fetchPublicFarmData'
import { FIXED_TWO, FIXED_ZERO, BIG_TEN } from './const'
import { getFarmsPrices } from './farmPrices'

export const getTokenAmount = (balance: FixedNumber, decimals: number) => {
  const tokenDividerFixed = FixedNumber.from(BIG_TEN.pow(decimals))
  return balance.divUnsafe(tokenDividerFixed)
}

export async function farmV2FetchFarms({
  farms,
  isTestnet,
  chainId,
  totalRegularAllocPoint,
  totalSpecialAllocPoint,
}: {
  farms
  isTestnet: boolean
  chainId: number
  totalRegularAllocPoint: BigNumber
  totalSpecialAllocPoint: BigNumber
}) {
  const lpData = (await fetchPublicFarmsData(farms, chainId)).map(formatFarmResponse)
  const poolInfos = await fetchMasterChefData(farms, isTestnet)

  // const lpAprs = getAprs

  const farmsData = farms.map((farm, index) => {
    try {
      return {
        pid: farm.pid,
        ...farm,
        // lpApr: lpAprs?.[farm.lpAddress] || 0,
        ...getFarmsDynamicData({
          ...lpData[index],
          allocPoint: poolInfos[index]?.allocPoint,
          isRegular: poolInfos[index]?.isRegular,
          token0Decimals: farm.token.decimals,
          token1Decimals: farm.quoteToken.decimals,
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

  const farmsDataWithPrices = getFarmsPrices(farmsData, chainId)

  return farmsDataWithPrices
}

const masterChefFarmCalls = (farm: SerializedFarmConfig, isTestnet: boolean) => {
  const { pid } = farm
  const masterChefAddress = isTestnet ? addresses.masterChef[ChainId.BSC_TESTNET] : addresses.masterChef[ChainId.BSC]

  return pid || pid === 0
    ? {
        address: masterChefAddress,
        name: 'poolInfo',
        params: [pid],
      }
    : null
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[], isTestnet: boolean): Promise<any[]> => {
  try {
    const masterChefCalls = farms.map((farm) => masterChefFarmCalls(farm, isTestnet))
    const masterChefAggregatedCalls = masterChefCalls.filter((masterChefCall) => masterChefCall !== null)

    const masterChefMultiCallResult = await multicallv2({
      abi: masterChefV2Abi,
      calls: masterChefAggregatedCalls,
      chainId: isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC,
    })

    let masterChefChunkedResultCounter = 0
    return masterChefCalls.map((masterChefCall) => {
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

export const fetchMasterChefV2Data = async (isTestnet: boolean) => {
  try {
    const masterChefV2Address = isTestnet
      ? addresses.masterChef[ChainId.BSC_TESTNET]
      : addresses.masterChef[ChainId.BSC]

    const [[poolLength], [totalRegularAllocPoint], [totalSpecialAllocPoint], [cakePerBlock]] = await multicallv2<
      [[BigNumber], [BigNumber], [BigNumber], [BigNumber]]
    >({
      abi: masterChefV2Abi,
      calls: [
        {
          address: masterChefV2Address,
          name: 'poolLength',
        },
        {
          address: masterChefV2Address,
          name: 'totalRegularAllocPoint',
        },
        {
          address: masterChefV2Address,
          name: 'totalSpecialAllocPoint',
        },
        {
          address: masterChefV2Address,
          name: 'cakePerBlock',
          params: [true],
        },
      ],
      chainId: isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC,
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

type balanceResponse = [BigNumber]
type decimalsResponse = [number]

export type LPData = [
  balanceResponse,
  balanceResponse,
  balanceResponse,
  balanceResponse,
  decimalsResponse,
  decimalsResponse,
]

type FormatFarmResponse = {
  tokenBalanceLP: FixedNumber
  quoteTokenBalanceLP: FixedNumber
  lpTokenBalanceMC: FixedNumber
  lpTotalSupply: FixedNumber
}

const formatFarmResponse = (farmData: LPData): FormatFarmResponse => {
  const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply] = farmData
  return {
    tokenBalanceLP: FixedNumber.from(tokenBalanceLP[0]),
    quoteTokenBalanceLP: FixedNumber.from(quoteTokenBalanceLP[0]),
    lpTokenBalanceMC: FixedNumber.from(lpTokenBalanceMC[0]),
    lpTotalSupply: FixedNumber.from(lpTotalSupply[0]),
  }
}

export const getFarmsDynamicData = ({
  lpTokenBalanceMC,
  lpTotalSupply,
  quoteTokenBalanceLP,
  tokenBalanceLP,
  totalRegularAllocPoint,
  totalSpecialAllocPoint,
  token0Decimals,
  token1Decimals,
  allocPoint,
  isRegular,
}: FormatFarmResponse & {
  allocPoint?: BigNumber
  isRegular?: boolean
  totalRegularAllocPoint: BigNumber
  totalSpecialAllocPoint: BigNumber
  token0Decimals: number
  token1Decimals: number
}) => {
  // Raw amount of token in the LP, including those not staked
  const tokenAmountTotal = getTokenAmount(tokenBalanceLP, token0Decimals)
  const quoteTokenAmountTotal = getTokenAmount(quoteTokenBalanceLP, token1Decimals)

  // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
  const lpTokenRatio =
    !lpTotalSupply.isZero() && !lpTokenBalanceMC.isZero() ? lpTokenBalanceMC.divUnsafe(lpTotalSupply) : FIXED_ZERO

  // // Amount of quoteToken in the LP that are staked in the MC
  const quoteTokenAmountMcFixed = quoteTokenAmountTotal.mulUnsafe(lpTokenRatio)

  // // Total staked in LP, in quote token value
  const lpTotalInQuoteToken = quoteTokenAmountMcFixed.mulUnsafe(FIXED_TWO)

  const _allocPoint = allocPoint ? FixedNumber.from(allocPoint) : FIXED_ZERO
  const totalAlloc = isRegular ? totalRegularAllocPoint : totalSpecialAllocPoint

  const poolWeight =
    !totalAlloc.isZero() && !_allocPoint.isZero() ? _allocPoint.divUnsafe(FixedNumber.from(totalAlloc)) : FIXED_ZERO

  return {
    tokenAmountTotal: tokenAmountTotal.toString(),
    quoteTokenAmountTotal: quoteTokenAmountTotal.toString(),
    lpTotalSupply: lpTotalSupply.toString(),
    lpTotalInQuoteToken: lpTotalInQuoteToken.toString(),
    tokenPriceVsQuote: !quoteTokenAmountTotal.isZero() && quoteTokenAmountTotal.divUnsafe(tokenAmountTotal).toString(),
    poolWeight: poolWeight.toString(),
    multiplier: !_allocPoint.isZero() ? `${+_allocPoint.divUnsafe(FixedNumber.from(100)).toString()}X` : `0X`,
  }
}
