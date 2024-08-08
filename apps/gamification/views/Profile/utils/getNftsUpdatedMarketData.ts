import { NOT_ON_SALE_SELLER } from 'config/constants'
import { getNftMarketContract } from 'utils/contractHelpers'
import { Address } from 'viem'

export const getNftsUpdatedMarketData = async (
  collectionAddress: Address,
  tokenIds: string[],
): Promise<{ tokenId: string; currentSeller: string; currentAskPrice: bigint; isTradable: boolean }[] | null> => {
  try {
    const nftMarketContract = getNftMarketContract()
    const response = await nftMarketContract.read.viewAsksByCollectionAndTokenIds([
      collectionAddress,
      tokenIds.map((t) => BigInt(t)),
    ])
    const askInfo = response?.[1]

    if (!askInfo) return null

    return askInfo.map((tokenAskInfo, index) => {
      const isTradable = tokenAskInfo.seller ? tokenAskInfo.seller.toLowerCase() !== NOT_ON_SALE_SELLER : false

      return {
        tokenId: tokenIds[index],
        currentSeller: tokenAskInfo.seller,
        isTradable,
        currentAskPrice: tokenAskInfo.price,
      }
    })
  } catch (error) {
    console.error('Failed to fetch updated NFT market data', error)
    return null
  }
}
