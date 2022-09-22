import { Types } from 'aptos'

export type SwapSetAdminArgs = [string]

export const swapSetAdmin = (args: SwapSetAdminArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap::setAdmin',
  }
}

export type SwapSetFeeToArgs = [string]

export const swapSetFeeTo = (args: SwapSetFeeToArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap::setFeeTo',
  }
}

export const swapWithdrawFee = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap::withdrawFee',
  }
}

export type SwapScriptsAddLiquidityScriptArgs = [bigint | string, bigint | string]

export const swapScriptsAddLiquidityScript = (
  args: SwapScriptsAddLiquidityScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap_scripts::add_liquidity_script',
  }
}

export type SwapScriptsCreatePairScriptArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const swapScriptsCreatePairScript = (
  args: SwapScriptsCreatePairScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap_scripts::create_pair_script',
  }
}

export const swapScriptsRegisterLp = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap_scripts::registerLP',
  }
}

export const swapScriptsRegisterToken = (typeArgs: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap_scripts::registerToken',
  }
}

export type SwapScriptsRemoveLiquidityScriptArgs = [bigint | string, bigint | string, bigint | string]

export const swapScriptsRemoveLiquidityScript = (
  args: SwapScriptsRemoveLiquidityScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function:
      '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap_scripts::remove_liquidity_script',
  }
}

export type SwapScriptsSwapScriptArgs = [bigint | string, bigint | string]

export const swapScriptsSwapScript = (
  args: SwapScriptsSwapScriptArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d::swap_scripts::swap_script',
  }
}
