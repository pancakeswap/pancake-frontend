import type { Address } from 'viem'
import { TypedDataDomain, TypedDataParameter } from './utils/types'

const PERMIT2_DOMAIN_NAME = 'Permit2'

export function permit2Domain(permit2Address: Address, chainId: number): TypedDataDomain {
  return {
    name: PERMIT2_DOMAIN_NAME,
    chainId,
    verifyingContract: permit2Address,
  }
}

export type PermitData = {
  domain: TypedDataDomain
  types: Record<string, TypedDataParameter[]>
  values: any
}
