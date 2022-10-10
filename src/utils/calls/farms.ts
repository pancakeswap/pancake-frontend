import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { BOOSTED_FARM_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { getNonBscVaultContractFee, MessageTypes } from 'views/Farms/hooks/getNonBscVaultFee'

const options = {
  gasLimit: BOOSTED_FARM_GAS_LIMIT,
}

export const stakeFarm = async (masterChefContract: Contract, pid, amount, gasPrice) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.deposit(pid, value, { ...options, gasPrice })
}

export const unstakeFarm = async (masterChefContract, pid, amount, gasPrice) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.withdraw(pid, value, { ...options, gasPrice })
}

export const harvestFarm = async (masterChefContract, pid, gasPrice) => {
  return masterChefContract.deposit(pid, '0', { ...options, gasPrice })
}

export const nonBscStakeFarm = async (contract, pid, amount, gasPrice, account, oraclePrice, chainId) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getNonBscVaultContractFee({
    pid,
    chainId,
    gasPrice,
    oraclePrice,
    amount: value,
    userAddress: account,
    messageType: MessageTypes.Deposit,
  })
  console.info(totalFee, 'stake totalFee')
  return contract.deposit(pid, value, { value: totalFee })
}

export const nonBscUnstakeFarm = async (contract, pid, amount, gasPrice, account, oraclePrice, chainId) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getNonBscVaultContractFee({
    pid,
    chainId,
    gasPrice,
    oraclePrice,
    amount: value,
    userAddress: account,
    messageType: MessageTypes.Withdraw,
  })
  console.info(totalFee, 'unstake totalFee')
  return contract.withdraw(pid, value, { value: totalFee })
}
