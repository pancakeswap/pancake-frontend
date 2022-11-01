/* eslint-disable camelcase */
import { Types } from 'aptos'

export const ADDRESS = '0xec83f77c837d16ad3a2aeed76181d2d1674289067c4d06ddba1820adf49b46bb' as const

export const MASTERCHEF_MODULE_NAME = 'masterchef' as const

export type MasterchefAddPoolArgs = [bigint | string, boolean, boolean]

export const masterchefAddPool = (
  args: MasterchefAddPoolArgs,
  typeArgs: [string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::add_pool`,
  }
}

export type MasterchefDepositArgs = [bigint | string, bigint | string]

export const masterchefDeposit = (
  args: MasterchefDepositArgs,
  typeArgs: [string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::deposit`,
  }
}

export type MasterchefEmergencyWithdrawArgs = [bigint | string]

export const masterchefEmergencyWithdraw = (
  args: MasterchefEmergencyWithdrawArgs,
  typeArgs: [string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::emergency_withdraw`,
  }
}

export const masterchefMassUpdatePools = (): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: [],
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::mass_update_pools`,
  }
}

export type MasterchefSetAdminArgs = [string]

export const masterchefSetAdmin = (args: MasterchefSetAdminArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::set_admin`,
  }
}

export type MasterchefSetPoolArgs = [bigint | string, bigint | string, boolean]

export const masterchefSetPool = (args: MasterchefSetPoolArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::set_pool`,
  }
}

export type MasterchefUpdateCakePerSecondArgs = [bigint | string, boolean]

export const masterchefUpdateCakePerSecond = (
  args: MasterchefUpdateCakePerSecondArgs,
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::update_cake_per_second`,
  }
}

export type MasterchefUpdateCakeRateArgs = [bigint | string, bigint | string, boolean]

export const masterchefUpdateCakeRate = (
  args: MasterchefUpdateCakeRateArgs,
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::update_cake_rate`,
  }
}

export type MasterchefUpdatePoolArgs = [bigint | string]

export const masterchefUpdatePool = (args: MasterchefUpdatePoolArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::update_pool`,
  }
}

export type MasterchefWithdrawArgs = [bigint | string, bigint | string]

export const masterchefWithdraw = (
  args: MasterchefWithdrawArgs,
  typeArgs: [string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::withdraw`,
  }
}
