import { AuctionStatus } from 'config/constants/types'
import { differenceInDays } from 'date-fns'
import { getFarmAuctionContract } from '../../utils/contractHelpers'
import { AuctionsResponse } from '../../utils/types'
import { processAuctionData, sortAuctionBidders } from '../../views/FarmAuction/helpers'

const fetchCurrentFarmsWithAuctions = async (
  currentBlock: number,
): Promise<{ winnerFarms: string[]; auctionEndDate: string }> => {
  const now = Date.now()
  const farmAuctionContract = getFarmAuctionContract()
  const currentAuctionId = await farmAuctionContract.currentAuctionId()
  const auctionData: AuctionsResponse = await farmAuctionContract.auctions(currentAuctionId)
  const currentAuction = await processAuctionData(currentAuctionId.toNumber(), auctionData, currentBlock)
  if (currentAuction.status === AuctionStatus.Closed) {
    if (differenceInDays(now, currentAuction.endDate) >= 7) {
      return { winnerFarms: [], auctionEndDate: currentAuction.endDate.toJSON() }
    }
    const [auctionBidders] = await farmAuctionContract.viewBidsPerAuction(currentAuctionId, 0, 500)
    const sortedBidders = sortAuctionBidders(auctionBidders)
    const { leaderboardThreshold } = currentAuction
    const winnerFarms = sortedBidders
      .filter((bidder) => leaderboardThreshold.lte(bidder.amount))
      .map((bidder) => bidder.lpAddress)
    return { winnerFarms, auctionEndDate: currentAuction.endDate.toJSON() }
  }

  return { winnerFarms: [], auctionEndDate: null }
}

export default fetchCurrentFarmsWithAuctions
