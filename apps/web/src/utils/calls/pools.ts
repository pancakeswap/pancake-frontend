/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import sousChefV2 from 'config/abi/sousChefV2.json'
import chunk from 'lodash/chunk'
import { multicallv3 } from '../multicall'
import { getAddress, getMulticallAddress } from '../addressHelpers'
import multiCallAbi from '../../config/abi/Multicall.json'

const multicallAddress = getMulticallAddress()

/**
 * Returns the total number of pools that were active at a given block
 */
export const getActivePools = async (block?: number) => {
  const eligiblePools = poolsConfig
    .filter((pool) => pool.sousId !== 0)
    .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)
  const startBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    abi: sousChefV2,
    address: getAddress(contractAddress, 56),
    name: 'startBlock',
  }))
  const endBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    abi: sousChefV2,
    address: getAddress(contractAddress, 56),
    name: 'bonusEndBlock',
  }))
  const blockCall = !block
    ? {
        abi: multiCallAbi,
        address: multicallAddress,
        name: 'getBlockNumber',
      }
    : null

  const calls = !block ? [...startBlockCalls, ...endBlockCalls, blockCall] : [...startBlockCalls, ...endBlockCalls]
  const resultsRaw = await multicallv3({ calls })
  const blockNumber = block || resultsRaw.pop()[0].toNumber()
  const blockCallsRaw = chunk(resultsRaw, resultsRaw.length / 2)
  const startBlocks: any[] = blockCallsRaw[0]
  const endBlocks: any[] = blockCallsRaw[1]

  return eligiblePools.reduce((accum, poolCheck, index) => {
    const startBlock = startBlocks[index] ? new BigNumber(startBlocks[index]) : null
    const endBlock = endBlocks[index] ? new BigNumber(endBlocks[index]) : null

    if (!startBlock || !endBlock) {
      return accum
    }

    if (startBlock.gte(blockNumber) || endBlock.lte(blockNumber)) {
      return accum
    }

    return [...accum, poolCheck]
  }, [])
}
