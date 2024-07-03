/* eslint-disable camelcase */
import { MoveStructId, ViewFunctionJsonPayload } from '@aptos-labs/ts-sdk'

export const ADDRESS = '0xfd1d8a523f1be89277ac0787ae3469312667e3d0b3f75a5f01bfc95530a2dc91' as const

export const SMART_CHEF_MODULE_NAME = 'smart_chef' as const

export type SmartChefAddRewardArgs = [bigint | string]

export const smartChefAddReward = (
  args: SmartChefAddRewardArgs,
  typeArgs: [string, string, string],
): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::add_reward`,
  }
}

export type SmartChefCreatePoolArgs = [
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
]

export const smartChefCreatePool = (
  args: SmartChefCreatePoolArgs,
  typeArgs: [string, string, string],
): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::create_pool`,
  }
}

export type SmartChefDepositArgs = [bigint | string]

export const smartChefDeposit = (
  args: SmartChefDepositArgs,
  typeArgs: [string, string, string],
): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::deposit`,
  }
}

export const smartChefEmergencyRewardWithdraw = (typeArgs: [string, string, string]): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: [],
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::emergency_reward_withdraw`,
  }
}

export const smartChefEmergencyWithdraw = (typeArgs: [string, string, string]): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: [],
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::emergency_withdraw`,
  }
}

export type SmartChefSetAdminArgs = [string]

export const smartChefSetAdmin = (args: SmartChefSetAdminArgs): ViewFunctionJsonPayload => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::set_admin`,
  }
}

export const smartChefStopReward = (typeArgs: [string, string, string]): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: [],
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::stop_reward`,
  }
}

export type SmartChefUpdatePoolLimitPerUserArgs = [boolean, bigint | string]

export const smartChefUpdatePoolLimitPerUser = (
  args: SmartChefUpdatePoolLimitPerUserArgs,
  typeArgs: [string, string, string],
): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::update_pool_limit_per_user`,
  }
}

export type SmartChefUpdateRewardPerSecondArgs = [bigint | string]

export const smartChefUpdateRewardPerSecond = (
  args: SmartChefUpdateRewardPerSecondArgs,
  typeArgs: [string, string, string],
): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::update_reward_per_second`,
  }
}

export type SmartChefUpdateStartAndEndTimestampArgs = [bigint | string, bigint | string]

export const smartChefUpdateStartAndEndTimestamp = (
  args: SmartChefUpdateStartAndEndTimestampArgs,
  typeArgs: [string, string, string],
): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::update_start_and_end_timestamp`,
  }
}

export type SmartChefUpgradeContractArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const smartChefUpgradeContract = (args: SmartChefUpgradeContractArgs): ViewFunctionJsonPayload => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::upgrade_contract`,
  }
}

export type SmartChefWithdrawArgs = [bigint | string]

export const smartChefWithdraw = (
  args: SmartChefWithdrawArgs,
  typeArgs: [string, string, string],
): ViewFunctionJsonPayload => {
  return {
    typeArguments: typeArgs as [MoveStructId, MoveStructId, MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::withdraw`,
  }
}
