import { useEffect, useState } from 'react'
import isEqual from 'lodash/isEqual'
import useSWR from 'swr'
import { useFarmAuctionContract } from 'hooks/useContract'
import { ConnectedBidder } from 'config/constants/types'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { Address } from 'wagmi'
import { FAST_INTERVAL } from 'config/constants'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useFarmAuction } from './useFarmAuction'

export const useCurrentFarmAuction = (account: Address) => {
  const { data: currentAuctionId = null } = useSWR(
    ['farmAuction', 'currentAuctionId'],
    async () => {
      const auctionId = await farmAuctionContract.read.currentAuctionId()
      return Number(auctionId)
    },
    { refreshInterval: FAST_INTERVAL },
  )

  const {
    data: { auction: currentAuction, bidders },
    mutate: refreshBidders,
  } = useFarmAuction(currentAuctionId, { refreshInterval: FAST_INTERVAL })
  const [connectedBidder, setConnectedBidder] = useState<ConnectedBidder | null>(null)

  const farmAuctionContract = useFarmAuctionContract()

  // Check if connected wallet is whitelisted
  useEffect(() => {
    const checkAccount = async () => {
      try {
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
