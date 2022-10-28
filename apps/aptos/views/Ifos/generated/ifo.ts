/* eslint-disable camelcase */
import { Types } from 'aptos'

export const ADDRESS = '0x13c8a066f1a253983d4add357404f45f3d5e20501158224df72dde2269877443' as const

export const IFO_MODULE_NAME = 'IFO' as const

export type IfoAddAddressToWhitelistArgs = [string]

export const ifoAddAddressToWhitelist = (
  args: IfoAddAddressToWhitelistArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::add_address_to_whitelist`,
  }
}

export type IfoAddAddressesToWhitelistArgs = [number[] | Uint8Array]

export const ifoAddAddressesToWhitelist = (
  args: IfoAddAddressesToWhitelistArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::add_addresses_to_whitelist`,
  }
}

export type IfoDepositArgs = [bigint | string, bigint | string]

export const ifoDeposit = (
  args: IfoDepositArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::deposit`,
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

export type IfoHarvestPoolArgs = [bigint | string]

export const ifoHarvestPool = (
  args: IfoHarvestPoolArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::harvest_pool`,
  }
}

export type IfoInitializePoolArgs = [string, bigint | string, bigint | string]

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
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::release`,
  }
}

export type IfoRemoveAddressFromWhitelistArgs = [string]

export const ifoRemoveAddressFromWhitelist = (
  args: IfoRemoveAddressFromWhitelistArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::remove_address_from_whitelist`,
  }
}

export type IfoRemoveAddressesFromWhitelistArgs = [number[] | Uint8Array]

export const ifoRemoveAddressesFromWhitelist = (
  args: IfoRemoveAddressesFromWhitelistArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${IFO_MODULE_NAME}::remove_addresses_from_whitelist`,
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
  bigint | string,
]

export const ifoSetPool = (
  args: IfoSetPoolArgs,
  typeArgs: [string, string],
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
