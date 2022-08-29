import bscFarms from '@pancakeswap/farm-constants/56'
import ethFarms from '@pancakeswap/farm-constants/1'
import bsctestnetFarms from '@pancakeswap/farm-constants/97'
import goerliFarms from '@pancakeswap/farm-constants/5'

import { FixedNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { ChainId, CurrencyAmount, Pair } from '@pancakeswap/sdk'
import { getFarmCakeRewardApr, SerializedFarmConfig } from '@pancakeswap/farms'
import { CAKE, BUSD } from '@pancakeswap/tokens'
import { FarmKV, FarmResult } from './kv'
import { farmFetcher } from './helper'
import { updateLPsAPR } from './lpApr'
import { bscProvider, bscTestnetProvider } from './provider'

const pairAbi = [
  {
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
    stateMutability: 'view',
    type: 'function',
  },
]

const cakeBusdPairMap = {
  [ChainId.BSC]: {
    address: Pair.getAddress(CAKE[ChainId.BSC], BUSD[ChainId.BSC]),
    tokenA: CAKE[ChainId.BSC],
    tokenB: BUSD[ChainId.BSC],
  },
  [ChainId.BSC_TESTNET]: {
    address: Pair.getAddress(CAKE[ChainId.BSC_TESTNET], BUSD[ChainId.BSC_TESTNET]),
    tokenA: CAKE[ChainId.BSC_TESTNET],
    tokenB: BUSD[ChainId.BSC_TESTNET],
  },
}

const getCakePrice = async (isTestnet: boolean) => {
  const pairConfig = cakeBusdPairMap[isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC]
  const pairContract = new Contract(pairConfig.address, pairAbi, isTestnet ? bscTestnetProvider : bscProvider)
  const reserves = await pairContract.getReserves()
  const { reserve0, reserve1 } = reserves
  const { tokenA, tokenB } = pairConfig

  const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]

  const pair = new Pair(
    CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
    CurrencyAmount.fromRawAmount(token1, reserve1.toString()),
  )

  return pair.priceOf(tokenB)
}

const farmConfig: Record<number, SerializedFarmConfig[]> = {
  1: ethFarms,
  56: bscFarms,
  97: bsctestnetFarms,
  5: goerliFarms,
}

export async function saveFarms(chainId: number, event: ScheduledEvent | FetchEvent) {
  try {
    const isTestnet = farmFetcher.isTestnet(chainId)
    const { cakePerBlock, poolLength, totalRegularAllocPoint, totalSpecialAllocPoint } =
      await farmFetcher.fetchMasterChefV2Data(isTestnet)

    const farmsConfig = farmConfig[chainId]
    if (!farmsConfig) {
      throw new Error(`Farms config not found ${chainId}`)
    }
    const farmsCanFetch = farmsConfig.filter((f) => poolLength.gt(f.pid))

    const farms = await farmFetcher.fetchFarms({
      chainId,
      farms: farmsCanFetch,
      isTestnet,
      totalRegularAllocPoint,
      totalSpecialAllocPoint,
    })

    const cakeBusdPrice = await getCakePrice(isTestnet)
    const lpAprs = await handleLpAprs(chainId)

    const finalFarm = farms.reduce((acc, f) => {
      // eslint-disable-next-line no-param-reassign
      acc[f.pid] = {
        ...f,
        lpApr: lpAprs?.[f.lpAddress] || 0,
        cakeApr: getFarmCakeRewardApr(f, FixedNumber.from(cakeBusdPrice.toSignificant(6)), cakePerBlock),
      }
      return acc
    }, {} as FarmResult)

    const savedFarms = {
      updatedAt: new Date().toISOString(),
      poolLength: poolLength.toNumber(),
      regularCakePerBlock: cakePerBlock.toString(),
      data: finalFarm,
    }

    event.waitUntil(FarmKV.saveFarms(chainId, savedFarms))

    return savedFarms
  } catch (error) {
    console.error('[ERROR] fetching farms', error)
    throw error
  }
}

export async function handleLpAprs(chainId: number) {
  let lpAprs = await FarmKV.getApr(chainId)
  if (!lpAprs) {
    lpAprs = await saveLPsAPR(chainId)
  }
  return lpAprs || {}
}

export async function saveLPsAPR(chainId: number) {
  // TODO: add other chains
  if (chainId === 56) {
    const value = await FarmKV.getFarms(chainId)
    if (value && value.data) {
      const aprMap = (await updateLPsAPR(chainId, Object.values(value.data))) || null
      FarmKV.saveApr(chainId, aprMap)
      return aprMap || null
    }
    return null
  }
  return null
}
