import { getNetwork } from '../network/network'
import { Address } from '../types'

export type FetchAnsAddressArgs = {
  /** Network to use for provider */
  networkName?: string
  /** ENS name to resolve */
  name: string
}

export type FetchAnsAddressResult = Address | null

export async function fetchAnsAddress({
  networkName: networkName_,
  name,
}: FetchAnsAddressArgs): Promise<FetchAnsAddressResult> {
  const network = getNetwork()
  const networkName = networkName_ || network.chain?.network

  if (networkName !== 'testnet' && networkName !== 'mainnet') {
    return null
  }
  const { address } = await (
    await fetch(`https://www.aptosnames.com/api/${networkName === 'testnet' ? 'testnet/' : ''}v1/address/${name}`)
  ).json()

  try {
    return address ? <Address>address : null
  } catch (_error) {
    return null
  }
}
