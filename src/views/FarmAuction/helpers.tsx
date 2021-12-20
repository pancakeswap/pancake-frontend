import { toDate, add, differenceInHours } from 'date-fns'
import { BSC_BLOCK_TIME, DEFAULT_TOKEN_DECIMAL } from 'config'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { simpleRpcProvider } from 'utils/providers'
import { AuctionsResponse, FarmAuctionContractStatus, BidsPerAuction } from 'utils/types'
import { Auction, AuctionStatus, Bidder, BidderAuction } from 'config/constants/types'
import { ethersToBigNumber } from 'utils/bigNumber'
import { FarmAuction } from 'config/abi/types'

export const FORM_ADDRESS =
  'https://docs.google.com/forms/d/e/1FAIpQLScUkwbsMWwg7L5jjGjEcmv6RsoCNhFDkV3xEpRu2KcJrr47Sw/viewform'

// Sorts bidders received from smart contract by bid amount in descending order (biggest -> smallest)
// Also amends bidder information with getBidderInfo
// auction is required if data will be used for table display, hence in reclaim and congratulations card its omitted
export const sortAuctionBidders = (bidders: BidsPerAuction[], auction?: Auction): Bidder[] => {
  const sortedBidders = [...bidders]
    .sort((a, b) => {
      if (a.amount.lt(b.amount)) {
        return 1
      }
      if (a.amount.gt(b.amount)) {
        return -1
      }
      return 0
    })
    .map((bidder, index) => {
      const bidderInfo = getBidderInfo(bidder.account)
      return {
        ...bidderInfo,
        position: index + 1,
        account: bidder.account,
        amount: bidder.amount,
      }
    })

  // Positions need to be adjusted in case 2 bidders has the same bid amount
  // adjustedPosition will always increase by 1 in the following block for the first bidder
  let adjustedPosition = 0

  return sortedBidders.map((bidder, index, unadjustedBidders) => {
    const amount = ethersToBigNumber(bidder.amount)
    const samePositionAsAbove = index === 0 ? false : bidder.amount.eq(unadjustedBidders[index - 1].amount)
    adjustedPosition = samePositionAsAbove ? adjustedPosition : adjustedPosition + 1
    // Reclaim and congratulations card don't need auction data or isTopPosition
    // in this case it is set to false just to avoid TS errors
    let isTopPosition = auction ? index + 1 <= auction.topLeaderboard : false
    // This is here in case we closed auction with less/more winners for some reason
    if (auction && auction.leaderboardThreshold.gt(0)) {
      isTopPosition = auction.leaderboardThreshold.lte(amount)
    }
    return {
      ...bidder,
      position: adjustedPosition,
      isTopPosition,
      samePositionAsAbove,
      amount,
    }
  })
}

// Determine if the auction is:
// - Live and biddable
// - Has been scheduled for specific future date
// - Not announced yet
// - Recently Finished/Closed
const getAuctionStatus = (
  currentBlock: number,
  startBlock: number,
  endBlock: number,
  contractStatus: FarmAuctionContractStatus,
) => {
  if (contractStatus === FarmAuctionContractStatus.Pending && !startBlock && !endBlock) {
    return AuctionStatus.ToBeAnnounced
  }
  if (contractStatus === FarmAuctionContractStatus.Close) {
    return AuctionStatus.Closed
  }
  if (currentBlock >= endBlock) {
    return AuctionStatus.Finished
  }
  if (contractStatus === FarmAuctionContractStatus.Open && currentBlock < startBlock) {
    return AuctionStatus.Pending
  }
  if (contractStatus === FarmAuctionContractStatus.Open && currentBlock > startBlock) {
    return AuctionStatus.Open
  }
  return AuctionStatus.ToBeAnnounced
}

const getDateForBlock = async (currentBlock: number, block: number) => {
  const blocksUntilBlock = block - currentBlock
  const secondsUntilStart = blocksUntilBlock * BSC_BLOCK_TIME
  // if block already happened we can get timestamp via .getBlock(block)
  if (currentBlock > block) {
    try {
      const { timestamp } = await simpleRpcProvider.getBlock(block)
      return toDate(timestamp * 1000)
    } catch {
      add(new Date(), { seconds: secondsUntilStart })
    }
  }
  return add(new Date(), { seconds: secondsUntilStart })
}

// Get additional auction information based on the date received from smart contract
export const processAuctionData = async (auctionId: number, auctionResponse: AuctionsResponse): Promise<Auction> => {
  const processedAuctionData = {
    ...auctionResponse,
    topLeaderboard: auctionResponse.leaderboard.toNumber(),
    initialBidAmount: ethersToBigNumber(auctionResponse.initialBidAmount).div(DEFAULT_TOKEN_DECIMAL).toNumber(),
    leaderboardThreshold: ethersToBigNumber(auctionResponse.leaderboardThreshold),
    startBlock: auctionResponse.startBlock.toNumber(),
    endBlock: auctionResponse.endBlock.toNumber(),
  }

  // Get all required data and blocks
  const currentBlock = await simpleRpcProvider.getBlockNumber()
  const startDate = await getDateForBlock(currentBlock, processedAuctionData.startBlock)
  const endDate = await getDateForBlock(currentBlock, processedAuctionData.endBlock)

  const auctionStatus = getAuctionStatus(
    currentBlock,
    processedAuctionData.startBlock,
    processedAuctionData.endBlock,
    processedAuctionData.status,
  )

  return {
    id: auctionId,
    startDate,
    endDate,
    auctionDuration: differenceInHours(endDate, startDate),
    ...processedAuctionData,
    status: auctionStatus,
  }
}

export const processBidderAuctions = (
  bidderAuctions: Awaited<ReturnType<FarmAuction['viewBidderAuctions']>>,
): { auctions: BidderAuction[]; nextCursor: number } => {
  const [auctionIds, bids, claimed, nextCursor] = bidderAuctions
  const auctions = auctionIds.map((auctionId, index) => ({
    id: auctionId.toNumber(),
    amount: ethersToBigNumber(bids[index]),
    claimed: claimed[index],
  }))
  return { auctions, nextCursor: nextCursor.toNumber() }
}
