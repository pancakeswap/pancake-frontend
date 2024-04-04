import { BigintIsh } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'
import { Address, Hex, hashTypedData } from 'viem'
import { MaxSigDeadline, MaxSignatureTransferAmount, MaxUnorderedNonce } from './constants'
import { permit2Domain } from './domain'
import { TypedDataDomain, TypedDataParameter } from './utils/types'

export type Witness = {
  witness: { [key: string]: unknown }
  witnessTypeName: string
  witnessType: Record<string, TypedDataParameter[]>
}

export type TokenPermissions = {
  token: string
  amount: BigintIsh
}

export type PermitTransferFrom = {
  permitted: TokenPermissions
  spender: string
  nonce: BigintIsh
  deadline: BigintIsh
}

export type PermitBatchTransferFrom = {
  permitted: TokenPermissions[]
  spender: string
  nonce: BigintIsh
  deadline: BigintIsh
}

export type PermitTransferFromData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataParameter[]>
  values: PermitTransferFrom
  primaryType: 'PermitTransferFrom'
}

export type PermitWitnessTransferFromData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataParameter[]>
  values: PermitTransferFrom & { witness: { [key: string]: unknown } }
  primaryType: 'PermitWitnessTransferFrom'
}

export type PermitBatchTransferFromData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataParameter[]>
  values: PermitBatchTransferFrom
  primaryType: 'PermitBatchTransferFrom'
}

export type PermitBatchWitnessTransferFromData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataParameter[]>
  values: PermitBatchTransferFrom & { witness: { [key: string]: unknown } }
  primaryType: 'PermitBatchWitnessTransferFrom'
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

function permitTransferFromWithWitnessType(witness: Witness): Record<string, TypedDataParameter[]> {
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

function permitBatchTransferFromWithWitnessType(witness: Witness): Record<string, TypedDataParameter[]> {
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
  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  // return the data to be sent in a eth_signTypedData RPC call
  // for signing the given permit data
  public static getPermitData<
    TPermit extends PermitTransferFrom | PermitBatchTransferFrom,
    TWitness extends Witness | undefined,
    ReturnType = TPermit extends PermitTransferFrom
      ? TWitness extends undefined
        ? PermitTransferFromData
        : PermitWitnessTransferFromData
      : TWitness extends undefined
      ? PermitBatchTransferFromData
      : PermitBatchWitnessTransferFromData,
  >(permit: TPermit, permit2Address: Address | undefined, chainId: number, witness?: TWitness): ReturnType {
    invariant(MaxSigDeadline >= BigInt(permit.deadline), 'SIG_DEADLINE_OUT_OF_RANGE')
    invariant(MaxUnorderedNonce >= BigInt(permit.nonce), 'NONCE_OUT_OF_RANGE')

    const domain = permit2Domain(permit2Address, chainId)
    if (isPermitTransferFrom(permit)) {
      validateTokenPermissions(permit.permitted)
      const types = witness ? permitTransferFromWithWitnessType(witness) : PERMIT_TRANSFER_FROM_TYPES
      const values = witness ? Object.assign(permit, { witness: witness.witness }) : permit
      const primaryType = witness ? 'PermitWitnessTransferFrom' : 'PermitTransferFrom'
      return {
        domain,
        types,
        values,
        primaryType,
      } as ReturnType
    }
    permit.permitted.forEach(validateTokenPermissions)
    const types = witness ? permitBatchTransferFromWithWitnessType(witness) : PERMIT_BATCH_TRANSFER_FROM_TYPES
    const values = witness ? Object.assign(permit, { witness: witness.witness }) : permit
    const primaryType = witness ? 'PermitBatchWitnessTransferFrom' : 'PermitBatchTransferFrom'
    return {
      domain,
      types,
      values,
      primaryType,
    } as ReturnType
  }

  public static hash(
    permit: PermitTransferFrom | PermitBatchTransferFrom,
    permit2Address: Address,
    chainId: number,
    witness?: Witness,
  ): Hex {
    const { domain, types, values, primaryType } = SignatureTransfer.getPermitData(
      permit,
      permit2Address,
      chainId,
      witness,
    )
    return hashTypedData({
      domain,
      types,
      primaryType,
      message: values,
    })
  }
}

function validateTokenPermissions(permissions: TokenPermissions) {
  invariant(MaxSignatureTransferAmount >= BigInt(permissions.amount), 'AMOUNT_OUT_OF_RANGE')
}
