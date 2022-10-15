import { Address } from '../types'

export type FetchAnsAddressArgs = {
  /** Network to use for provider */
  networkName?: string
  /** ENS name to resolve */
  name: string
}

export type FetchAnsAddressResult = Address | null

export async function fetchAnsAddress({ networkName, name }: FetchAnsAddressArgs): Promise<FetchAnsAddressResult> {
  // TODO: for mainnet
  if (networkName !== 'testnet') {
    return null
  }
  const { address } = await (await fetch(`https://www.aptosnames.com/api/testnet/v1/address/${name}`)).json()

  try {
    return address ? <Address>address : null
  } catch (_error) {
    return null
  }
}
