import { getFarmAuctionContract } from 'utils/contractHelpers'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import { FARM_AUCTION_HOSTING_IN_SECONDS } from '@pancakeswap/farms'
import { BSC_BLOCK_TIME } from 'config'
import { add, sub } from 'date-fns'
import { publicClient } from 'utils/wagmi'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { ChainId } from '@pancakeswap/sdk'
import { sortAuctionBidders } from '../../views/FarmAuction/helpers'

const fetchFarmsWithAuctions = async (
  currentBlock: number,
): Promise<{ winnerFarms: string[]; auctionHostingEndDate: string }> => {
  const farmAuctionContract = getFarmAuctionContract()
  const currentAuctionId = await farmAuctionContract.read.currentAuctionId()
  const bscClient = publicClient({ chainId: ChainId.BSC })
  const [auctionDateResponse, auctionBiddersResponse] = await bscClient.multicall({
    contracts: [
      {
        address: farmAuctionContract.address,
        abi: farmAuctionABI,
        functionName: 'auctions',
        args: [currentAuctionId],
      },
      {
        address: farmAuctionContract.address,
        abi: farmAuctionABI,
        functionName: 'viewBidsPerAuction',
        args: [currentAuctionId, 0n, 500n],
      },
    ],
    allowFailure: true,
  })
  const auctionData =
    auctionDateResponse.status === 'success'
      ? {
          status: auctionDateResponse.result[0],
          startBlock: auctionDateResponse.result[1],
          endBlock: auctionDateResponse.result[2],
          initialBidAmount: auctionDateResponse.result[3],
          leaderboard: auctionDateResponse.result[4],
          leaderboardThreshold: auctionDateResponse.result[5],
        }
      : null

  const auctionBidders = auctionBiddersResponse.status === 'success' ? auctionBiddersResponse.result[0] : null

  const blocksSinceEnd = currentBlock - Number(auctionData.endBlock)
  if (blocksSinceEnd > 0) {
    const secondsSinceEnd = blocksSinceEnd * BSC_BLOCK_TIME
    if (secondsSinceEnd > FARM_AUCTION_HOSTING_IN_SECONDS) {
      return { winnerFarms: [], auctionHostingEndDate: null }
    }
    const sortedBidders = sortAuctionBidders(auctionBidders)
    const leaderboardThreshold = bigIntToBigNumber(auctionData.leaderboardThreshold)
    const winnerFarms = sortedBidders
      .filter((bidder) => bidder.amount.gt(leaderboardThreshold))
      .map((bidder) => bidder.lpAddress)
    const currentAuctionEndDate = sub(new Date(), { seconds: secondsSinceEnd })
    return {
      winnerFarms,
      auctionHostingEndDate: add(currentAuctionEndDate, {
        seconds: FARM_AUCTION_HOSTING_IN_SECONDS,
      }).toJSON(),
    }
  }

  return { winnerFarms: [], auctionHostingEndDate: null }
}

export default fetchFarmsWithAuctions
