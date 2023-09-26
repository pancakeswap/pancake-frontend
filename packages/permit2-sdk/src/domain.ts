const PERMIT2_DOMAIN_NAME = 'Permit2'

export function permit2Domain(permit2Address: string, chainId: number): {
  name: string,
  version: string,
  chainId: string,
  verifyingContract: string,
} {
  return {
    name: PERMIT2_DOMAIN_NAME,
    chainId,
    verifyingContract: permit2Address,
  }
}

export type PermitData = {
  domain: {
    name: string,
    version: string,
    chainId: string,
    verifyingContract: string,
  }
  types: any
  values: any
}
