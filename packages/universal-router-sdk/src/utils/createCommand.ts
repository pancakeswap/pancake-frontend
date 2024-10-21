import { AbiParametersToPrimitiveTypes } from 'abitype'
import { AbiParameter, Hex, encodeAbiParameters, parseAbiParameters } from 'viem'
import { CommandType } from '../router.types'

export type ABIType = { [key in CommandUsed]: readonly AbiParameter[] }
export type ABIParametersType<TCommandType extends CommandUsed> = AbiParametersToPrimitiveTypes<
  (typeof ABI_PARAMETER)[TCommandType]
>

const ABI_STRUCT_PERMIT_DETAILS = `
struct PermitDetails {
  address token;
  uint160 amount;
  uint48 expiration;
  uint48 nonce;
}`.replaceAll('\n', '')

const ABI_STRUCT_PERMIT_SINGLE = `
struct PermitSingle {
  PermitDetails details;
  address spender;
  uint256 sigDeadline;
}
`.replaceAll('\n', '')

const ABI_STRUCT_PERMIT_BATCH = `
struct PermitBatch {
  PermitSingle[] details;
  address spender;
  uint256 sigDeadline;
}
`.replaceAll('\n', '')

const ABI_STRUCT_ALLOWANCE_TRANSFER_DETAILS = `
struct AllowanceTransferDetails {
  address from;
  address to;
  uint160 amount;
  address token;
}
`.replaceAll('\n', '')

export const ABI_PARAMETER = {
  // Batch Reverts
  [CommandType.EXECUTE_SUB_PLAN]: parseAbiParameters('bytes _commands, bytes[] _inputs'),

  // Permit2 Actions
  [CommandType.PERMIT2_PERMIT]: parseAbiParameters([
    'PermitSingle permitSingle, bytes data',
    ABI_STRUCT_PERMIT_SINGLE,
    ABI_STRUCT_PERMIT_DETAILS,
  ]),
  [CommandType.PERMIT2_PERMIT_BATCH]: parseAbiParameters([
    'PermitBatch permitBatch, bytes data',
    ABI_STRUCT_PERMIT_BATCH,
    ABI_STRUCT_PERMIT_SINGLE,
    ABI_STRUCT_PERMIT_DETAILS,
  ]),
  [CommandType.PERMIT2_TRANSFER_FROM]: parseAbiParameters('address token, address recipient, uint160 amount'),
  [CommandType.PERMIT2_TRANSFER_FROM_BATCH]: parseAbiParameters([
    'AllowanceTransferDetails[] batchDetails',
    ABI_STRUCT_ALLOWANCE_TRANSFER_DETAILS,
  ]),

  // swap actions
  [CommandType.V3_SWAP_EXACT_IN]: parseAbiParameters(
    'address recipient, uint256 amountIn, uint256 amountOutMin, bytes path, bool payerIsUser',
  ),
  [CommandType.V3_SWAP_EXACT_OUT]: parseAbiParameters(
    'address recipient, uint256 amountOut, uint256 amountInMax, bytes path, bool payerIsUser',
  ),
  [CommandType.V2_SWAP_EXACT_IN]: parseAbiParameters(
    'address recipient, uint256 amountIn, uint256 amountOutMin, address[] path, bool payerIsUser',
  ),
  [CommandType.V2_SWAP_EXACT_OUT]: parseAbiParameters(
    'address recipient, uint256 amountOut, uint256 amountInMax, address[] path, bool payerIsUser',
  ),
  [CommandType.STABLE_SWAP_EXACT_IN]: parseAbiParameters(
    'address recipient, uint256 amountIn, uint256 amountOutMin, address[] path, uint256[] flag, bool payerIsUser',
  ),
  [CommandType.STABLE_SWAP_EXACT_OUT]: parseAbiParameters(
    'address recipient, uint256 amountOut, uint256 amountInMax, address[] path, uint256[] flag, bool payerIsUser',
  ),

  // Token Actions and Checks
  [CommandType.WRAP_ETH]: parseAbiParameters('address recipient, uint256 amountMin'),
  [CommandType.UNWRAP_WETH]: parseAbiParameters('address recipient, uint256 amountMin'),
  [CommandType.SWEEP]: parseAbiParameters('address token, address recipient, uint256 amountMin'),
  // [CommandType.SWEEP_ERC721]: parseAbiParameters('address token, address recipient, uint256 id'),
  // [CommandType.SWEEP_ERC1155]: parseAbiParameters('address token, address recipient, uint256 id, uint256 amount'),
  [CommandType.TRANSFER]: parseAbiParameters('address token, address recipient, uint256 value'),
  [CommandType.PAY_PORTION]: parseAbiParameters('address token, address recipient, uint256 bips'),
  [CommandType.BALANCE_CHECK_ERC20]: parseAbiParameters('address owner, address token, uint256 minBalance'),
  // [CommandType.OWNER_CHECK_721]: parseAbiParameters('address owner, address token, uint256 id'),
  // [CommandType.OWNER_CHECK_1155]: parseAbiParameters('address owner, address token, uint256 id, uint256 minBalance'),
  // [CommandType.APPROVE_ERC20]: parseAbiParameters('address token, uint256 spender'),

  // NFT Markets
  // [CommandType.SEAPORT_V1_5]: parseAbiParameters('uint256 value, bytes data'),
  // [CommandType.SEAPORT_V1_4]: parseAbiParameters('uint256 value, bytes data'),
  // @fixme: contract not implemented
  // [CommandType.LOOKS_RARE_V2]: parseAbiParameters('uint256 value, bytes data'),
  // [CommandType.X2Y2_721]: parseAbiParameters('uint256 value, bytes data, address recipient, address token, uint256 id'),
  // [CommandType.X2Y2_1155]: parseAbiParameters(
  //   'uint256 value, bytes data, address recipient, address token, uint256 id, uint256 amount',
  // ),
  // [CommandType.PANCAKE_NFT_WBNB]: parseAbiParameters('address collection, uint256 tokenId, uint256 price'),
  // [CommandType.PANCAKE_NFT_BNB]: parseAbiParameters('address collection, uint256 tokenId, uint256 price'),
  // @notice: following marketplace not supported now
  // [CommandType.NFTX]: parseAbiParameters('uint256 value, bytes data'),
  // [CommandType.FOUNDATION]: parseAbiParameters(
  //   'uint256 value, bytes data, address recipient, address token, uint256 id'
  // ),
  // [CommandType.SUDOSWAP]: parseAbiParameters('uint256 value, bytes data'),
  // [CommandType.NFT20]: parseAbiParameters('uint256 value, bytes data'),
  // [CommandType.CRYPTOPUNKS]: parseAbiParameters('uint256 punkId, address recipient, uint256 value'),
  // [CommandType.ELEMENT_MARKET]: parseAbiParameters('uint256 value, bytes data'),
  [CommandType.V4_SWAP]: parseAbiParameters('bytes actions, bytes[] params'),
}

export type CommandUsed = keyof typeof ABI_PARAMETER

export type RouterCommand = {
  type: CommandUsed
  encodedInput: Hex
}

export function createCommand<TCommandType extends CommandUsed>(
  type: TCommandType,
  parameters: ABIParametersType<TCommandType>,
): RouterCommand {
  // const params = parameters.filter((param) => param !== null)
  const encodedInput = encodeAbiParameters(ABI_PARAMETER[type], parameters as any)
  return { type, encodedInput }
}
