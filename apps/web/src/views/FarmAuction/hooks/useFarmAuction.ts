import useSWR from 'swr'
import { useFarmAuctionContract } from 'hooks/useContract'
import { AUCTION_BIDDERS_TO_FETCH } from 'config'
import { processAuctionData, sortAuctionBidders } from '../helpers'

export const useFarmAuction = (auctionId: number, configuration?: any) => {
  const farmAuctionContract = useFarmAuctionContract(false)

  const {
    data = {
      auction: null,
      bidders: null,
    },
    mutate: refreshBidders,
  } = useSWR(
    Number.isFinite(auctionId) && auctionId > 0 ? ['farmAuction', auctionId] : null,
    async () => {
      const auctionData = await farmAuctionContract.auctions(auctionId)
      const processedAuction = await processAuctionData(auctionId, auctionData)
      const [currentAuctionBidders] = await farmAuctionContract.viewBidsPerAuction(
        processedAuction.id,
        0,
        AUCTION_BIDDERS_TO_FETCH,
      )
      return { auction: processedAuction, bidders: sortAuctionBidders(currentAuctionBidders, processedAuction) }
    },
    configuration || {},
  )

  return { data, mutate: refreshBidders }
}
