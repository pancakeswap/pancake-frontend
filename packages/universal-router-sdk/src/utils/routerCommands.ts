import { AbiParametersToPrimitiveTypes } from 'abitype'
import { Hex, encodeAbiParameters, parseAbiParameters } from 'viem'

export type ABIType = typeof ABI_PARAMETER
export type ABIParametersType<TCommandType extends CommandUsed> = AbiParametersToPrimitiveTypes<ABIType[TCommandType]>

/**
 * CommandTypes
 * @description Flags that modify a command's execution
 * @enum {number}
 */
export enum CommandType {
  // Masks to extract certain bits of commands
  ALLOW_REVERT_FLAG = 0x80,
  COMMAND_TYPE_MASK = 0x3f,

  // Command Types. Maximum supported command at this moment is 0x3f.

  // Command Types where value<0x08, executed in the first nested-if block
  V3_SWAP_EXACT_IN = 0x00,
  V3_SWAP_EXACT_OUT = 0x01,
  PERMIT2_TRANSFER_FROM = 0x02,
  PERMIT2_PERMIT_BATCH = 0x03,
  SWEEP = 0x04,
  TRANSFER = 0x05,
  PAY_PORTION = 0x06,
  // COMMAND_PLACEHOLDER = 0x07;

  // The commands are executed in nested if blocks to minimise gas consumption
  // The following constant defines one of the boundaries where the if blocks split commands
  // FIRST_IF_BOUNDARY = 0x08,

  // Command Types where 0x08<=value<0x10, executed in the second nested-if block
  V2_SWAP_EXACT_IN = 0x08,
  V2_SWAP_EXACT_OUT = 0x09,
  PERMIT2_PERMIT = 0x0a,
  WRAP_ETH = 0x0b,
  UNWRAP_WETH = 0x0c,
  PERMIT2_TRANSFER_FROM_BATCH = 0x0d,
  BALANCE_CHECK_ERC20 = 0x0e,
  // COMMAND_PLACEHOLDER = 0x0f;

  // The commands are executed in nested if blocks to minimise gas consumption
  // The following constant defines one of the boundaries where the if blocks split commands
  // SECOND_IF_BOUNDARY = 0x10,

  // Command Types where 0x10<=value<0x18, executed in the third nested-if block
  // OWNER_CHECK_721 = 0x10,
  // OWNER_CHECK_1155 = 0x11,
  // SWEEP_ERC721 = 0x12,
  // SWEEP_ERC1155 = 0x13,
  // COMMAND_PLACEHOLDER for 0x14-0x17 (all unused)

  // The commands are executed in nested if blocks to minimise gas consumption
  // The following constant defines one of the boundaries where the if blocks split commands
  // THIRD_IF_BOUNDARY = 0x18,

  // Command Types where 0x18<=value<=0x1f, executed in the final nested-if block
  // SEAPORT_V1_5 = 0x18,
  // SEAPORT_V1_4 = 0x19,
  // LOOKS_RARE_V2 = 0x1a,
  // X2Y2_721 = 0x1b,
  // X2Y2_1155 = 0x1c,
  // COMMAND_PLACEHOLDER for 0x1d-0x1f (all unused)

  // The commands are executed in nested if blocks to minimise gas consumption
  // The following constant defines one of the boundaries where the if blocks split commands
  // FOURTH_IF_BOUNDARY = 0x20,

  // Command Types where 0x20<=value
  EXECUTE_SUB_PLAN = 0x20,
  APPROVE_ERC20 = 0x21,
  STABLE_SWAP_EXACT_IN = 0x22,
  STABLE_SWAP_EXACT_OUT = 0x23,
  // PANCAKE_NFT_BNB = 0x24,
  // PANCAKE_NFT_WBNB = 0x25,
}

const ALLOW_REVERT_FLAG = 0x80

const REVERTIBLE_COMMANDS = new Set<CommandType>([
  // CommandType.SEAPORT_V1_5,
  // CommandType.SEAPORT_V1_4,
  // CommandType.LOOKS_RARE_V2,
  // CommandType.X2Y2_721,
  // CommandType.X2Y2_1155,
  CommandType.EXECUTE_SUB_PLAN,
])

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
  [CommandType.APPROVE_ERC20]: parseAbiParameters('address token, uint256 spender'),

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
}

export type CommandUsed = keyof typeof ABI_PARAMETER

export class RoutePlanner {
  commands: Hex

  inputs: Hex[]

  constructor() {
    this.commands = '0x'
    this.inputs = []
  }

  addSubPlan(subplan: RoutePlanner): void {
    this.addCommand(CommandType.EXECUTE_SUB_PLAN, [subplan.commands, subplan.inputs], true)
  }

  addCommand<TCommandType extends CommandUsed>(
    type: TCommandType,
    parameters: ABIParametersType<TCommandType>,
    allowRevert = false,
  ): void {
    const command = createCommand(type, parameters)
    this.inputs.push(command.encodedInput)
    if (allowRevert) {
      if (!REVERTIBLE_COMMANDS.has(command.type)) {
        throw new Error(`command type: ${command.type} cannot be allowed to revert`)
      }
      // eslint-disable-next-line no-bitwise
      command.type |= ALLOW_REVERT_FLAG
    }

    this.commands = this.commands.concat(command.type.toString(16).padStart(2, '0')) as Hex
  }
}

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
