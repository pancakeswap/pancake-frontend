import { useState, useEffect } from 'react'
import { useFarmAuctionContract } from 'hooks/useContract'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { FarmAuctionBidderConfig } from 'config/constants/types'
import { AUCTION_WHITELISTED_BIDDERS_TO_FETCH } from 'config'

const useWhitelistedAddresses = () => {
  const [whitelistedAddresses, setWhitelistedAddresses] = useState<FarmAuctionBidderConfig[] | null>(null)
  const farmAuctionContract = useFarmAuctionContract(false)

  useEffect(() => {
    const fetchWhitelistedAddresses = async () => {
      try {
        const [bidderAddresses] = await farmAuctionContract.viewBidders(0, AUCTION_WHITELISTED_BIDDERS_TO_FETCH)
        const bidders = bidderAddresses.map((address) => getBidderInfo(address))
        setWhitelistedAddresses(bidders)
      } catch (error) {
        console.error('Failed to fetch list of whitelisted addresses', error)
      }
    }
    if (!whitelistedAddresses) {
      fetchWhitelistedAddresses()
    }
  }, [farmAuctionContract, whitelistedAddresses])

  return whitelistedAddresses
}

export default useWhitelistedAddresses
