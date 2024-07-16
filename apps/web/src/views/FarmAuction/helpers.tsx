import { ChainId } from '@pancakeswap/chains'
import { bigIntToBigNumber } from '@pancakeswap/utils/bigNumber'
import { BSC_BLOCK_TIME, DEFAULT_TOKEN_DECIMAL } from 'config'
import { farmAuctionABI } from 'config/abi/farmAuction'
import { getBidderInfo } from 'config/constants/farmAuctions'
import { Auction, AuctionStatus, Bidder, BidderAuction } from 'config/constants/types'
import dayjs from 'dayjs'
import orderBy from 'lodash/orderBy'
import sample from 'lodash/sample'
import { AuctionsResponse, BidsPerAuction, FarmAuctionContractStatus } from 'utils/types'
import { publicClient } from 'utils/wagmi'
import { AbiStateMutability, ContractFunctionReturnType, createPublicClient, http } from 'viem'
import { PUBLIC_NODES } from 'config/nodes'
import { CHAINS } from 'config/chains'
import { CLIENT_CONFIG } from 'utils/viem'

export const FORM_ADDRESS =
  'https://docs.google.com/forms/d/e/1FAIpQLSfQNsAfh98SAfcqJKR3is2hdvMRdnvfd2F3Hql96vXHgIi3Bw/viewform'

// Sorts bidders received from smart contract by bid amount in descending order (biggest -> smallest)
// Also amends bidder information with getBidderInfo
// auction is required if data will be used for table display, hence in reclaim and congratulations card its omitted
export const sortAuctionBidders = (bidders: readonly BidsPerAuction[], auction?: Auction): Bidder[] => {
  const sortedBidders = orderBy(bidders, (bidder) => Number(bidder.amount), 'desc').map((bidder, index) => {
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
    const amount = bigIntToBigNumber(bidder.amount)
    const samePositionAsAbove = index === 0 ? false : bidder.amount === unadjustedBidders[index - 1].amount
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

const getDateForBlock = async (chainId: ChainId, currentBlock: number, block: number) => {
  // if block already happened we can get timestamp via .getBlock(block)
  if (currentBlock > block) {
    try {
      const { timestamp } = await publicClient({ chainId }).getBlock({ blockNumber: BigInt(block) })
      return dayjs.unix(Number(timestamp)).toDate()
    } catch (error) {
      // BSC Prod default public node won't return data for old blocks
      if (chainId === ChainId.BSC) {
        const randomNode = sample(
          PUBLIC_NODES[chainId].filter((node) => node !== process.env.NEXT_PUBLIC_NODE_PRODUCTION),
        )
        const chain = CHAINS.find((c) => c.id === chainId)
        const publicFallbackClient = createPublicClient({ chain, transport: http(randomNode), ...CLIENT_CONFIG })
        const { timestamp } = await publicFallbackClient.getBlock({ blockNumber: BigInt(block) })
        return dayjs.unix(Number(timestamp)).toDate()
      }
      throw error
    } finally {
      // Use logic below
    }
  }
  const blocksUntilBlock = block - currentBlock
  const secondsUntilStart = blocksUntilBlock * BSC_BLOCK_TIME
  return dayjs().add(secondsUntilStart, 'seconds').toDate()
}

// Get additional auction information based on the date received from smart contract
export const processAuctionData = async (
  auctionId: number,
  chainId: ChainId,
  auctionResponse: AuctionsResponse,
  currentBlockNumber?: number,
): Promise<Auction> => {
  const processedAuctionData = {
    ...auctionResponse,
    topLeaderboard: Number(auctionResponse.leaderboard),
    initialBidAmount: bigIntToBigNumber(auctionResponse.initialBidAmount).div(DEFAULT_TOKEN_DECIMAL).toNumber(),
    leaderboardThreshold: bigIntToBigNumber(auctionResponse.leaderboardThreshold),
    startBlock: Number(auctionResponse.startBlock),
    endBlock: Number(auctionResponse.endBlock),
  }

  // Get all required data and blocks
  const currentBlock = currentBlockNumber || Number(await publicClient({ chainId }).getBlockNumber())
  const [startDate, endDate] = await Promise.all([
    getDateForBlock(chainId, currentBlock, processedAuctionData.startBlock),
    getDateForBlock(chainId, currentBlock, processedAuctionData.endBlock),
  ])

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
    auctionDuration: dayjs(endDate).diff(dayjs(startDate), 'hours'),
    ...processedAuctionData,
    status: auctionStatus,
  }
}

export const processBidderAuctions = (
  bidderAuctions: ContractFunctionReturnType<typeof farmAuctionABI, AbiStateMutability, 'viewBidderAuctions'>,
): { auctions: BidderAuction[]; nextCursor: number } => {
  const [auctionIds, bids, claimed, nextCursor] = bidderAuctions
  const auctions = auctionIds.map((auctionId, index) => ({
    id: Number(auctionId),
    amount: bigIntToBigNumber(bids[index]),
    claimed: claimed[index],
  }))
  return { auctions, nextCursor: Number(nextCursor) }
}
