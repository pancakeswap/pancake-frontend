import masterchefABI from 'config/abi/masterchef.json'
import chunk from 'lodash/chunk'
import { multicallv2 } from 'utils/multicall'
import { ChainId } from '@pancakeswap/sdk'
import { getBscChainId } from 'state/farms/getBscChainId'
import { SerializedFarmConfig } from '../../config/constants/types'
import { SerializedFarm } from '../types'
import { getMasterChefAddress } from '../../utils/addressHelpers'
import { getMasterchefContract } from '../../utils/contractHelpers'

export const fetchMasterChefFarmPoolLength = async (chainId: number) => {
  const masterChefContract = getMasterchefContract(undefined, chainId)
  const poolLength = await masterChefContract.poolLength()
  return poolLength
}

const masterChefFarmCalls = async (farm: SerializedFarm) => {
  const { pid, bscPid, quoteToken } = farm
  const isNonBscVault = quoteToken.chainId !== (ChainId.BSC || ChainId.BSC_TESTNET)
  const multiCallChainId = isNonBscVault ? await getBscChainId(quoteToken.chainId) : quoteToken.chainId
  const masterChefAddress = getMasterChefAddress(multiCallChainId)
  const masterChefPid = isNonBscVault ? bscPid : pid

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
  const isNonBscVault = chainId !== (ChainId.BSC || ChainId.BSC_TESTNET)
  const multiCallChainId = isNonBscVault ? await getBscChainId(chainId) : chainId
  const masterChefMultiCallResult = await multicallv2({
    abi: masterchefABI,
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
