export type Bytes = ArrayLike<number>

export type { TypedDataDomain, TypedDataParameter } from 'viem'

export interface TypedDataField {
  name: string
  type: string
}
