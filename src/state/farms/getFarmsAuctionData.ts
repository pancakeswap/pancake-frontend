import { isAddress } from 'utils'
import { SerializedFarm } from 'state/types'
import { CHAIN_ID } from '../../config/constants/networks'

const getFarmsAuctionData = (
  farms: SerializedFarm[],
  winnerFarms: { [lpAddress: string]: { auctionHostingEndDate: string; hostingIsLive: boolean } },
) => {
  return farms.map((farm) => {
    const farmAddress = isAddress(farm.lpAddresses[CHAIN_ID])
    if (!farmAddress) return farm
    const auctionHostingInfo = winnerFarms[farmAddress]
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
