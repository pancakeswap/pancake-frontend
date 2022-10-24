import { Types } from 'aptos'

export const ADDRESS = '0xa64d9f1646ce0ac27f0bfa65ad9a4a6abad3560d116a2ffaa99a8a7967806b4d' as const

export type SyrupAddPoolArgs = [
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
  bigint | string,
]

export const syrupAddPool = (args: SyrupAddPoolArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::syrup::add_pool`,
  }
}

export type SyrupDepositArgs = [bigint | string]

export const syrupDeposit = (args: SyrupDepositArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::syrup::deposit`,
  }
}

export const syrupInitPackage = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: `${ADDRESS}::syrup::init_package`,
  }
}

export type SyrupWithdrawArgs = [bigint | string]

export const syrupWithdraw = (args: SyrupWithdrawArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::syrup::withdraw`,
  }
}
