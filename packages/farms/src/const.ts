import { ChainId } from '@pancakeswap/chains'
import uniq from 'lodash/uniq'

// @todo remove all other v2/v3 and type definitions
export const supportedChainIdV4 = [
  ChainId.BSC,
  ChainId.ETHEREUM,
  ChainId.BASE,
  ChainId.OPBNB,
  ChainId.ZKSYNC,
  ChainId.POLYGON_ZKEVM,
  ChainId.LINEA,
  ChainId.ARBITRUM_ONE,
] as const

export const supportedChainIdV2 = [
  ChainId.GOERLI,
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ETHEREUM,
  ChainId.ARBITRUM_ONE,
] as const
export const supportedChainIdV3 = [
  // ChainId.GOERLI,
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ETHEREUM,
  ChainId.ZKSYNC_TESTNET,
  ChainId.POLYGON_ZKEVM_TESTNET,
  ChainId.POLYGON_ZKEVM,
  ChainId.ZKSYNC,
  ChainId.ARBITRUM_ONE,
  ChainId.LINEA,
  ChainId.BASE,
  ChainId.OPBNB,
  ChainId.OPBNB_TESTNET,
] as const
export const supportedChainId = uniq([...supportedChainIdV2, ...supportedChainIdV3])
export const bCakeSupportedChainId = [ChainId.BSC, ChainId.ARBITRUM_ONE, ChainId.ETHEREUM, ChainId.ZKSYNC] as const

export const FARM_AUCTION_HOSTING_IN_SECONDS = 691200

export type FarmSupportedChainId = (typeof supportedChainId)[number]

export type FarmV2SupportedChainId = (typeof supportedChainIdV2)[number]

export type FarmV3SupportedChainId = (typeof supportedChainIdV3)[number]

export type FarmV4SupportedChainId = (typeof supportedChainIdV4)[number]

export const masterChefAddresses = {
  [ChainId.BSC_TESTNET]: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
  [ChainId.BSC]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
} as const

export const masterChefV3Addresses = {
  [ChainId.ETHEREUM]: '0x556B9306565093C855AEA9AE92A594704c2Cd59e',
  // [ChainId.GOERLI]: '0x864ED564875BdDD6F421e226494a0E7c071C06f8',
  [ChainId.BSC]: '0x556B9306565093C855AEA9AE92A594704c2Cd59e',
  [ChainId.BSC_TESTNET]: '0x4c650FB471fe4e0f476fD3437C3411B1122c4e3B',
  [ChainId.ZKSYNC_TESTNET]: '0x3c6Aa61f72932aD5D7C917737367be32D5509e6f',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0xb66b07590B30d4E6E22e45Ddc83B06Bb018A7B44',
  [ChainId.POLYGON_ZKEVM]: '0xE9c7f3196Ab8C09F6616365E8873DaEb207C0391',
  [ChainId.ZKSYNC]: '0x4c615E78c5fCA1Ad31e4d66eb0D8688d84307463',
  [ChainId.ARBITRUM_ONE]: '0x5e09ACf80C0296740eC5d6F643005a4ef8DaA694',
  [ChainId.LINEA]: '0x22E2f236065B780FA33EC8C4E58b99ebc8B55c57',
  [ChainId.BASE]: '0xC6A2Db661D5a5690172d8eB0a7DEA2d3008665A3',
  [ChainId.OPBNB]: '0x05ddEDd07C51739d2aE21F6A9d97a8d69C2C3aaA',
  [ChainId.OPBNB_TESTNET]: '0x236e713bFF45adb30e25D1c29A887aBCb0Ea7E21',
} as const satisfies Record<FarmV3SupportedChainId, string>

export const crossFarmingVaultAddresses = {
  [ChainId.ETHEREUM]: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
  [ChainId.GOERLI]: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
} as const
