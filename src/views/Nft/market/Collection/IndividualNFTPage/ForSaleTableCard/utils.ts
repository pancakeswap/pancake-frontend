type sortBuilder = {
  priceSort: string
}

export const sortNFTsByPriceBuilder =
  ({ priceSort }: sortBuilder) =>
  (nftA, nftB) => {
    const nftPriceA = Number(nftA.marketData.currentAskPrice) ?? 0
    const nftPriceB = Number(nftB.marketData.currentAskPrice) ?? 0

    return priceSort === 'asc' ? nftPriceA - nftPriceB : nftPriceB - nftPriceA
  }
