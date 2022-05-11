import { FARM_AUCTION_HOSTING_IN_DAYS } from 'config/constants'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import { getFarmAuctionContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
import { ethersToBigNumber } from 'utils/bigNumber'
import { simpleRpcProvider } from 'utils/providers'
import { BSC_BLOCK_TIME } from 'config'
import { add } from 'date-fns'
import { sortAuctionBidders } from '../../views/FarmAuction/helpers'

const fetchFarmsWithAuctions = async (
  currentBlockNumber: number,
): Promise<{ winnerFarms: string[]; auctionHostingEndDate: string }> => {
  const currentBlock = currentBlockNumber || (await simpleRpcProvider.getBlockNumber())
  const now = Date.now()
  const farmAuctionContract = getFarmAuctionContract()
  const currentAuctionId = await farmAuctionContract.currentAuctionId()
  const [auctionData, [auctionBidders]] = await multicallv2(
    farmAuctionAbi,
    [
      {
        address: farmAuctionContract.address,
        name: 'auctions',
        params: [currentAuctionId],
      },
      {
        address: farmAuctionContract.address,
        name: 'viewBidsPerAuction',
        params: [currentAuctionId, 0, 500],
      },
    ],
    { requireSuccess: false },
  )
  const blocksUntilBlock = auctionData.endBlock.toNumber() - currentBlock
  if (blocksUntilBlock < 0) {
    const secondsUntilStart = blocksUntilBlock * BSC_BLOCK_TIME
    const currentAuctionEndDate = add(new Date(), { seconds: secondsUntilStart })
    if (
      Math.abs(now - add(currentAuctionEndDate, { days: FARM_AUCTION_HOSTING_IN_DAYS }).getTime()) /
        (24 * 3600 * 1000) >
      FARM_AUCTION_HOSTING_IN_DAYS
    ) {
      return { winnerFarms: [], auctionHostingEndDate: null }
    }
    const sortedBidders = sortAuctionBidders(auctionBidders)
    const { leaderboardThreshold } = auctionData
    const winnerFarms = sortedBidders
      .filter((bidder) => bidder.amount.gt(ethersToBigNumber(leaderboardThreshold)))
      .map((bidder) => bidder.lpAddress)
    return {
      winnerFarms,
      auctionHostingEndDate: add(currentAuctionEndDate, {
        days: FARM_AUCTION_HOSTING_IN_DAYS,
      }).toJSON(),
    }
  }

  return { winnerFarms: [], auctionHostingEndDate: null }
}

export default fetchFarmsWithAuctions
