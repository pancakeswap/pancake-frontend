import chunk from 'lodash/chunk'
import { ChainId } from '@pancakeswap/sdk'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { multicallv2 } from 'utils/multicall'
import { farmFetcher } from 'state/farms'
import { SerializedFarm } from '@pancakeswap/farms'
import { SerializedFarmConfig } from '../../config/constants/types'
import { getMasterChefV2Address } from '../../utils/addressHelpers'

export const fetchMasterChefFarmPoolLength = async (chainId: number) => {
  try {
    const [poolLength] = await multicallv2({
      abi: masterChefV2ABI,
      calls: [
        {
          name: 'poolLength',
          address: getMasterChefV2Address(chainId),
        },
      ],
      chainId,
    })

    return Number(poolLength)
  } catch (error) {
    console.error('Fetch MasterChef Farm Pool Length Error: ', error)
    return 0
  }
}

const masterChefFarmCalls = async (farm: SerializedFarm) => {
  const { pid, quoteToken } = farm
  const multiCallChainId = farmFetcher.isTestnet(quoteToken.chainId) ? ChainId.BSC_TESTNET : ChainId.BSC
  const masterChefAddress = getMasterChefV2Address(multiCallChainId)
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
  const masterChefCalls = await Promise.all(farms.map((farm) => masterChefFarmCalls(farm)))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()

  const multiCallChainId = farmFetcher.isTestnet(chainId) ? ChainId.BSC_TESTNET : ChainId.BSC
  const masterChefMultiCallResult = await multicallv2({
    abi: masterChefV2ABI,
    calls: masterChefAggregatedCalls,
    chainId: multiCallChainId,
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
