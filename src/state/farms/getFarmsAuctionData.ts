import { SerializedFarm } from 'state/types'
import { CHAIN_ID } from '../../config/constants/networks'

const getFarmsAuctionData = (
  farms: SerializedFarm[],
  winnerFarms: { [lpAddress: string]: { auctionHostingEndDate: string; hostingIsLive: boolean } },
) => {
  return farms.map((farm) => {
    const auctionHostingInfo = winnerFarms[farm.lpAddresses[CHAIN_ID]]
    const isFarmCurrentlyCommunity = farm.isCommunity ?? !!auctionHostingInfo?.hostingIsLive

    return {
      ...farm,
      isCommunity: isFarmCurrentlyCommunity,
      ...(isFarmCurrentlyCommunity &&
        auctionHostingInfo && { auctionHostingEndDate: auctionHostingInfo.auctionHostingEndDate }),
    }
  })
}

export default getFarmsAuctionData
