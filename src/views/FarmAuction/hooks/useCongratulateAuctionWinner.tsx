import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { Auction, AuctionStatus, Bidder } from 'config/constants/types'
import { useFarmAuctionContract } from 'hooks/useContract'
import { processAuctionData, sortAuctionBidders } from '../helpers'

interface WonAuction {
  auction: Auction
  bidderData: Bidder
}

const useCongratulateAuctionWinner = (currentAuction: Auction, bidders: Bidder[]): WonAuction => {
  const [wonAuction, setWonAuction] = useState<WonAuction | null>(null)

  const { account } = useWeb3React()

  const farmAuctionContract = useFarmAuctionContract()

  useEffect(() => {
    const checkIfWonPreviousAuction = async (previousAuctionId: number) => {
      const auctionData = await farmAuctionContract.auctions(previousAuctionId)
      const processedAuctionData = await processAuctionData(previousAuctionId, auctionData)
      const [auctionBidders] = await farmAuctionContract.viewBidsPerAuction(previousAuctionId, 0, 500)
      const sortedBidders = sortAuctionBidders(auctionBidders)
      const { leaderboardThreshold } = processedAuctionData
      const winnerAddresses = sortedBidders
        .filter((bidder) => leaderboardThreshold.lte(bidder.amount))
        .map((bidder) => bidder.account)
      if (winnerAddresses.includes(account)) {
        const accountBidderData = sortedBidders.find((bidder) => bidder.account === account)
        setWonAuction({
          auction: processedAuctionData,
          bidderData: accountBidderData,
        })
      }
    }

    const winnerAddresses = bidders
      .filter((bidder) => currentAuction.leaderboardThreshold.lte(bidder.amount))
      .map((bidder) => bidder.account)
    const previousAuctionId = currentAuction.id - 1
    if (currentAuction.status === AuctionStatus.Closed && winnerAddresses.includes(account)) {
      const accountBidderData = bidders.find((bidder) => bidder.account === account)
      setWonAuction({
        auction: currentAuction,
        bidderData: accountBidderData,
      })
    } else if (previousAuctionId > 0) {
      checkIfWonPreviousAuction(previousAuctionId)
    }
  }, [currentAuction, bidders, account, farmAuctionContract])

  return wonAuction
}

export default useCongratulateAuctionWinner
