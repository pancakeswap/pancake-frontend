import { getNetwork } from '../network/network'

export type FetchAnsNameArgs = {
  /** Address to lookup */
  address: string
  /** Network to use for provider */
  networkName?: string
}

export type FetchAnsNameResult = string | null

export async function fetchAnsName({
  address,
  networkName: networkName_,
}: FetchAnsNameArgs): Promise<FetchAnsNameResult> {
  const network = getNetwork()
  const networkName = networkName_ || network.chain?.network

  if (networkName !== 'testnet' && networkName !== 'mainnet') {
    return null
  }
  try {
    const { name } = await (
      await fetch(`https://www.aptosnames.com/api/${networkName === 'testnet' ? 'testnet/' : ''}v1/name/${address}`)
    ).json()
    return name
  } catch (_error) {
    return null
  }
}
