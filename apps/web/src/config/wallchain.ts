import { bscTokens } from '@pancakeswap/tokens'

export const WallchainKeys = {
  bsc: process.env.NEXT_PUBLIC_WALLCHAIN_BSC_KEY,
}

export const WallchainPairs = [bscTokens.ltc, bscTokens.wbnb]
