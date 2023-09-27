import { BigintIsh } from '@pancakeswap/sdk'

export type Bytes = ArrayLike<number>
type BytesLike = string | Bytes

export interface TypedDataDomain {
  name?: string
  version?: string
  chainId?: BigintIsh
  verifyingContract?: string
  salt?: BytesLike
}

export interface TypedDataField {
  name: string
  type: string
}
