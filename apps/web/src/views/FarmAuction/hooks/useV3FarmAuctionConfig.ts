import { useMemo } from 'react'
import { HARD_CODE_TOP_THREE_AUCTION_DATA, HARD_CODE_V3_AUCTION_DATA_BY_ID } from '../constants'

export const useV3FarmAuctionConfig = (farmAuctionId?: number) => {
  const v3FarmAuctionConfig = useMemo(() => {
    if (farmAuctionId && HARD_CODE_V3_AUCTION_DATA_BY_ID[farmAuctionId]) {
      return HARD_CODE_V3_AUCTION_DATA_BY_ID[farmAuctionId]
    }
    return HARD_CODE_TOP_THREE_AUCTION_DATA
  }, [farmAuctionId])
  return v3FarmAuctionConfig
}
