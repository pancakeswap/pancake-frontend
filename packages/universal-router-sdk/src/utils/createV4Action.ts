import { AbiParametersToPrimitiveTypes } from 'abitype'
import { Hex, encodeAbiParameters, parseAbiParameters } from 'viem'
import { V4ActionType } from '../router.types'

export type V4ActionsABIParametersType<TCommandType extends ActionUsed> = AbiParametersToPrimitiveTypes<
  (typeof V4ACTIONS_ABI_PARAMETER)[TCommandType]
>

const abiStructPoolKey = `
struct PoolKey {
    address currency0;
    address currency1;
    address hooks;
    IPoolManager poolManager;
    uint24 fee;
    bytes32 parameters;
}
`.replaceAll('\n', '')

const abiStructPathKey = `
struct PathKey {
    Currency intermediateCurrency;
    uint24 fee;
    IHooks hooks;
    IPoolManager poolManager;
    bytes hookData;
    bytes32 parameters;
}
`.replaceAll('\n', '')

const abiStructClSwapExactInputParams = `
struct CLSwapExactInputParams {
  address currencyIn;
  PathKey[] path;
  uint128 amountIn;
  uint128 amountOutMinimum;
}
`.replaceAll('\n', '')

const abiStructClSwapExactInputSingleParams = `
struct CLSwapExactInputSingleParams {
    PoolKey poolKey;
    bool zeroForOne;
    uint128 amountIn;
    uint128 amountOutMinimum;
    uint160 sqrtPriceLimitX96;
    bytes hookData;
}
`.replaceAll('\n', '')

const abiStructClSwapExactOutputSingleParams = `
struct CLSwapExactOutputSingleParams {
    PoolKey poolKey;
    bool zeroForOne;
    uint128 amountOut;
    uint128 amountInMaximum;
    uint160 sqrtPriceLimitX96;
    bytes hookData;
}
`.replaceAll('\n', '')

const abiStructClSwapExactOutputParams = `
struct CLSwapExactOutputParams {
    address currencyOut;
    PathKey[] path;
    uint128 amountOut;
    uint128 amountInMaximum;
}
`.replaceAll('\n', '')

const apiStructBinSwapExactInputSingleParams = `
struct BinSwapExactInputSingleParams {
  PoolKey poolKey;
  bool swapForY;
  uint128 amountIn;
  uint128 amountOutMinimum;
  bytes hookData;
}
`.replaceAll('\n', '')

const abiStructBinSwapExactInputParams = `
struct BinSwapExactInputParams {
  address currencyIn;
  PathKey[] path;
  uint128 amountIn;
  uint128 amountOutMinimum;
}
`.replaceAll('\n', '')

const abiStructBinSwapExactOutputSingleParams = `
struct BinSwapExactOutputSingleParams {
  PoolKey poolKey;
  bool swapForY;
  uint128 amountOut;
  uint128 amountInMaximum;
  bytes hookData;
}
`.replaceAll('\n', '')

const abiStructBinSwapExactOutputParams = `
struct BinSwapExactOutputParams {
  Currency currencyOut;
  PathKey[] path;
  uint128 amountOut;
  uint128 amountInMaximum;
}
`.replaceAll('\n', '')

export const V4ACTIONS_ABI_PARAMETER = {
  [V4ActionType.CL_SWAP_EXACT_IN_SINGLE]: parseAbiParameters([
    'CLSwapExactInputSingleParams params',
    abiStructClSwapExactInputSingleParams,
    abiStructPoolKey,
  ]),
  [V4ActionType.CL_SWAP_EXACT_IN]: parseAbiParameters([
    'CLSwapExactInputParams params',
    abiStructClSwapExactInputParams,
    abiStructPathKey,
  ]),
  [V4ActionType.CL_SWAP_EXACT_OUT_SINGLE]: parseAbiParameters([
    'CLSwapExactOutputSingleParams params',
    abiStructClSwapExactOutputSingleParams,
    abiStructPoolKey,
  ]),
  [V4ActionType.CL_SWAP_EXACT_OUT]: parseAbiParameters([
    'CLSwapExactOutputParams params',
    abiStructClSwapExactOutputParams,
    abiStructPathKey,
  ]),
  [V4ActionType.BIN_SWAP_EXACT_IN_SINGLE]: parseAbiParameters([
    'BinSwapExactInputSingleParams params',
    apiStructBinSwapExactInputSingleParams,
    abiStructPoolKey,
  ]),
  [V4ActionType.BIN_SWAP_EXACT_IN]: parseAbiParameters([
    'BinSwapExactInputParams params',
    abiStructBinSwapExactInputParams,
    abiStructPathKey,
  ]),
  [V4ActionType.BIN_SWAP_EXACT_OUT_SINGLE]: parseAbiParameters([
    'BinSwapExactOutputSingleParams params',
    abiStructBinSwapExactOutputSingleParams,
    abiStructPoolKey,
  ]),
  [V4ActionType.BIN_SWAP_EXACT_OUT]: parseAbiParameters([
    'BinSwapExactOutputParams params',
    abiStructBinSwapExactOutputParams,
    abiStructPathKey,
  ]),
  [V4ActionType.SETTLE_TAKE_PAIR]: parseAbiParameters('address inputCurrency, address outputCurrency'),
}

export type ActionUsed = keyof typeof V4ACTIONS_ABI_PARAMETER

export type RouterAction = {
  type: ActionUsed
  encodedInput: Hex
}

export function createAction<TCommandType extends ActionUsed>(
  type: TCommandType,
  parameters: V4ActionsABIParametersType<TCommandType>,
): RouterAction {
  // const params = parameters.filter((param) => param !== null)
  const encodedInput = encodeAbiParameters(V4ACTIONS_ABI_PARAMETER[type], parameters as any)
  return { type, encodedInput }
}
