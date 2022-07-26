import { ChainId } from '@pancakeswap/sdk'
import { SerializedFarm } from 'state/types'

const getFarmsAuctionData = (farms: SerializedFarm[], winnerFarms: string[], auctionHostingEndDate: string) => {
  return farms.map((farm) => {
    const isAuctionWinnerFarm = winnerFarms.find(
      (winnerFarm) => winnerFarm.toLowerCase() === farm.lpAddresses[ChainId.BSC].toLowerCase(),
    )
    return {
      ...farm,
      ...(isAuctionWinnerFarm && { isCommunity: true, auctionHostingEndDate }),
    }
  })
}

export default getFarmsAuctionData
