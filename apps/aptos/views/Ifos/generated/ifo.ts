/* eslint-disable camelcase */
import { Types } from 'aptos'

export const ADDRESS = '0xc23c3b70956ce8d88fb18ad9ed3b463fe873cb045db3f6d2e2fb15b9aab71d50' as const

export const IFO_MODULE_NAME = 'IFO' as const

export type IfoDepositArgs = [bigint | string]

export const ifoDeposit = (
  args: IfoDepositArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::deposit`,
  }
}

export type IfoDepositOfferingCoinArgs = [bigint | string]

export const ifoDepositOfferingCoin = (
  args: IfoDepositOfferingCoinArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::deposit_offering_coin`,
  }
}

export type IfoFinalWithdrawArgs = [bigint | string, bigint | string]

export const ifoFinalWithdraw = (
  args: IfoFinalWithdrawArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::final_withdraw`,
  }
}

export const ifoHarvestPool = (typeArgs: [string, string, string]): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::${IFO_MODULE_NAME}::harvest_pool`,
  }
}

export type IfoInitializePoolArgs = [bigint | string, bigint | string]

export const ifoInitializePool = (
  args: IfoInitializePoolArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::initialize_pool`,
  }
}

export type IfoReleaseArgs = [number[] | Uint8Array]

export const ifoRelease = (
  args: IfoReleaseArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::release`,
  }
}

export const ifoRevoke = (typeArgs: [string, string]): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::${IFO_MODULE_NAME}::revoke`,
  }
}

export type IfoSetAdminArgs = [string]

export const ifoSetAdmin = (args: IfoSetAdminArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::set_admin`,
  }
}

export type IfoSetMaxBufferTimeArgs = [bigint | string]

export const ifoSetMaxBufferTime = (args: IfoSetMaxBufferTimeArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::set_max_buffer_time`,
  }
}

export type IfoSetNumPoolsArgs = [bigint | string]

export const ifoSetNumPools = (args: IfoSetNumPoolsArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::set_num_pools`,
  }
}

export type IfoSetPoolArgs = [
  bigint | string,
  bigint | string,
  bigint | string,
  boolean,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
]

export const ifoSetPool = (
  args: IfoSetPoolArgs,
  typeArgs: [string, string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::set_pool`,
  }
}

export type IfoUpdateStartAndEndTimeArgs = [bigint | string, bigint | string]

export const ifoUpdateStartAndEndTime = (
  args: IfoUpdateStartAndEndTimeArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::update_start_and_end_time`,
  }
}

export type IfoUpgradeArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const ifoUpgrade = (args: IfoUpgradeArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::upgrade`,
  }
}
