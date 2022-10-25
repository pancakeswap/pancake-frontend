/* eslint-disable camelcase */
import { Types } from 'aptos'

export const ADDRESS = '0xa64d9f1646ce0ac27f0bfa65ad9a4a6abad3560d116a2ffaa99a8a7967806b4d' as const

export const SYRUP_MODULE_NAME = 'syrup' as const

export type SyrupAddPoolArgs = [
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
]

export const syrupAddPool = (
  args: SyrupAddPoolArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SYRUP_MODULE_NAME}::add_pool`,
  }
}

export type SyrupDepositArgs = [bigint | string]

export const syrupDeposit = (
  args: SyrupDepositArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SYRUP_MODULE_NAME}::deposit`,
  }
}

export const syrupInitPackage = (): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: [],
    arguments: [],
    function: `${ADDRESS}::${SYRUP_MODULE_NAME}::init_package`,
  }
}

export type SyrupWithdrawArgs = [bigint | string]

export const syrupWithdraw = (
  args: SyrupWithdrawArgs,
  typeArgs: [string, string],
): Types.TransactionPayload_EntryFunctionPayload => {
  return {
    type: 'entry_function_payload',
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::${SYRUP_MODULE_NAME}::withdraw`,
  }
}
