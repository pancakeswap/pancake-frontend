import { useFarmAuctionContract } from 'hooks/useContract'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { FarmAuctionBidderConfig } from 'config/constants/types'
import { AUCTION_WHITELISTED_BIDDERS_TO_FETCH } from 'config'
import { useQuery } from '@tanstack/react-query'

const useWhitelistedAddresses = (): FarmAuctionBidderConfig[] => {
  const farmAuctionContract = useFarmAuctionContract()

  const { data } = useQuery(['farmAuction', 'whitelistedAddresses'], async () => {
    try {
      const [bidderAddresses] = await farmAuctionContract.read.viewBidders([
        0n,
        BigInt(AUCTION_WHITELISTED_BIDDERS_TO_FETCH),
      ])
      return bidderAddresses.map((address) => getBidderInfo(address))
    } catch (error) {
      throw Error('Failed to fetch list of whitelisted addresses')
    }
  })

  return data
}

export default useWhitelistedAddresses
