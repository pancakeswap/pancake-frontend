import { defaultAbiCoder } from 'ethers/lib/utils'
// import { encodePacked } from 'viem'

/**
 * CommandTypes
 * @description Flags that modify a command's execution
 * @enum {number}
 */
export enum CommandType {
  // FLAG_ALLOW_REVERT = 0x80,
  // COMMAND_TYPE_MASK = 0x3f,

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
  FIRST_IF_BOUNDARY = 0x08,

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
  SECOND_IF_BOUNDARY = 0x10,

  // Command Types where 0x10<=value<0x18, executed in the third nested-if block
  OWNER_CHECK_721 = 0x10,
  OWNER_CHECK_1155 = 0x11,
  SWEEP_ERC721 = 0x12,
  SWEEP_ERC1155 = 0x13,
  // COMMAND_PLACEHOLDER for 0x14-0x17 (all unused)

  // The commands are executed in nested if blocks to minimise gas consumption
  // The following constant defines one of the boundaries where the if blocks split commands
  THIRD_IF_BOUNDARY = 0x18,

  // Command Types where 0x18<=value<=0x1f, executed in the final nested-if block
  SEAPORT_V1_5 = 0x18,
  SEAPORT_V1_4 = 0x19,
  LOOKS_RARE_V2 = 0x1a,
  X2Y2_721 = 0x1b,
  X2Y2_1155 = 0x1c,
  // COMMAND_PLACEHOLDER for 0x1d-0x1f (all unused)

  // The commands are executed in nested if blocks to minimise gas consumption
  // The following constant defines one of the boundaries where the if blocks split commands
  FOURTH_IF_BOUNDARY = 0x20,

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
  CommandType.SEAPORT_V1_5,
  CommandType.SEAPORT_V1_4,
  // CommandType.NFTX,
  CommandType.LOOKS_RARE_V2,
  CommandType.X2Y2_721,
  CommandType.X2Y2_1155,
  // CommandType.FOUNDATION,
  // CommandType.SUDOSWAP,
  // CommandType.NFT20,
  CommandType.EXECUTE_SUB_PLAN,
  // CommandType.CRYPTOPUNKS,
  // CommandType.ELEMENT_MARKET,
])

const PERMIT_STRUCT =
  '((address token,uint160 amount,uint48 expiration,uint48 nonce) details,address spender,uint256 sigDeadline)'

const PERMIT_BATCH_STRUCT =
  '((address token,uint160 amount,uint48 expiration,uint48 nonce)[] details,address spender,uint256 sigDeadline)'

const PERMIT2_TRANSFER_FROM_STRUCT = '(address from,address to,uint160 amount,address token)'
const PERMIT2_TRANSFER_FROM_BATCH_STRUCT = PERMIT2_TRANSFER_FROM_STRUCT + '[]'

const ABI_DEFINITION: { [key in CommandType]: string[] } = {
  // Batch Reverts
  [CommandType.EXECUTE_SUB_PLAN]: ['bytes', 'bytes[]'],

  // Permit2 Actions
  [CommandType.PERMIT2_PERMIT]: [PERMIT_STRUCT, 'bytes'],
  [CommandType.PERMIT2_PERMIT_BATCH]: [PERMIT_BATCH_STRUCT, 'bytes'],
  [CommandType.PERMIT2_TRANSFER_FROM]: ['address', 'address', 'uint160'],
  [CommandType.PERMIT2_TRANSFER_FROM_BATCH]: [PERMIT2_TRANSFER_FROM_BATCH_STRUCT],

  // Pancake Actions
  [CommandType.V3_SWAP_EXACT_IN]: ['address', 'uint256', 'uint256', 'bytes', 'bool'],
  [CommandType.V3_SWAP_EXACT_OUT]: ['address', 'uint256', 'uint256', 'bytes', 'bool'],
  [CommandType.V2_SWAP_EXACT_IN]: ['address', 'uint256', 'uint256', 'address[]', 'bool'],
  [CommandType.V2_SWAP_EXACT_OUT]: ['address', 'uint256', 'uint256', 'address[]', 'bool'],

  // Token Actions and Checks
  [CommandType.WRAP_ETH]: ['address', 'uint256'],
  [CommandType.UNWRAP_WETH]: ['address', 'uint256'],
  [CommandType.SWEEP]: ['address', 'address', 'uint256'],
  [CommandType.SWEEP_ERC721]: ['address', 'address', 'uint256'],
  [CommandType.SWEEP_ERC1155]: ['address', 'address', 'uint256', 'uint256'],
  [CommandType.TRANSFER]: ['address', 'address', 'uint256'],
  [CommandType.PAY_PORTION]: ['address', 'address', 'uint256'],
  [CommandType.BALANCE_CHECK_ERC20]: ['address', 'address', 'uint256'],
  [CommandType.OWNER_CHECK_721]: ['address', 'address', 'uint256'],
  [CommandType.OWNER_CHECK_1155]: ['address', 'address', 'uint256', 'uint256'],
  [CommandType.APPROVE_ERC20]: ['address', 'uint256'],

  // NFT Markets
  [CommandType.SEAPORT_V1_5]: ['uint256', 'bytes'],
  [CommandType.SEAPORT_V1_4]: ['uint256', 'bytes'],
  // [CommandType.NFTX]: ['uint256', 'bytes'],
  [CommandType.LOOKS_RARE_V2]: ['uint256', 'bytes'],
  [CommandType.X2Y2_721]: ['uint256', 'bytes', 'address', 'address', 'uint256'],
  [CommandType.X2Y2_1155]: ['uint256', 'bytes', 'address', 'address', 'uint256', 'uint256'],
  [CommandType.STABLE_SWAP_EXACT_IN]: ['address', 'uint256', 'uint256', 'address[]', 'uint256[]', 'address'],
  [CommandType.STABLE_SWAP_EXACT_OUT]: ['address', 'uint256', 'uint256', 'address[]', 'uint256[]', 'address'],
  // [CommandType.FOUNDATION]: ['uint256', 'bytes', 'address', 'address', 'uint256'],
  // [CommandType.SUDOSWAP]: ['uint256', 'bytes'],
  // [CommandType.NFT20]: ['uint256', 'bytes'],
  // [CommandType.CRYPTOPUNKS]: ['uint256', 'address', 'uint256'],
  // [CommandType.ELEMENT_MARKET]: ['uint256', 'bytes'],
}

export class RoutePlanner {
  commands: string
  inputs: string[]

  constructor() {
    this.commands = '0x'
    this.inputs = []
  }

  addSubPlan(subplan: RoutePlanner): void {
    this.addCommand(CommandType.EXECUTE_SUB_PLAN, [subplan.commands, subplan.inputs], true)
  }

  addCommand(type: CommandType, parameters: any[], allowRevert = false): void {
    let command = createCommand(type, parameters)
    this.inputs.push(command.encodedInput)
    if (allowRevert) {
      if (!REVERTIBLE_COMMANDS.has(command.type)) {
        throw new Error(`command type: ${command.type} cannot be allowed to revert`)
      }
      command.type = command.type | ALLOW_REVERT_FLAG
    }

    this.commands = this.commands.concat(command.type.toString(16).padStart(2, '0'))
  }
}

export type RouterCommand = {
  type: CommandType
  encodedInput: string
}

export function createCommand(type: CommandType, parameters: any[]): RouterCommand {
  // const encodedInput = encodePacked(ABI_DEFINITION[type], parameters)
  const encodedInput = defaultAbiCoder.encode(ABI_DEFINITION[type], parameters)
  return { type, encodedInput }
}
