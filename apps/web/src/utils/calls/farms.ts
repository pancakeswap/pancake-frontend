import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getNonBscVaultContractFee, MessageTypes } from 'views/Farms/hooks/getNonBscVaultFee'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import { getMasterChefContract } from 'utils/contractHelpers'

type MasterChefContract = ReturnType<typeof getMasterChefContract>

export const stakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: number) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickStakeFarmEvent()
  return masterChefContract.write.deposit([pid, value], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
  })
}

export const unstakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: number) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.write.withdraw([pid, value], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
  })
}

export const harvestFarm = async (masterChefContract: MasterChefContract, pid, gasPrice, gasLimit?: number) => {
  return masterChefContract.write.deposit([pid, '0'], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
  })
}

export const nonBscStakeFarm = async (
  contract: MasterChefContract,
  pid,
  amount,
  gasPrice,
  account,
  oraclePrice,
  chainId,
) => {
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
  logGTMClickStakeFarmEvent()
  return contract.write.deposit([pid, value], { value: totalFee })
}

export const nonBscUnstakeFarm = async (
  contract: MasterChefContract,
  pid,
  amount,
  gasPrice,
  account,
  oraclePrice,
  chainId,
) => {
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
  return contract.write.withdraw([pid, value], { value: totalFee })
}
