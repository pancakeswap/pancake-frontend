import { useQuery } from '@tanstack/react-query'
import { AUCTION_BIDDERS_TO_FETCH } from 'config'
import { FAST_INTERVAL } from 'config/constants'
import { useFarmAuctionContract } from 'hooks/useContract'
import { processAuctionData, sortAuctionBidders } from '../helpers'

export const useFarmAuction = (auctionId: number | undefined, watch?: boolean) => {
  const farmAuctionContract = useFarmAuctionContract()

  const {
    data = {
      auction: null,
      bidders: null,
    },
    refetch,
  } = useQuery({
    queryKey: ['farmAuction', auctionId],

    queryFn: async () => {
      if (!auctionId) return { auction: null, bidders: null }

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

    enabled: Boolean(auctionId && Number.isFinite(auctionId) && auctionId > 0),
    refetchInterval: watch ? FAST_INTERVAL : false,
  })

  return { data, mutate: refetch }
}
