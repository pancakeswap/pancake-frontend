import invariant from 'tiny-invariant'
import { BigintIsh } from '@pancakeswap/sdk'
import { Address, TypedData } from 'viem'
import { MaxSigDeadline, MaxOrderedNonce, MaxAllowanceTransferAmount, MaxAllowanceExpiration } from './constants'
import { permit2Domain } from './domain'
import { TypedDataDomain } from './utils/types'

export interface PermitDetails {
  token: string
  amount: BigintIsh
  expiration: BigintIsh
  nonce: BigintIsh
}

export interface PermitSingle {
  details: PermitDetails
  spender: string
  sigDeadline: BigintIsh
  [key: string]: unknown
}

export interface PermitBatch {
  details: PermitDetails[]
  spender: string
  sigDeadline: BigintIsh
  [key: string]: unknown
}

type TypedStructData<TValue> = {
  domain: TypedDataDomain
  types: TypedData
  values: TValue
}

export type PermitSingleData = TypedStructData<PermitSingle>
export type PermitBatchData = TypedStructData<PermitBatch>

const PERMIT_DETAILS = [
  { name: 'token', type: 'address' },
  { name: 'amount', type: 'uint160' },
  { name: 'expiration', type: 'uint48' },
  { name: 'nonce', type: 'uint48' },
]

const PERMIT_TYPES = {
  PermitSingle: [
    { name: 'details', type: 'PermitDetails' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: PERMIT_DETAILS,
}

const PERMIT_BATCH_TYPES = {
  PermitBatch: [
    { name: 'details', type: 'PermitDetails[]' },
    { name: 'spender', type: 'address' },
    { name: 'sigDeadline', type: 'uint256' },
  ],
  PermitDetails: PERMIT_DETAILS,
}

function isPermit(permit: PermitSingle | PermitBatch): permit is PermitSingle {
  return !Array.isArray(permit.details)
}

export abstract class AllowanceTransfer {
  /**
   * Cannot be constructed.
   */
  // eslint-disable-next-line no-useless-constructor
  private constructor() {}

  // return the data to be sent in a eth_signTypedData RPC call
  // for signing the given permit data
  public static getPermitData(
    permit: PermitSingle | PermitBatch,
    permit2Address: Address,
    chainId: number,
  ): PermitSingleData | PermitBatchData {
    invariant(MaxSigDeadline >= BigInt(permit.sigDeadline), 'SIG_DEADLINE_OUT_OF_RANGE')

    const domain = permit2Domain(permit2Address, chainId)
    if (isPermit(permit)) {
      validatePermitDetails(permit.details)
      return {
        domain,
        types: PERMIT_TYPES,
        values: permit,
      }
    }
    permit.details.forEach(validatePermitDetails)
    return {
      domain,
      types: PERMIT_BATCH_TYPES,
      values: permit,
    }
  }
}

function validatePermitDetails(details: PermitDetails) {
  invariant(MaxOrderedNonce >= BigInt(details.nonce), 'NONCE_OUT_OF_RANGE')
  invariant(MaxAllowanceTransferAmount >= BigInt(details.amount), 'AMOUNT_OUT_OF_RANGE')
  invariant(MaxAllowanceExpiration >= BigInt(details.expiration), 'EXPIRATION_OUT_OF_RANGE')
}
