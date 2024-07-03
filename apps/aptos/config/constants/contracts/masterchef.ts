/* eslint-disable camelcase */
import { MoveStructId, InputViewFunctionData } from '@aptos-labs/ts-sdk'

export const ADDRESS = '0x7968a225eba6c99f5f1070aeec1b405757dee939eabcfda43ba91588bf5fccf3' as const

export const MASTERCHEF_MODULE_NAME = 'masterchef' as const

export type MasterchefAddPoolArgs = [bigint | string, boolean, boolean]

export const masterchefAddPool = (args: MasterchefAddPoolArgs, typeArgs: [string]): InputViewFunctionData => {
  return {
    typeArguments: typeArgs as [MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::add_pool`,
  }
}

export type MasterchefCloseAptIncentiveArgs = [boolean]

export const masterchefCloseAptIncentive = (args: MasterchefCloseAptIncentiveArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::close_apt_incentive`,
  }
}

export type MasterchefDepositArgs = [bigint | string]

export const masterchefDeposit = (args: MasterchefDepositArgs, typeArgs: [string]): InputViewFunctionData => {
  return {
    typeArguments: typeArgs as [MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::deposit`,
  }
}

export const masterchefEmergencyWithdraw = (typeArgs: [string]): InputViewFunctionData => {
  return {
    typeArguments: typeArgs as [MoveStructId],
    functionArguments: [],
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::emergency_withdraw`,
  }
}

export const masterchefGetAptIncentiveInfo = (): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: [],
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::get_apt_incentive_info`,
  }
}

export type MasterchefGetAptIncentivePoolInfoArgs = [bigint | string]

export const masterchefGetAptIncentivePoolInfo = (
  args: MasterchefGetAptIncentivePoolInfoArgs,
): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::get_apt_incentive_pool_info`,
  }
}

export type MasterchefGetPendingAptArgs = [string]

export const masterchefGetPendingApt = (
  args: MasterchefGetPendingAptArgs,
  typeArgs: [string],
): InputViewFunctionData => {
  return {
    typeArguments: typeArgs as [MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::get_pending_apt`,
  }
}

export type MasterchefInitAptIncentiveArgs = [bigint | string, boolean]

export const masterchefInitAptIncentive = (args: MasterchefInitAptIncentiveArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::init_apt_incentive`,
  }
}

export const masterchefMassUpdatePools = (): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: [],
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::mass_update_pools`,
  }
}

export type MasterchefPendingCakeArgs = [bigint | string, string]

export const masterchefPendingCake = (args: MasterchefPendingCakeArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::pending_cake`,
  }
}

export const masterchefPoolLength = (): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: [],
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::pool_length`,
  }
}

export type MasterchefSetAdminArgs = [string]

export const masterchefSetAdmin = (args: MasterchefSetAdminArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::set_admin`,
  }
}

export type MasterchefSetPoolArgs = [bigint | string, bigint | string, boolean]

export const masterchefSetPool = (args: MasterchefSetPoolArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::set_pool`,
  }
}

export type MasterchefSetUpkeepAdminArgs = [string]

export const masterchefSetUpkeepAdmin = (args: MasterchefSetUpkeepAdminArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::set_upkeep_admin`,
  }
}

export type MasterchefUpdateCakeRateArgs = [bigint | string, bigint | string, boolean]

export const masterchefUpdateCakeRate = (args: MasterchefUpdateCakeRateArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::update_cake_rate`,
  }
}

export type MasterchefUpdatePoolArgs = [bigint | string]

export const masterchefUpdatePool = (args: MasterchefUpdatePoolArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::update_pool`,
  }
}

export type MasterchefUpgradeMasterchefArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const masterchefUpgradeMasterchef = (args: MasterchefUpgradeMasterchefArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::upgrade_masterchef`,
  }
}

export type MasterchefUpkeepArgs = [bigint | string, bigint | string, boolean]

export const masterchefUpkeep = (args: MasterchefUpkeepArgs): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::upkeep`,
  }
}

export type MasterchefWithdrawArgs = [bigint | string]

export const masterchefWithdraw = (args: MasterchefWithdrawArgs, typeArgs: [string]): InputViewFunctionData => {
  return {
    typeArguments: typeArgs as [MoveStructId],
    functionArguments: args,
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::withdraw`,
  }
}

export const masterchefWithdrawAllApt = (): InputViewFunctionData => {
  return {
    typeArguments: [],
    functionArguments: [],
    function: `${ADDRESS}::${MASTERCHEF_MODULE_NAME}::withdraw_all_apt`,
  }
}
