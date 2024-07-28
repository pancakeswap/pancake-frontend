import type { InputGenerateTransactionPayloadData } from '@aptos-labs/ts-sdk'

export const ADDRESS = '0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa' as const

export const SWAP_MODULE_NAME = 'swap' as const
export const ROUTER_MODULE_NAME = 'router' as const

export type SwapSetAdminArgs = [string]

export const swapSetAdmin = (args: SwapSetAdminArgs): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${SWAP_MODULE_NAME}::set_admin`,
  }
}

export type SwapSetFeeToArgs = [string]

export const swapSetFeeTo = (args: SwapSetFeeToArgs): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${SWAP_MODULE_NAME}::set_fee_to`,
  }
}

export type SwapUpgradeSwapArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const swapUpgradeSwap = (args: SwapUpgradeSwapArgs): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: [],
    functionArguments: args,
    function: `${ADDRESS}::${SWAP_MODULE_NAME}::upgrade_swap`,
  }
}

export const swapWithdrawFee = (typeArgs: [string, string]): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: [],
    function: `${ADDRESS}::${SWAP_MODULE_NAME}::withdraw_fee`,
  }
}

export type RouterAddLiquidityArgs = [bigint | string, bigint | string, bigint | string, bigint | string]

export const routerAddLiquidity = (
  args: RouterAddLiquidityArgs,
  typeArgs: [string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::add_liquidity`,
  }
}

export const routerCreatePair = (typeArgs: [string, string]): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: [],
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::create_pair`,
  }
}

export const routerRegisterLp = (typeArgs: [string, string]): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: [],
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::register_lp`,
  }
}

export const routerRegisterToken = (typeArgs: [string]): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: [],
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::register_token`,
  }
}

export type RouterRemoveLiquidityArgs = [bigint | string, bigint | string, bigint | string]

export const routerRemoveLiquidity = (
  args: RouterRemoveLiquidityArgs,
  typeArgs: [string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::remove_liquidity`,
  }
}

export type RouterSwapExactInputArgs = [bigint | string, bigint | string]

export const routerSwapExactInput = (
  args: RouterSwapExactInputArgs,
  typeArgs: [string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_input`,
  }
}

export type RouterSwapExactInputDoublehopArgs = [bigint | string, bigint | string]

export const routerSwapExactInputDoublehop = (
  args: RouterSwapExactInputDoublehopArgs,
  typeArgs: [string, string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_input_doublehop`,
  }
}

export type RouterSwapExactInputQuadruplehopArgs = [bigint | string, bigint | string]

export const routerSwapExactInputQuadruplehop = (
  args: RouterSwapExactInputQuadruplehopArgs,
  typeArgs: [string, string, string, string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_input_quadruplehop`,
  }
}

export type RouterSwapExactInputTriplehopArgs = [bigint | string, bigint | string]

export const routerSwapExactInputTriplehop = (
  args: RouterSwapExactInputTriplehopArgs,
  typeArgs: [string, string, string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_input_triplehop`,
  }
}

export type RouterSwapExactOutputArgs = [bigint | string, bigint | string]

export const routerSwapExactOutput = (
  args: RouterSwapExactOutputArgs,
  typeArgs: [string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_output`,
  }
}

export type RouterSwapExactOutputDoublehopArgs = [bigint | string, bigint | string]

export const routerSwapExactOutputDoublehop = (
  args: RouterSwapExactOutputDoublehopArgs,
  typeArgs: [string, string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_output_doublehop`,
  }
}

export type RouterSwapExactOutputQuadruplehopArgs = [bigint | string, bigint | string]

export const routerSwapExactOutputQuadruplehop = (
  args: RouterSwapExactOutputQuadruplehopArgs,
  typeArgs: [string, string, string, string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_output_quadruplehop`,
  }
}

export type RouterSwapExactOutputTriplehopArgs = [bigint | string, bigint | string]

export const routerSwapExactOutputTriplehop = (
  args: RouterSwapExactOutputTriplehopArgs,
  typeArgs: [string, string, string, string]
): InputGenerateTransactionPayloadData => {
  return {
    typeArguments: typeArgs,
    functionArguments: args,
    function: `${ADDRESS}::${ROUTER_MODULE_NAME}::swap_exact_output_triplehop`,
  }
}
