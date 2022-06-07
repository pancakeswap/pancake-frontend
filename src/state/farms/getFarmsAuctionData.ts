import { SerializedFarm } from 'state/types'
import { CHAIN_ID } from '../../config/constants/networks'

const getFarmsAuctionData = (farms: SerializedFarm[], winnerFarms: string[], auctionHostingEndDate: string) => {
  return farms.map((farm) => {
    const isAuctionWinnerFarm = winnerFarms.find(
      (winnerFarm) => winnerFarm.toLowerCase() === farm.lpAddresses[CHAIN_ID].toLowerCase(),
    )
    return {
      ...farm,
      ...(isAuctionWinnerFarm && { isCommunity: true, auctionHostingEndDate }),
    }
  })
}

export default getFarmsAuctionData
