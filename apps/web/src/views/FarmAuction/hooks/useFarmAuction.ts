import useSWR from 'swr'
import { useFarmAuctionContract } from 'hooks/useContract'
import { AUCTION_BIDDERS_TO_FETCH } from 'config'
import { processAuctionData, sortAuctionBidders } from '../helpers'

export const useFarmAuction = (auctionId: number, configuration?: any) => {
  const farmAuctionContract = useFarmAuctionContract()

  const {
    data = {
      auction: null,
      bidders: null,
    },
    mutate: refreshBidders,
  } = useSWR(
    Number.isFinite(auctionId) && auctionId > 0 ? ['farmAuction', auctionId] : null,
    async () => {
      const auctionData = await farmAuctionContract.read.auctions([BigInt(auctionId)])
      const processedAuction = await processAuctionData(auctionId, {
        status: auctionData[0],
        startBlock: auctionData[1],
        endBlock: auctionData[2],
        initialBidAmount: auctionData[3],
        leaderboard: auctionData[4],
        leaderboardThreshold: auctionData[5],
      })
      const [currentAuctionBidders] = await farmAuctionContract.read.viewBidsPerAuction([
        BigInt(processedAuction.id),
        0n,
        BigInt(AUCTION_BIDDERS_TO_FETCH),
      ])
      return { auction: processedAuction, bidders: sortAuctionBidders(currentAuctionBidders, processedAuction) }
    },
    configuration || {},
  )

  return { data, mutate: refreshBidders }
}
