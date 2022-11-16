/* eslint-disable camelcase */
import { Types } from 'aptos'

export const ADDRESS = '0x3eae4f73fe95d9ecfcb0b8c353959f20cbb7239e1b1a1ca55893235c7a4d6d0c' as const

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

export type MasterchefDepositArgs = [bigint | string]

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

export const masterchefEmergencyWithdraw = (typeArgs: [string]): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: [],
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

export type MasterchefSetUpkeepAdminArgs = [string]

export const masterchefSetUpkeepAdmin = (
  args: MasterchefSetUpkeepAdminArgs,
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::set_upkeep_admin`,
  }
}

export type MasterchefTransferCakeOwnerShipArgs = [string]

export const masterchefTransferCakeOwnerShip = (
  args: MasterchefTransferCakeOwnerShipArgs,
  typeArgs: [string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::transfer_cake_owner_ship`,
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

export type MasterchefUpgradeMasterchefArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const masterchefUpgradeMasterchef = (
  args: MasterchefUpgradeMasterchefArgs,
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::upgrade_masterchef`,
  }
}

export type MasterchefUpkeepArgs = [bigint | string, bigint | string, boolean]

export const masterchefUpkeep = (args: MasterchefUpkeepArgs): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::upkeep`,
  }
}

export type MasterchefWithdrawArgs = [bigint | string]

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
