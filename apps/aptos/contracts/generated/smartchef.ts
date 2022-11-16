/* eslint-disable camelcase */
import { Types } from 'aptos'

export const ADDRESS = '0xbc055dd33d6a41cc6615cbfb282bef62aec0e95ee625c645f3ad7a6d9d50d203' as const

export const SMART_CHEF_MODULE_NAME = 'smart_chef' as const

export type SmartChefAddRewardArgs = [bigint | string]

export const smartChefAddReward = (
  args: SmartChefAddRewardArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
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
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::create_pool`,
  }
}

export type SmartChefDepositArgs = [bigint | string]

export const smartChefDeposit = (
  args: SmartChefDepositArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::deposit`,
  }
}

export const smartChefEmergencyRewardWithdraw = (
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::emergency_reward_withdraw`,
  }
}

export const smartChefEmergencyWithdraw = (
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::emergency_withdraw`,
  }
}

export type SmartChefSetAdminArgs = [string]

export const smartChefSetAdmin = (args: SmartChefSetAdminArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::set_admin`,
  }
}

export const smartChefStopReward = (
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::stop_reward`,
  }
}

export type SmartChefUpdatePoolLimitPerUserArgs = [boolean, bigint | string]

export const smartChefUpdatePoolLimitPerUser = (
  args: SmartChefUpdatePoolLimitPerUserArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::update_pool_limit_per_user`,
  }
}

export type SmartChefUpdateRewardPerSecondArgs = [bigint | string]

export const smartChefUpdateRewardPerSecond = (
  args: SmartChefUpdateRewardPerSecondArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::update_reward_per_second`,
  }
}

export type SmartChefUpdateStartAndEndTimestampArgs = [bigint | string, bigint | string]

export const smartChefUpdateStartAndEndTimestamp = (
  args: SmartChefUpdateStartAndEndTimestampArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::update_start_and_end_timestamp`,
  }
}

export type SmartChefUpgradeContractArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const smartChefUpgradeContract = (
  args: SmartChefUpgradeContractArgs,
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::upgrade_contract`,
  }
}

export type SmartChefWithdrawArgs = [bigint | string]

export const smartChefWithdraw = (
  args: SmartChefWithdrawArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SMART_CHEF_MODULE_NAME}::withdraw`,
  }
}
