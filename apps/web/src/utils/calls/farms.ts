import BigNumber from 'bignumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { getMasterChefContract, getNonBscVaultContract } from 'utils/contractHelpers'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import { MessageTypes, getNonBscVaultContractFee } from 'views/Farms/hooks/getNonBscVaultFee'

export type MasterChefContractType = ReturnType<typeof getMasterChefContract>

export const stakeFarm = async (
  masterChefContract: MasterChefContractType,
  pid,
  amount,
  gasPrice,
  gasLimit?: bigint,
) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickStakeFarmEvent()

  if (!masterChefContract.account) return undefined

  return masterChefContract.write.deposit([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}

export const unstakeFarm = async (
  masterChefContract: MasterChefContractType,
  pid,
  amount,
  gasPrice,
  gasLimit?: bigint,
) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  if (!masterChefContract.account) return undefined

  return masterChefContract.write.withdraw([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account,
    chain: masterChefContract.chain,
  })
}

export const harvestFarm = async (masterChefContract: MasterChefContractType, pid, gasPrice, gasLimit?: bigint) => {
  if (!masterChefContract.account) return undefined

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
  if (!contract.account) return undefined

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
  if (!contract.account) return undefined

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
