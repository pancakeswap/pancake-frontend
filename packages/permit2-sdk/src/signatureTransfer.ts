import invariant from 'tiny-invariant'
import { permit2Domain } from './domain'
import { MaxSigDeadline, MaxUnorderedNonce, MaxSignatureTransferAmount } from './constants'
import { BigintIsh } from '@pancakeswap/sdk'

export interface Witness {
  witness: any
  witnessTypeName: string
  witnessType: any
}

export interface TokenPermissions {
  token: string
  amount: BigintIsh
}

export interface PermitTransferFrom {
  permitted: TokenPermissions
  spender: string
  nonce: BigintIsh
  deadline: BigintIsh
}

export interface PermitBatchTransferFrom {
  permitted: TokenPermissions[]
  spender: string
  nonce: BigintIsh
  deadline: BigintIsh
}

export type PermitTransferFromData = {
  domain: {
    name: string,
    version: string,
    chainId: string,
    verifyingContract: string,
  }
  types: any
  values: PermitTransferFrom
}

export type PermitBatchTransferFromData = {
  domain: {
    name: string,
    version: string,
    chainId: string,
    verifyingContract: string,
  }
  types: any
  values: PermitBatchTransferFrom
}

const TOKEN_PERMISSIONS = [
  { name: 'token', type: 'address' },
  { name: 'amount', type: 'uint256' },
]

const PERMIT_TRANSFER_FROM_TYPES = {
  PermitTransferFrom: [
    { name: 'permitted', type: 'TokenPermissions' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
  TokenPermissions: TOKEN_PERMISSIONS,
}

const PERMIT_BATCH_TRANSFER_FROM_TYPES = {
  PermitBatchTransferFrom: [
    { name: 'permitted', type: 'TokenPermissions[]' },
    { name: 'spender', type: 'address' },
    { name: 'nonce', type: 'uint256' },
    { name: 'deadline', type: 'uint256' },
  ],
  TokenPermissions: TOKEN_PERMISSIONS,
}

function permitTransferFromWithWitnessType(witness: Witness): Record<string, TypedDataField[]> {
  return {
    PermitWitnessTransferFrom: [
      { name: 'permitted', type: 'TokenPermissions' },
      { name: 'spender', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'witness', type: witness.witnessTypeName },
    ],
    TokenPermissions: TOKEN_PERMISSIONS,
    ...witness.witnessType,
  }
}

function permitBatchTransferFromWithWitnessType(witness: Witness): Record<string, TypedDataField[]> {
  return {
    PermitBatchWitnessTransferFrom: [
      { name: 'permitted', type: 'TokenPermissions[]' },
      { name: 'spender', type: 'address' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
      { name: 'witness', type: witness.witnessTypeName },
    ],
    TokenPermissions: TOKEN_PERMISSIONS,
    ...witness.witnessType,
  }
}

function isPermitTransferFrom(permit: PermitTransferFrom | PermitBatchTransferFrom): permit is PermitTransferFrom {
  return !Array.isArray(permit.permitted)
}

export abstract class SignatureTransfer {
  /**
   * Cannot be constructed.
   */
  private constructor() {}

  // return the data to be sent in a eth_signTypedData RPC call
  // for signing the given permit data
  public static getPermitData(
    permit: PermitTransferFrom | PermitBatchTransferFrom,
    permit2Address: string,
    chainId: number,
    witness?: Witness
  ): PermitTransferFromData | PermitBatchTransferFromData {
    invariant(MaxSigDeadline >= BigInt(permit.deadline), 'SIG_DEADLINE_OUT_OF_RANGE')
    invariant(MaxUnorderedNonce >= BigInt(permit.nonce), 'NONCE_OUT_OF_RANGE')

    const domain = permit2Domain(permit2Address, chainId)
    if (isPermitTransferFrom(permit)) {
      validateTokenPermissions(permit.permitted)
      const types = witness ? permitTransferFromWithWitnessType(witness) : PERMIT_TRANSFER_FROM_TYPES
      const values = witness ? Object.assign(permit, { witness: witness.witness }) : permit
      return {
        domain,
        types,
        values,
      }
    } else {
      permit.permitted.forEach(validateTokenPermissions)
      const types = witness ? permitBatchTransferFromWithWitnessType(witness) : PERMIT_BATCH_TRANSFER_FROM_TYPES
      const values = witness ? Object.assign(permit, { witness: witness.witness }) : permit
      return {
        domain,
        types,
        values,
      }
    }
  }
}


function validateTokenPermissions(permissions: TokenPermissions) {
  invariant(MaxSignatureTransferAmount >= BigInt(permissions.amount), 'AMOUNT_OUT_OF_RANGE')
}
