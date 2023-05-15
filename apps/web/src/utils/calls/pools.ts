/* eslint-disable import/prefer-default-export */
import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import { getPoolsConfig } from '@pancakeswap/pools'

import sousChefV2 from 'config/abi/sousChefV2.json'
import { multicallABI } from 'config/abi/Multicall'
import chunk from 'lodash/chunk'
import { viemClients } from 'utils/viem'

import { getMulticallAddress } from '../addressHelpers'

const multicallAddress = getMulticallAddress()

/**
 * Returns the total number of pools that were active at a given block
 */
export const getActivePools = async (chainId: ChainId, block?: bigint | 0) => {
  const poolsConfig = getPoolsConfig(chainId)
  const eligiblePools = poolsConfig
    .filter((pool) => pool.sousId !== 0)
    .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)
  const startBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    abi: sousChefV2,
    address: contractAddress,
    functionName: 'startBlock',
  }))
  const endBlockCalls = eligiblePools.map(({ contractAddress }) => ({
    abi: sousChefV2,
    address: contractAddress,
    functionName: 'bonusEndBlock',
  }))
  const hasBlock = typeof block !== 'undefined'
  const blockCall = !hasBlock
    ? {
        abi: multicallABI,
        address: multicallAddress,
        functionName: 'getBlockNumber',
      }
    : null

  const calls = !hasBlock ? [...startBlockCalls, ...endBlockCalls, blockCall] : [...startBlockCalls, ...endBlockCalls]
  const resultsRaw = await viemClients[chainId].multicall({
    contracts: calls as any,
    allowFailure: false,
  })

  const blockNumber = hasBlock || resultsRaw.pop()[0].toNumber()
  const blockCallsRaw = chunk(resultsRaw, resultsRaw.length / 2)
  // TODO: wagmi
  console.log(blockCallsRaw, 'blockCallsRaw')
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
