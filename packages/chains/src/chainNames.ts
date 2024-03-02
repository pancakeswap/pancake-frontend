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
  [ChainId.SEPOLIA]: 'sepolia',
  [ChainId.ARBITRUM_SEPOLIA]: 'arbSepolia',
  [ChainId.BASE_SEPOLIA]: 'baseSepolia',
}

export const ChainNamesExtended: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: 'Ethereum',
  [ChainId.GOERLI]: 'Goerli',
  [ChainId.BSC]: 'Binance Smart Chain',
  [ChainId.BSC_TESTNET]: 'Binance Smart Chain Testnet',
  [ChainId.ZKSYNC_TESTNET]: 'ZkSync Testnet',
  [ChainId.ZKSYNC]: 'ZkSync',
  [ChainId.OPBNB_TESTNET]: 'OPBNB Testnet',
  [ChainId.OPBNB]: 'OPBNB',
  [ChainId.POLYGON_ZKEVM]: 'Polygon ZkEVM',
  [ChainId.POLYGON_ZKEVM_TESTNET]: 'Polygon ZkEVM Testnet',
  [ChainId.ARBITRUM_ONE]: 'Arbitrum One',
  [ChainId.ARBITRUM_GOERLI]: 'Arbitrum Goerli',
  [ChainId.ARBITRUM_SEPOLIA]: 'Arbitrum Sepolia',
  [ChainId.SCROLL_SEPOLIA]: 'Scroll Sepolia',
  [ChainId.LINEA]: 'Linea',
  [ChainId.LINEA_TESTNET]: 'Linea Testnet',
  [ChainId.BASE]: 'Base',
  [ChainId.BASE_TESTNET]: 'Base Testnet',
  [ChainId.BASE_SEPOLIA]: 'Base Sepolia',
  [ChainId.SEPOLIA]: 'Sepolia',
}

export const chainNameToChainId = Object.entries(chainNames).reduce((acc, [chainId, chainName]) => {
  return {
    [chainName]: chainId as unknown as ChainId,
    ...acc,
  }
}, {} as Record<string, ChainId>)

// @see https://github.com/DefiLlama/defillama-server/blob/master/common/chainToCoingeckoId.ts
// @see https://github.com/DefiLlama/chainlist/blob/main/constants/chainIds.json
export const defiLlamaChainNames: Record<ChainId, string> = {
  [ChainId.BSC]: 'bsc',
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.GOERLI]: '',
  [ChainId.BSC_TESTNET]: '',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ARBITRUM_GOERLI]: '',
  [ChainId.POLYGON_ZKEVM]: 'polygon_zkevm',
  [ChainId.POLYGON_ZKEVM_TESTNET]: '',
  [ChainId.ZKSYNC]: 'era',
  [ChainId.ZKSYNC_TESTNET]: '',
  [ChainId.LINEA_TESTNET]: '',
  [ChainId.BASE_TESTNET]: '',
  [ChainId.OPBNB]: 'op_bnb',
  [ChainId.OPBNB_TESTNET]: '',
  [ChainId.SCROLL_SEPOLIA]: '',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
  [ChainId.SEPOLIA]: '',
  [ChainId.ARBITRUM_SEPOLIA]: '',
  [ChainId.BASE_SEPOLIA]: '',
}
