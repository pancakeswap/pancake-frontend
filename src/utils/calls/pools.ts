/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js'
import pools from 'config/constants/pools'
import poolsDeployedBlockNumber from 'config/constants/poolsDeployedBlockNumber'
import sousChefV2 from 'config/abi/sousChefV2.json'
import multicall from '../multicall'
import { simpleRpcProvider } from '../providers'
import { getAddress } from '../addressHelpers'

/**
 * Returns the total number of pools that were active at a given block
 */
export const getActivePools = async (block?: number) => {
  const eligiblePools = pools
    .filter((pool) => pool.sousId !== 0)
    .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)
    .filter((pool) => {
      const { contractAddress, deployedBlockNumber } = pool
      const address = getAddress(contractAddress)
      return (deployedBlockNumber && deployedBlockNumber < block) || poolsDeployedBlockNumber[address] < block
    })
  const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
  const startBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    address: getAddress(contractAddress),
    name: 'startBlock',
  }))
  const endBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    address: getAddress(contractAddress),
    name: 'bonusEndBlock',
  }))
  const startBlocks = await multicall(sousChefV2, startBlockCalls)
  const endBlocks = await multicall(sousChefV2, endBlockCalls)

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
