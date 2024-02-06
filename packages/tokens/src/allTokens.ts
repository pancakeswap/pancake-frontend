import { ChainId } from '@pancakeswap/chains'

import { arbitrumTokens } from './constants/arb'
import { arbitrumGoerliTokens } from './constants/arbGoerli'
import { arbSepoliaTokens } from './constants/arbSepolia'
import { baseTokens } from './constants/base'
import { baseSepoliaTokens } from './constants/baseSepolia'
import { baseTestnetTokens } from './constants/baseTestnet'
import { bscTokens } from './constants/bsc'
import { bscTestnetTokens } from './constants/bscTestnet'
import { ethereumTokens } from './constants/eth'
import { goerliTestnetTokens } from './constants/goerli'
import { lineaTokens } from './constants/linea'
import { lineaTestnetTokens } from './constants/lineaTestnet'
import { opBnbTokens } from './constants/opBNB'
import { opBnbTestnetTokens } from './constants/opBnbTestnet'
import { polygonZkEvmTokens } from './constants/polygonZkEVM'
import { polygonZkEvmTestnetTokens } from './constants/polygonZkEVMTestnet'
import { scrollSepoliaTokens } from './constants/scrollSepolia'
import { sepoliaTokens } from './constants/sepolia'
import { zksyncTokens } from './constants/zkSync'
import { zkSyncTestnetTokens } from './constants/zkSyncTestnet'

export const allTokens = {
  [ChainId.GOERLI]: goerliTestnetTokens,
  [ChainId.BSC]: bscTokens,
  [ChainId.BSC_TESTNET]: bscTestnetTokens,
  [ChainId.ETHEREUM]: ethereumTokens,
  [ChainId.ARBITRUM_ONE]: arbitrumTokens,
  [ChainId.POLYGON_ZKEVM]: polygonZkEvmTokens,
  [ChainId.POLYGON_ZKEVM_TESTNET]: polygonZkEvmTestnetTokens,
  [ChainId.ZKSYNC]: zksyncTokens,
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetTokens,
  [ChainId.LINEA_TESTNET]: lineaTestnetTokens,
  [ChainId.LINEA]: lineaTokens,
  [ChainId.ARBITRUM_GOERLI]: arbitrumGoerliTokens,
  [ChainId.OPBNB]: opBnbTokens,
  [ChainId.OPBNB_TESTNET]: opBnbTestnetTokens,
  [ChainId.BASE]: baseTokens,
  [ChainId.BASE_TESTNET]: baseTestnetTokens,
  [ChainId.SCROLL_SEPOLIA]: scrollSepoliaTokens,
  [ChainId.SEPOLIA]: sepoliaTokens,
  [ChainId.ARBITRUM_SEPOLIA]: arbSepoliaTokens,
  [ChainId.BASE_SEPOLIA]: baseSepoliaTokens,
}
