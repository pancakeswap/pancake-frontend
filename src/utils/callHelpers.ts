import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import pools from 'config/constants/pools'
import { ethers, Contract } from 'ethers'
import sousChefV2 from 'config/abi/sousChefV2.json'
import { BIG_TEN, BIG_ZERO } from './bigNumber'
import multicall from './multicall'
import { archiveRpcProvider } from './providers'
import { getAddress } from './addressHelpers'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

/**
 * Estimate the gas needed to call a function, and add a 10% margin
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const estimageGas = async (contract: Contract, methodName: string, methodArgs: any[]) => {
  if (!contract[methodName]) {
    throw new Error(`Method ${methodName} doesn't exist on ${contract.address}`)
  }
  const rawGasEstimation = await contract.estimateGas[methodName](...methodArgs)
  // By convention, ethers.BigNumber values are multiplied by 1000 to avoid dealing with real numbers
  const gasEstimation = rawGasEstimation
    .mul(ethers.BigNumber.from(10000).add(ethers.BigNumber.from(1000)))
    .div(ethers.BigNumber.from(10000))
  return gasEstimation
}

/**
 * Perform a contract call with a gas value returned from estimateGas
 * @param contract Used to perform the call
 * @param methodName The name of the methode called
 * @param args An array of arguments to pass to the method
 * @returns https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
 */
export const callWithEstimateGas = async (
  contract: Contract,
  methodName: string,
  methodArgs: any[] = [],
): Promise<ethers.providers.TransactionResponse> => {
  const gasEstimation = estimageGas(contract, methodName, methodArgs)
  const tx = await contract[methodName](...methodArgs, {
    gasLimit: gasEstimation,
  })
  return tx
}

export const approve = async (lpContract, masterChefContract) => {
  const tx = await lpContract.approve(masterChefContract.address, ethers.constants.MaxUint256)
  return tx.wait()
}

export const stake = async (masterChefContract, pid, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.enterStaking(value, options)
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.deposit(pid, value, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const sousStake = async (sousChefContract, amount, decimals = 18) => {
  const tx = await sousChefContract.deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(), options)
  const receipt = await tx.wait()
  return receipt.status
}

export const sousStakeBnb = async (sousChefContract, amount) => {
  const tx = await sousChefContract.deposit({
    ...options,
    value: new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(),
  })
  const receipt = await tx.wait()
  return receipt.status
}

export const unstake = async (masterChefContract, pid, amount) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid === 0) {
    const tx = await masterChefContract.leaveStaking(value, options)
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.withdraw(pid, value, options)
  const receipt = await tx.wait()
  return receipt.status
}

export const sousUnstake = async (sousChefContract, amount, decimals) => {
  const tx = await sousChefContract.withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString())
  const receipt = await tx.wait()
  return receipt.status
}

export const sousEmergencyUnstake = async (sousChefContract) => {
  const tx = await sousChefContract.emergencyWithdraw()
  const receipt = await tx.wait()
  return receipt.status
}

export const harvest = async (masterChefContract, pid) => {
  if (pid === 0) {
    const tx = await await masterChefContract.leaveStaking('0', options)
    const receipt = await tx.wait()
    return receipt.status
  }

  const tx = await masterChefContract.deposit(pid, '0', options)
  const receipt = await tx.wait()
  return receipt.status
}

export const soushHarvest = async (sousChefContract) => {
  const tx = await sousChefContract.deposit('0', options)
  const receipt = await tx.wait()
  return receipt.status
}

export const soushHarvestBnb = async (sousChefContract) => {
  const tx = await sousChefContract.deposit({ ...options, value: BIG_ZERO })
  const receipt = await tx.wait()
  return receipt.status
}

/**
 * Returns the total number of pools that were active at a given block
 */
export const getActivePools = async (block?: number) => {
  const eligiblePools = pools
    .filter((pool) => pool.sousId !== 0)
    .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)
  const blockNumber = block || (await archiveRpcProvider.getBlockNumber())
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
