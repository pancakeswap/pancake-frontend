import { useEffect, useState } from 'react'
import isEqual from 'lodash/isEqual'
import useSWR from 'swr'
import { useFarmAuctionContract } from 'hooks/useContract'
import { ConnectedBidder } from 'config/constants/types'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { AUCTION_BIDDERS_TO_FETCH } from 'config'
import { FAST_INTERVAL } from 'config/constants'
import { BIG_ZERO } from 'utils/bigNumber'
import { processAuctionData, sortAuctionBidders } from '../helpers'

export const useCurrentFarmAuction = (account: string) => {
  const { data: currentAuction = null } = useSWR(
    ['farmAuction', 'currentAuction'],
    async () => {
      const auctionId = await farmAuctionContract.currentAuctionId()
      const auctionData = await farmAuctionContract.auctions(auctionId)
      return processAuctionData(auctionId.toNumber(), auctionData)
    },
    { refreshInterval: FAST_INTERVAL },
  )

  const { data: bidders = null, mutate: refreshBidders } = useSWR(
    currentAuction ? ['farmAuction', 'currentAuctionBidders'] : null,
    async () => {
      const [currentAuctionBidders] = await farmAuctionContract.viewBidsPerAuction(
        currentAuction.id,
        0,
        AUCTION_BIDDERS_TO_FETCH,
      )
      return sortAuctionBidders(currentAuctionBidders, currentAuction)
    },
    { refreshInterval: FAST_INTERVAL },
  )
  const [connectedBidder, setConnectedBidder] = useState<ConnectedBidder | null>(null)

  const farmAuctionContract = useFarmAuctionContract(false)

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
    refreshBidders,
  }
}
