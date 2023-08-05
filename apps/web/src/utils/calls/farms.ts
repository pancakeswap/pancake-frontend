import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getNonBscVaultContractFee, MessageTypes } from 'views/Farms/hooks/getNonBscVaultFee'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import { getMasterChefContract, getNonBscVaultContract } from 'utils/contractHelpers'

type MasterChefContract = ReturnType<typeof getMasterChefContract>

export const stakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickStakeFarmEvent()
  return masterChefContract.write.deposit([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}

export const unstakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  return masterChefContract.write.withdraw([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}

export const harvestFarm = async (masterChefContract: MasterChefContract, pid, gasPrice, gasLimit?: bigint) => {
  return masterChefContract.write.deposit([pid, 0n], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}

export const nonBscStakeFarm = async (
  contract: ReturnType<typeof getNonBscVaultContract>,
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
  return contract.write.deposit([pid, BigInt(value)], {
    value: BigInt(totalFee),
    account: contract.account,
    chain: contract.chain,
  })
}

export const nonBscUnstakeFarm = async (
  contract: ReturnType<typeof getNonBscVaultContract>,
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
  return contract.write.withdraw([pid, BigInt(value)], {
    value: BigInt(totalFee),
    account: contract.account,
    chain: contract.chain,
  })
}
