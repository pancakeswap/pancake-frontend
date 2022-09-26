import { Types } from 'aptos'

export type SwapSetAdminArgs = [string]

export const swapSetAdmin = (args: SwapSetAdminArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::setAdmin',
  }
}

export type SwapSetFeeToArgs = [string]

export const swapSetFeeTo = (args: SwapSetFeeToArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::setFeeTo',
  }
}

export const swapWithdrawFee = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::swap::withdrawFee',
  }
}

export type RouterAddLiquidityArgs = [bigint | string, bigint | string]

export const routerAddLiquidity = (
  args: RouterAddLiquidityArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::router::add_liquidity',
  }
}

export const routerCreatePair = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::router::create_pair',
  }
}

export const routerRegisterLp = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::router::registerLP',
  }
}

export const routerRegisterToken = (typeArgs: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::router::registerToken',
  }
}

export type RouterRemoveLiquidityArgs = [bigint | string, bigint | string, bigint | string]

export const routerRemoveLiquidity = (
  args: RouterRemoveLiquidityArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::router::remove_liquidity',
  }
}

export type RouterSwapArgs = [bigint | string, bigint | string]

export const routerSwap = (args: RouterSwapArgs, typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::router::swap',
  }
}

export type RouterSwapTwiceArgs = [bigint | string, bigint | string]

export const routerSwapTwice = (
  args: RouterSwapTwiceArgs,
  typeArgs: [string, string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea::router::swap_twice',
  }
}
