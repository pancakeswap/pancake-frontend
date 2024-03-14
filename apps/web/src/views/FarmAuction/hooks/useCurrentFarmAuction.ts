import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { Bidder, ConnectedBidder } from 'config/constants/types'
import { useFarmAuctionContract } from 'hooks/useContract'
import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'
import { Address } from 'wagmi'
import { useFarmAuction } from './useFarmAuction'

export const useCurrentFarmAuction = (account?: Address) => {
  const farmAuctionContract = useFarmAuctionContract()

  const { data: currentAuctionId = undefined } = useQuery({
    queryKey: ['farmAuction', 'currentAuctionId'],

    queryFn: async () => {
      const auctionId = await farmAuctionContract.read.currentAuctionId()
      return Number(auctionId)
    },

    refetchInterval: FAST_INTERVAL,
  })

  const {
    data: { auction: currentAuction, bidders },
    mutate: refreshBidders,
  } = useFarmAuction(currentAuctionId, true)
  const [connectedBidder, setConnectedBidder] = useState<ConnectedBidder | null>(null)

  // Check if connected wallet is whitelisted
  useEffect(() => {
    const checkAccount = async () => {
      try {
        if (!account) return
        const whitelistedStatus = await farmAuctionContract.read.whitelisted([account])
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
    if (!account) return
    const getBidderData = () => {
      if (bidders && bidders.length > 0) {
        const bidderData = bidders.find((bidder) => bidder.account === account)
        if (bidderData) {
          return bidderData
        }
      }
      const bidderInfo = getBidderInfo(account)
      const defaultBidderData: Bidder = {
        position: undefined,
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
