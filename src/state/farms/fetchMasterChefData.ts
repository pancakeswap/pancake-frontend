import masterchefABI from 'config/abi/masterchef.json'
import { chunk } from 'lodash'
import { multicallv2 } from 'utils/multicall'
import { SerializedFarmConfig } from '../../config/constants/types'
import { SerializedFarm } from '../types'
import { getMasterChefAddress } from '../../utils/addressHelpers'

const fetchMasterChefFarmCalls = (farm: SerializedFarm) => {
  const { pid } = farm
  return pid || pid === 0
    ? [
        {
          address: getMasterChefAddress(),
          name: 'poolInfo',
          params: [pid],
        },
        {
          address: getMasterChefAddress(),
          name: 'totalAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[]): Promise<any[]> => {
  const masterChefCalls = farms.map((farm) => fetchMasterChefFarmCalls(farm))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()
  const masterChefMultiCallResult = await multicallv2(masterchefABI, masterChefAggregatedCalls)
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
