import { ChainId } from '@pancakeswap/chains'

import { bscTokens } from './constants/bsc'
import { goerliTestnetTokens } from './constants/goerli'
import { bscTestnetTokens } from './constants/bscTestnet'
import { ethereumTokens } from './constants/eth'
import { arbitrumTokens } from './constants/arb'
import { polygonZkEvmTokens } from './constants/polygonZkEVM'
import { polygonZkEvmTestnetTokens } from './constants/polygonZkEVMTestnet'
import { zksyncTokens } from './constants/zkSync'
import { zkSyncTestnetTokens } from './constants/zkSyncTestnet'
import { lineaTestnetTokens } from './constants/lineaTestnet'
import { lineaTokens } from './constants/linea'
import { arbitrumGoerliTokens } from './constants/arbGoerli'
import { opBnbTokens } from './constants/opBNB'
import { opBnbTestnetTokens } from './constants/opBnbTestnet'
import { baseTokens } from './constants/base'
import { baseTestnetTokens } from './constants/baseTestnet'
import { scrollSepoliaTokens } from './constants/scrollSepolia'

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
}
