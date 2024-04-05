import BigNumber from 'bignumber.js'
import { BOOSTED_FARM_GAS_LIMIT, DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { getMasterChefContract, getNonBscVaultContract, getV2SSBCakeWrapperContract } from 'utils/contractHelpers'
import { logGTMClickStakeFarmEvent } from 'utils/customGTMEventTracking'
import { MessageTypes, getNonBscVaultContractFee } from 'views/Farms/hooks/getNonBscVaultFee'

type MasterChefContract = ReturnType<typeof getMasterChefContract>
type V2SSBCakeContract = ReturnType<typeof getV2SSBCakeWrapperContract>

export const stakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickStakeFarmEvent()

  if (!masterChefContract.account) return undefined

  return masterChefContract.write.deposit([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain,
  })
}

export const bCakeStakeFarm = async (
  v2SSContract: V2SSBCakeContract,
  amount,
  gasPrice,
  gasLimit?: bigint,
  noHarvest?: boolean,
) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickStakeFarmEvent()
  return v2SSContract.write.deposit([BigInt(value), noHarvest ?? false], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: v2SSContract.account ?? '0x',
    chain: v2SSContract.chain,
  })
}

export const unstakeFarm = async (masterChefContract: MasterChefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  if (!masterChefContract.account) return undefined

  return masterChefContract.write.withdraw([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain,
  })
}

export const bCakeUnStakeFarm = async (v2SSContract: V2SSBCakeContract, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  return v2SSContract.write.withdraw([BigInt(value), false], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: v2SSContract.account ?? '0x',
    chain: v2SSContract.chain,
  })
}

export const harvestFarm = async (masterChefContract: MasterChefContract, pid, gasPrice, gasLimit?: bigint) => {
  if (!masterChefContract.account) return undefined

  return masterChefContract.write.deposit([pid, 0n], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain,
  })
}

export const bCakeHarvestFarm = async (v2SSContract: V2SSBCakeContract, gasPrice, gasLimit?: bigint) => {
  return v2SSContract.write.deposit([0n, false], {
    gas: gasLimit || BOOSTED_FARM_GAS_LIMIT,
    gasPrice,
    account: v2SSContract.account ?? '0x',
    chain: v2SSContract.chain,
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
    account: contract.account ?? '0x',
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
    account: contract.account ?? '0x',
    chain: contract.chain,
  })
}
