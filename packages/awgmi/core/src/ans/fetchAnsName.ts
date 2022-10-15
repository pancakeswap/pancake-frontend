export type FetchAnsNameArgs = {
  /** Address to lookup */
  address: string
  /** Network to use for provider */
  networkName?: string
}

export type FetchAnsNameResult = string | null

export async function fetchAnsName({ address, networkName }: FetchAnsNameArgs): Promise<FetchAnsNameResult> {
  if (networkName !== 'testnet') {
    return null
  }
  try {
    const { name } = await (await fetch(`https://www.aptosnames.com/api/testnet/v1/name/${address}`)).json()
    return name
  } catch (_error) {
    return null
  }
}
