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

  V4_SWAP = 0x10,
  V3_POSITION_MANAGER_PERMIT = 0x11,
  V3_POSITION_MANAGER_CALL = 0x12,
  V4_CL_POSITION_CALL = 0x13,
  V4_BIN_POSITION_CALL = 0x14,

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
  // APPROVE_ERC20 = 0x21,
  STABLE_SWAP_EXACT_IN = 0x22,
  STABLE_SWAP_EXACT_OUT = 0x23,
  // PANCAKE_NFT_BNB = 0x24,
  // PANCAKE_NFT_WBNB = 0x25,
}

export enum V4ActionType {
  CL_SWAP_EXACT_IN_SINGLE = 0x04,
  CL_SWAP_EXACT_IN = 0x05,
  CL_SWAP_EXACT_OUT_SINGLE = 0x06,
  CL_SWAP_EXACT_OUT = 0x07,
  BIN_SWAP_EXACT_IN_SINGLE = 0x24,
  BIN_SWAP_EXACT_IN = 0x25,
  BIN_SWAP_EXACT_OUT_SINGLE = 0x26,
  BIN_SWAP_EXACT_OUT = 0x27,

  SETTLE_TAKE_PAIR = 0x16,
}
