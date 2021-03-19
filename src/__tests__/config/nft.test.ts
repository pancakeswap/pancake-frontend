import nfts from 'config/constants/nfts'

describe('Config NFTs', () => {
  it.each(nfts.map((nft) => nft.bunnyId))('NFT #%d has an unique bunny id', (bunnyId) => {
    const duplicates = nfts.filter((n) => bunnyId === n.bunnyId)
    expect(duplicates).toHaveLength(1)
  })
})
