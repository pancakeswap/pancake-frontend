import { useState, useEffect } from 'react'
import isEqual from 'lodash/isEqual'
import { useFarmAuctionContract } from 'hooks/useContract'
import { Auction, ConnectedBidder, Bidder } from 'config/constants/types'
import { getBidderInfo } from 'config/constants/farmAuctions'
import useLastUpdated from 'hooks/useLastUpdated'
import { AUCTION_BIDDERS_TO_FETCH } from 'config'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { BIG_ZERO } from 'utils/bigNumber'
import { sortAuctionBidders, processAuctionData } from '../helpers'

export const useCurrentFarmAuction = (account: string) => {
  const [currentAuction, setCurrentAuction] = useState<Auction | null>(null)
  const [bidders, setBidders] = useState<Bidder[] | null>(null)
  const [connectedBidder, setConnectedBidder] = useState<ConnectedBidder | null>(null)
  // Used to force-refresh bidders after successful bid
  const { lastUpdated, setLastUpdated } = useLastUpdated()

  const farmAuctionContract = useFarmAuctionContract(false)

  // Get latest auction id and its data
  useFastRefreshEffect(() => {
    const fetchCurrentAuction = async () => {
      try {
        const auctionId = await farmAuctionContract.currentAuctionId()
        const auctionData = await farmAuctionContract.auctions(auctionId)
        const processedAuctionData = await processAuctionData(auctionId.toNumber(), auctionData)
        setCurrentAuction(processedAuctionData)
      } catch (error) {
        console.error('Failed to fetch current auction', error)
      }
    }
    fetchCurrentAuction()
  }, [farmAuctionContract])

  // Fetch bidders for current auction
  useFastRefreshEffect(() => {
    const fetchBidders = async () => {
      try {
        const [currentAuctionBidders] = await farmAuctionContract.viewBidsPerAuction(
          currentAuction.id,
          0,
          AUCTION_BIDDERS_TO_FETCH,
        )
        const sortedBidders = sortAuctionBidders(currentAuctionBidders, currentAuction)
        setBidders(sortedBidders)
      } catch (error) {
        console.error('Failed to fetch bidders', error)
      }
    }
    if (currentAuction) {
      fetchBidders()
    }
  }, [currentAuction, farmAuctionContract, lastUpdated])

  // Check if connected wallet is whitelisted
  useEffect(() => {
    const checkAccount = async () => {
      try {
        const whitelistedStatus = await farmAuctionContract.whitelisted(account)
        setConnectedBidder({
          account,
          isWhitelisted: whitelistedStatus,
        })
      } catch (error) {
        console.error('Failed to check if account is whitelisted', error)
      }
    }
    if (account && (!connectedBidder || connectedBidder.account !== account)) {
      checkAccount()
    }
    // Refresh UI if user logs out
    if (!account) {
      setConnectedBidder(null)
    }
  }, [account, connectedBidder, farmAuctionContract])

  // Attach bidder data to connectedBidder object
  useEffect(() => {
    const getBidderData = () => {
      if (bidders && bidders.length > 0) {
        const bidderData = bidders.find((bidder) => bidder.account === account)
        if (bidderData) {
          return bidderData
        }
      }
      const bidderInfo = getBidderInfo(account)
      const defaultBidderData = {
        position: null,
        samePositionAsAbove: false,
        isTopPosition: false,
        amount: BIG_ZERO,
        ...bidderInfo,
      }
      return defaultBidderData
    }
    if (connectedBidder && connectedBidder.isWhitelisted) {
      const bidderData = getBidderData()
      if (!isEqual(bidderData, connectedBidder.bidderData)) {
        setConnectedBidder({
          account,
          isWhitelisted: true,
          bidderData,
        })
      }
    }
  }, [account, connectedBidder, bidders])

  return {
    currentAuction,
    bidders,
    connectedBidder,
    refreshBidders: setLastUpdated,
  }
}
