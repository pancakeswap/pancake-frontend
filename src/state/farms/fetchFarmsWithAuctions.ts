import { FARM_AUCTION_HOSTING_IN_SECONDS } from 'config/constants'
import chunk from 'lodash/chunk'
import farmAuctionAbi from 'config/abi/farmAuction.json'
import { getFarmAuctionContract } from 'utils/contractHelpers'
import { multicallv2 } from 'utils/multicall'
import { ethersToBigNumber } from 'utils/bigNumber'
import { BSC_BLOCK_TIME } from 'config'
import { add, sub } from 'date-fns'
import { sortAuctionBidders } from '../../views/FarmAuction/helpers'

const AUCTIONS_TO_FETCH_FROM_ID = 20 // Starting from this auction we have v2 farms. No need to fetch previous auctions.

const fetchFarmsWithAuctions = async (
  currentBlock: number,
): Promise<{ [lpAddress: string]: { auctionHostingEndDate: string; hostingIsLive: boolean } }> => {
  const farmAuctionContract = getFarmAuctionContract()
  const currentAuctionId = await farmAuctionContract.currentAuctionId()

  const calls = []
  for (let i = AUCTIONS_TO_FETCH_FROM_ID; i <= currentAuctionId.toNumber(); i += 1) {
    calls.push(
      {
        address: farmAuctionContract.address,
        name: 'auctions',
        params: [i],
      },
      {
        address: farmAuctionContract.address,
        name: 'viewBidsPerAuction',
        params: [i, 0, 500],
      },
    )
  }

  const auctionResultsRaw = await multicallv2(farmAuctionAbi, calls, { requireSuccess: false })

  const auctionResultsRawChunked = chunk(auctionResultsRaw, 2)

  const auctionResults = auctionResultsRawChunked.map((auctionResult, index) => {
    if (!auctionResult[0] || !auctionResult[1] || !auctionResult[1][0]) {
      return { auctionId: index + 1, winnerFarms: [], auctionHostingEndDate: null, hostingIsLive: false }
    }
    const [auctionData, [auctionBidders]] = auctionResult as any
    const blocksSinceEnd = currentBlock - auctionData.endBlock.toNumber()
    if (blocksSinceEnd > 0) {
      const secondsSinceEnd = blocksSinceEnd * BSC_BLOCK_TIME
      const sortedBidders = sortAuctionBidders(auctionBidders)
      const leaderboardThreshold = ethersToBigNumber(auctionData.leaderboardThreshold)
      const winnerFarms = sortedBidders
        .filter((bidder) => bidder.amount.gt(leaderboardThreshold))
        .map((bidder) => bidder.lpAddress)
      const currentAuctionEndDate = sub(new Date(), { seconds: secondsSinceEnd })
      return {
        auctionId: index + 1,
        winnerFarms,
        auctionHostingEndDate: add(currentAuctionEndDate, {
          seconds: FARM_AUCTION_HOSTING_IN_SECONDS,
        }).toJSON(),
        hostingIsLive: secondsSinceEnd <= FARM_AUCTION_HOSTING_IN_SECONDS,
      }
    }

    return { auctionId: index + 1, winnerFarms: [], auctionHostingEndDate: null, hostingIsLive: false }
  })

  const winnerFarmsResults: { [lpAddress: string]: { auctionHostingEndDate: string; hostingIsLive: boolean } } =
    auctionResults.reduce((acc, auctionResult) => {
      const winnerFarmsResult = auctionResult.winnerFarms.filter(Boolean).reduce((acc2, winnerFarm) => {
        return {
          ...acc2,
          [winnerFarm]: {
            auctionHostingEndDate: auctionResult.auctionHostingEndDate,
            hostingIsLive: auctionResult.hostingIsLive,
          },
        }
      }, {})
      return { ...acc, ...winnerFarmsResult }
    }, {})

  return winnerFarmsResults
}

export default fetchFarmsWithAuctions
