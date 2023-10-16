import { ChainId } from './chainId'

export const chainNames: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TESTNET]: 'bscTestnet',
  [ChainId.ARBITRUM_ONE]: 'arb',
  [ChainId.ARBITRUM_GOERLI]: 'arbGoerli',
  [ChainId.POLYGON_ZKEVM]: 'polygonZkEVM',
  [ChainId.POLYGON_ZKEVM_TESTNET]: 'polygonZkEVMTestnet',
  [ChainId.ZKSYNC]: 'zkSync',
  [ChainId.ZKSYNC_TESTNET]: 'zkSyncTestnet',
  [ChainId.LINEA]: 'linea',
  [ChainId.LINEA_TESTNET]: 'lineaTestnet',
  [ChainId.OPBNB]: 'opBNB',
  [ChainId.OPBNB_TESTNET]: 'opBnbTestnet',
  [ChainId.BASE]: 'base',
  [ChainId.BASE_TESTNET]: 'baseTestnet',
  [ChainId.SCROLL_SEPOLIA]: 'scrollSepolia',
}

export function getChainName(chainId: ChainId) {
  return chainNames[chainId]
}
