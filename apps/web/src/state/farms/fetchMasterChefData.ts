import masterchefABI from 'config/abi/masterchef.json'
import chunk from 'lodash/chunk'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { multicallv2 } from 'utils/multicall'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { farmFetcher } from 'state/farms'
import { SerializedFarm } from '@pancakeswap/farms'
import { SerializedFarmConfig } from '../../config/constants/types'
import { getMasterChefAddress } from '../../utils/addressHelpers'
import {useActiveChainId} from "../../hooks/useActiveChainId";

export const fetchMasterChefFarmPoolLength = async (chainId: number) => {
  try {
    const [poolLength] = await multicallv2({
      abi: masterchefABI,
      calls: [
        {
          name: 'poolLength',
          address: getMasterChefAddress(chainId),
        },
      ],
      chainId,
    })

    return new BigNumber(poolLength).toNumber()
  } catch (error) {
    console.error('Fetch MasterChef Farm Pool Length Error: ', error)
    return BIG_ZERO.toNumber()
  }
}

const masterChefFarmCalls = async (farm: SerializedFarm, chainId: number) => {
  const { pid, quoteToken } = farm
  const masterChefAddress = getMasterChefAddress(chainId)
  const masterChefPid = pid

  return masterChefPid || masterChefPid === 0
    ? [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [masterChefPid],
        },
        {
          address: masterChefAddress,
          name: 'totalRegularAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[], chainId: number): Promise<any[]> => {
  const masterChefCalls = await Promise.all(farms.map((farm) => masterChefFarmCalls(farm, chainId)))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()

  const masterChefMultiCallResult = await multicallv2({
    abi: masterchefABI,
    calls: masterChefAggregatedCalls,
    chainId,
  })
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)

  let masterChefChunkedResultCounter = 0
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null]
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
    masterChefChunkedResultCounter++
    return data
  })
}
