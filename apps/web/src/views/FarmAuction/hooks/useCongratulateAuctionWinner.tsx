import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Auction, AuctionStatus, Bidder } from 'config/constants/types'
import { useFarmAuctionContract } from 'hooks/useContract'
import { processAuctionData, sortAuctionBidders } from '../helpers'

interface WonAuction {
  auction: Auction
  bidderData: Bidder
}

const useCongratulateAuctionWinner = (currentAuction: Auction, bidders: Bidder[]): WonAuction => {
  const [wonAuction, setWonAuction] = useState<WonAuction | null>(null)

  const { address: account } = useAccount()

  const farmAuctionContract = useFarmAuctionContract()

  useEffect(() => {
    const checkIfWonPreviousAuction = async (previousAuctionId: number) => {
      const auctionData = await farmAuctionContract.read.auctions([BigInt(previousAuctionId)])
      const processedAuctionData = await processAuctionData(previousAuctionId, {
        status: auctionData[0],
        startBlock: auctionData[1],
        endBlock: auctionData[2],
        initialBidAmount: auctionData[3],
        leaderboard: auctionData[4],
        leaderboardThreshold: auctionData[5],
      })
      const [auctionBidders] = await farmAuctionContract.read.viewBidsPerAuction([BigInt(previousAuctionId), 0n, 500n])
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
