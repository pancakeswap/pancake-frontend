import nfts from 'config/constants/nfts'

describe('Config NFTs', () => {
  it.each(nfts.map((nft) => nft.identifier))('NFT #%d has an unique identifier', (identifier) => {
    const duplicates = nfts.filter((n) => identifier === n.identifier)
    expect(duplicates).toHaveLength(1)
  })
})
