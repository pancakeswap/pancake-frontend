import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608

export const MSG_SENDER = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS = '0x0000000000000000000000000000000000000002'

export const MIXED_ROUTE_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86',
  [ChainId.GOERLI]: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  [ChainId.BSC]: '0x678Aa4bF4E210cf2166753e054d5b7c31cc7fa86',
  [ChainId.BSC_TESTNET]: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  // TODO: new chains
  [ChainId.ARBITRUM_ONE]: '0x',
  [ChainId.ARBITRUM_GOERLI]: '0x5bE6a8c433d932822ad1cbf241d2Cc0D577348eD',
  [ChainId.POLYGON_ZKEVM]: '0x',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0x9CFCdecF9e37Bf25023A2B42537127c1089600fE',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ZKSYNC_TESTNET]: '0x5d2D9b1B04735DFECF48E6be1A7F391e7071DDc9',
  [ChainId.LINEA_TESTNET]: '0x7d3ed219e45637Cfa77b1a634d0489a2950d1B7F',
} as const satisfies Record<ChainId, Address>

export const V3_QUOTER_ADDRESSES = {
  [ChainId.ETHEREUM]: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  [ChainId.GOERLI]: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
  [ChainId.BSC]: '0xB048Bbc1Ee6b733FFfCFb9e9CeF7375518e25997',
  [ChainId.BSC_TESTNET]: '0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2',
  // TODO: new chains
  [ChainId.ARBITRUM_ONE]: '0x',
  [ChainId.ARBITRUM_GOERLI]: '0x4967B5aDD9425f36Cf9Ba28eA34D6466B0DDf291',
  [ChainId.POLYGON_ZKEVM]: '0x',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '0xFf7D43ACd67DD6fb8735B8E86Cbc0e0060CDdc13',
  [ChainId.ZKSYNC]: '0x',
  [ChainId.ZKSYNC_TESTNET]: '0x42929984eBFC7C3AF4e7dA2e33C9dEe593eB0e4F',
  [ChainId.LINEA_TESTNET]: '0x669254936caE83bE34008BdFdeeA63C902497B31',
} as const satisfies Record<ChainId, Address>
