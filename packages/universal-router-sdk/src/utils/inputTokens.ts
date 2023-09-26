import { PermitSingle } from '@pancakeswap/permit2-sdk'
import { Buffer } from 'buffer'
import invariant from 'tiny-invariant'
import { OPENSEA_CONDUIT_SPENDER_ID, ROUTER_AS_RECIPIENT, SUDOSWAP_SPENDER_ID } from './constants'
import { CommandType, RoutePlanner } from './routerCommands'

export interface Permit2Permit extends PermitSingle {
  signature: string
}

export type ApproveProtocol = {
  token: string
  protocol: string
}

export type Permit2TransferFrom = {
  token: string
  amount: string
  recipient?: string
}

export type InputTokenOptions = {
  approval?: ApproveProtocol
  permit2Permit?: Permit2Permit
  permit2TransferFrom?: Permit2TransferFrom
}

const SIGNATURE_LENGTH = 65
const EIP_2098_SIGNATURE_LENGTH = 64

const hexToBytes = (hex: string): number[] => {
  const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex
  const bytes = []
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes.push(parseInt(cleanHex.substr(i, 2), 16))
  }
  return bytes
}
export function encodePermit(planner: RoutePlanner, permit2: Permit2Permit): void {
  let { signature } = permit2
  const { length } = hexToBytes(permit2.signature)

  if (length === SIGNATURE_LENGTH || length === EIP_2098_SIGNATURE_LENGTH) {
    const r = Buffer.from(permit2.signature.slice(0, 32))
    const s = Buffer.from(permit2.signature.slice(32, 64))
    let v = permit2.signature[64]
    const _vs = Buffer.from(permit2.signature.slice(64, permit2.signature.length - 2))
    v = v === '0' ? '1b' : '1c'
    signature = Buffer.concat([r, s, _vs]).toString() + v
  }

  planner.addCommand(CommandType.PERMIT2_PERMIT, [permit2, signature])
}

// Handles the encoding of commands needed to gather input tokens for a trade
// Approval: The router approving another address to take tokens.
//   note: Only seaport and sudoswap support this action. Approvals are left open.
// Permit: A Permit2 signature-based Permit to allow the router to access a user's tokens
// Transfer: A Permit2 TransferFrom of tokens from a user to either the router or another address
export function encodeInputTokenOptions(planner: RoutePlanner, options: InputTokenOptions) {
  // first ensure that all tokens provided for encoding are the same
  if (!!options.approval && !!options.permit2Permit)
    invariant(options.approval.token === options.permit2Permit.details.token, `inconsistent token`)
  if (!!options.approval && !!options.permit2TransferFrom)
    invariant(options.approval.token === options.permit2TransferFrom.token, `inconsistent token`)
  if (!!options.permit2TransferFrom && !!options.permit2Permit)
    invariant(options.permit2TransferFrom.token === options.permit2Permit.details.token, `inconsistent token`)

  // if an options.approval is required, add it
  if (options.approval) {
    planner.addCommand(CommandType.APPROVE_ERC20, [
      options.approval.token,
      mapApprovalProtocol(options.approval.protocol),
    ])
  }

  // if this order has a options.permit2Permit, encode it
  if (options.permit2Permit) {
    encodePermit(planner, options.permit2Permit)
  }

  if (options.permit2TransferFrom) {
    planner.addCommand(CommandType.PERMIT2_TRANSFER_FROM, [
      options.permit2TransferFrom.token,
      options.permit2TransferFrom.recipient ? options.permit2TransferFrom.recipient : ROUTER_AS_RECIPIENT,
      options.permit2TransferFrom.amount,
    ])
  }
}

function mapApprovalProtocol(protocolAddress: string): number {
  switch (protocolAddress.toLowerCase()) {
    case '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC': // Seaport v1.5
      return OPENSEA_CONDUIT_SPENDER_ID
    case '0x00000000000001ad428e4906aE43D8F9852d0dD6': // Seaport v1.4
      return OPENSEA_CONDUIT_SPENDER_ID
    case '0x2B2e8cDA09bBA9660dCA5cB6233787738Ad68329': // Sudoswap
      return SUDOSWAP_SPENDER_ID
    default:
      throw new Error('unsupported protocol address')
  }
}
