import { useQuery } from '@tanstack/react-query'
import { AUCTION_WHITELISTED_BIDDERS_TO_FETCH } from 'config'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { FarmAuctionBidderConfig } from 'config/constants/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getFarmAuctionContract } from 'utils/contractHelpers'

const useWhitelistedAddresses = (): FarmAuctionBidderConfig[] | undefined => {
  const { chainId } = useActiveChainId()
  const farmAuctionContract = getFarmAuctionContract(undefined, chainId)

  const { data } = useQuery({
    queryKey: ['farmAuction', 'whitelistedAddresses', chainId],

    queryFn: async () => {
      try {
        const [bidderAddresses] = await farmAuctionContract.read.viewBidders([
          0n,
          BigInt(AUCTION_WHITELISTED_BIDDERS_TO_FETCH),
        ])
        return bidderAddresses.map((address) => getBidderInfo(address))
      } catch (error) {
        throw Error('Failed to fetch list of whitelisted addresses')
      }
    },
  })

  return data
}

export default useWhitelistedAddresses
