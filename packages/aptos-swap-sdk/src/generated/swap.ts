import { Types } from 'aptos'

export type CpScriptsAddLiquidityScriptArgs = [bigint | string, bigint | string]

export const cpScriptsAddLiquidityScript = (
  args: CpScriptsAddLiquidityScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2::cp_scripts::add_liquidity_script',
  }
}

export type CpScriptsCreateNewPoolScriptArgs = [
  string,
  boolean,
  number[] | Uint8Array,
  number[] | Uint8Array,
  number[] | Uint8Array,
  number[] | Uint8Array
]

export const cpScriptsCreateNewPoolScript = (
  args: CpScriptsCreateNewPoolScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2::cp_scripts::create_new_pool_script',
  }
}

export const cpScriptsMockDeployScript = (): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: [],
    function: '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2::cp_scripts::mock_deploy_script',
  }
}

export const cpScriptsRegisterLp = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2::cp_scripts::registerLP',
  }
}

export const cpScriptsRegisterToken = (typeArgs: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2::cp_scripts::registerToken',
  }
}

export type CpScriptsRemoveLiquidityScriptArgs = [bigint | string, bigint | string, bigint | string]

export const cpScriptsRemoveLiquidityScript = (
  args: CpScriptsRemoveLiquidityScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2::cp_scripts::remove_liquidity_script',
  }
}

export type CpScriptsSwapScriptArgs = [bigint | string, bigint | string, bigint | string, bigint | string]

export const cpScriptsSwapScript = (
  args: CpScriptsSwapScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2::cp_scripts::swap_script',
  }
}
