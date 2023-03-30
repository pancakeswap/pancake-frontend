import { ChainId } from '@pancakeswap/sdk'

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608

export const MSG_SENDER = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS = '0x0000000000000000000000000000000000000002'

// TODO quoter for bsc and bsc testnet
// TODO: v3 contract addresses MixedRouteQuoterV1
export const MIXED_ROUTE_QUOTER_ADDRESSES = {
  [ChainId.GOERLI]: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  [ChainId.ETHEREUM]: '0x84E44095eeBfEC7793Cd7d5b57B7e401D7f1cA2E',
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
}

// TODO quoter for bsc and bsc testnet
// TODO: v3 contract addresses QuoterV2
export const V3_QUOTER_ADDRESSES = {
  [ChainId.GOERLI]: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
  [ChainId.ETHEREUM]: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
}
