import getLpAddress from 'utils/getLpAddress'
import { bscTestnetTokens, bscTokens } from '@pancakeswap/tokens'
import { FarmAuctionBidderConfig } from './types'

export const whitelistedBidders: FarmAuctionBidderConfig[] = [
  // Those farms changed their project wallet address.
  {
    account: '0x83d8EeeB8B70c09112080faCBA7639262Eaba376', // Auction #19
    farmName: 'WOPT-WIDE',
    tokenAddress: '0x0553425F55e9993a857D72eB65E90d4fC5a44e63',
    quoteToken: bscTestnetTokens.wide,
    tokenName: 'WOPT',
    projectSite: 'https://happyfans.club/',
  },
].map((bidderConfig) => ({
  ...bidderConfig,
  lpAddress: getLpAddress(bidderConfig.tokenAddress, bidderConfig.quoteToken),
}))

const UNKNOWN_BIDDER: FarmAuctionBidderConfig = {
  account: '',
  tokenAddress: '',
  quoteToken: bscTokens.wide,
  farmName: 'Unknown',
  tokenName: 'Unknown',
}

export const getBidderInfo = (account: string): FarmAuctionBidderConfig => {
  const matchingBidder = whitelistedBidders.find((bidder) => bidder.account.toLowerCase() === account.toLowerCase())
  if (matchingBidder) {
    return matchingBidder
  }
  return { ...UNKNOWN_BIDDER, account }
}
