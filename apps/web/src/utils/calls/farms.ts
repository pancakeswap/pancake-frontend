import BigNumber from 'bignumber.js'
import { BOOSTED_FARM_GAS_LIMIT, DEFAULT_GAS_LIMIT, DEFAULT_TOKEN_DECIMAL } from 'config'
import { getCrossFarmingVaultContract, getMasterChefContract, getV2SSBCakeWrapperContract } from 'utils/contractHelpers'
import { logGTMClickStakeFarmEvent, logGTMClickUnStakeFarmEvent } from 'utils/customGTMEventTracking'
import { MessageTypes, getCrossFarmingVaultContractFee } from 'views/Farms/hooks/getCrossFarmingVaultFee'

export type MasterChefContractType = ReturnType<typeof getMasterChefContract>
type V2SSBCakeContractType = ReturnType<typeof getV2SSBCakeWrapperContract>

export const stakeFarm = async (
  masterChefContract: MasterChefContractType,
  pid,
  amount,
  gasPrice,
  gasLimit?: bigint,
) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickStakeFarmEvent()

  if (!masterChefContract?.account) return undefined

  return masterChefContract.write.deposit([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain,
  })
}

export const bCakeStakeFarm = async (
  v2SSContract: V2SSBCakeContractType,
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

export const unstakeFarm = async (
  masterChefContract: MasterChefContractType,
  pid,
  amount,
  gasPrice,
  gasLimit?: bigint,
) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (!masterChefContract?.account) return undefined
  logGTMClickUnStakeFarmEvent()
  return masterChefContract.write.withdraw([pid, BigInt(value)], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain,
  })
}

export const bCakeUnStakeFarm = async (v2SSContract: V2SSBCakeContractType, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  logGTMClickUnStakeFarmEvent()
  return v2SSContract.write.withdraw([BigInt(value), false], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: v2SSContract.account ?? '0x',
    chain: v2SSContract.chain,
  })
}

export const harvestFarm = async (masterChefContract: MasterChefContractType, pid, gasPrice, gasLimit?: bigint) => {
  if (!masterChefContract?.account) return undefined

  return masterChefContract.write.deposit([pid, 0n], {
    gas: gasLimit || DEFAULT_GAS_LIMIT,
    gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain,
  })
}

export const bCakeHarvestFarm = async (v2SSContract: V2SSBCakeContractType, gasPrice, gasLimit?: bigint) => {
  return v2SSContract.write.deposit([0n, false], {
    gas: gasLimit || BOOSTED_FARM_GAS_LIMIT,
    gasPrice,
    account: v2SSContract.account ?? '0x',
    chain: v2SSContract.chain,
  })
}

export const crossChainStakeFarm = async (
  contract: ReturnType<typeof getCrossFarmingVaultContract>,
  pid,
  amount,
  gasPrice,
  account,
  oraclePrice,
  chainId,
) => {
  if (!contract.account) return undefined

  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getCrossFarmingVaultContractFee({
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

export const crossChainUnstakeFarm = async (
  contract: ReturnType<typeof getCrossFarmingVaultContract>,
  pid,
  amount,
  gasPrice,
  account,
  oraclePrice,
  chainId,
) => {
  if (!contract.account) return undefined

  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  const totalFee = await getCrossFarmingVaultContractFee({
    pid,
    chainId,
    gasPrice,
    oraclePrice,
    amount: value,
    userAddress: account,
    messageType: MessageTypes.Withdraw,
  })
  console.info(totalFee, 'unstake totalFee')
  logGTMClickUnStakeFarmEvent()
  return contract.write.withdraw([pid, BigInt(value)], {
    value: BigInt(totalFee),
    account: contract.account ?? '0x',
    chain: contract.chain,
  })
}
