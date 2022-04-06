import { NOT_ON_SALE_SELLER } from 'config/constants'
import { AskStructOutput } from 'config/abi/types/NftMarket'

const getTokensFromAskInfo = (askInfo: AskStructOutput[], tokenIds: string[]) => {
  return askInfo
    .map((tokenAskInfo, index) => {
      if (!tokenAskInfo.seller || !tokenAskInfo.price) return null
      const currentSeller = tokenAskInfo.seller
      const isTradable = currentSeller.toLowerCase() !== NOT_ON_SALE_SELLER
      if (!isTradable) return null

      return {
        tokenId: tokenIds[index],
        currentSeller,
        currentAskPrice: tokenAskInfo.price,
      }
    })
    .filter((tokenUpdatedPrice) => {
      return tokenUpdatedPrice && tokenUpdatedPrice.currentAskPrice.gt(0)
    })
}

export default getTokensFromAskInfo
