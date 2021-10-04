const BASE_IPFS_LINK = 'https://cloudflare-ipfs.com/ipfs/'

const getIpfsLinkWithProvider = (ipfsJson: string): string | null => {
  if (!ipfsJson) {
    return null
  }

  const ipfsUrl = ipfsJson.replace('ipfs://', '')
  return `${BASE_IPFS_LINK}${ipfsUrl}`
}

export default getIpfsLinkWithProvider
