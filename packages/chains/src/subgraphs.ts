import { ChainId } from './chainId'

export const V3_SUBGRAPHS = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-eth',
  [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-goerli',
  [ChainId.BSC]: `https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-bsc`,
  [ChainId.BSC_TESTNET]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-chapel',
  [ChainId.ARBITRUM_ONE]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-v3-arb',
  [ChainId.ARBITRUM_GOERLI]: 'https://api.thegraph.com/subgraphs/name/chef-jojo/exhange-v3-arb-goerli',
  [ChainId.POLYGON_ZKEVM]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-polygon-zkevm/v0.0.0',
  [ChainId.POLYGON_ZKEVM_TESTNET]: null,
  [ChainId.ZKSYNC]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-zksync/version/latest',
  [ChainId.ZKSYNC_TESTNET]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-zksync-testnet/version/latest',
  [ChainId.LINEA]: 'https://graph-query.linea.build/subgraphs/name/pancakeswap/exchange-v3-linea',
  [ChainId.LINEA_TESTNET]:
    'https://thegraph.goerli.zkevm.consensys.net/subgraphs/name/pancakeswap/exchange-v3-linea-goerli',
  [ChainId.BASE]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-base/version/latest',
  [ChainId.BASE_TESTNET]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-base-testnet/version/latest',
  [ChainId.OPBNB]: 'https://opbnb-mainnet-graph.nodereal.io/subgraphs/name/pancakeswap/exchange-v3',
  [ChainId.OPBNB_TESTNET]: null,
  [ChainId.SCROLL_SEPOLIA]: 'https://api.studio.thegraph.com/query/45376/exchange-v3-scroll-sepolia/version/latest',
} satisfies Record<ChainId, string | null>

export const V2_SUBGRAPHS = {
  [ChainId.BSC]: 'https://proxy-worker-api.pancakeswap.com/bsc-exchange',
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/pancakeswap/exhange-eth',
  [ChainId.POLYGON_ZKEVM]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-polygon-zkevm/version/latest',
  [ChainId.ZKSYNC_TESTNET]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-zksync-testnet/version/latest',
  [ChainId.ZKSYNC]: ' https://api.studio.thegraph.com/query/45376/exchange-v2-zksync/version/latest',
  [ChainId.LINEA_TESTNET]: 'https://thegraph.goerli.zkevm.consensys.net/subgraphs/name/pancakeswap/exhange-eth/',
  [ChainId.ARBITRUM_ONE]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-arbitrum/version/latest',
  [ChainId.LINEA]: 'https://graph-query.linea.build/subgraphs/name/pancakeswap/exhange-v2',
  [ChainId.BASE]: 'https://api.studio.thegraph.com/query/45376/exchange-v2-base/version/latest',
  [ChainId.OPBNB]: 'https://opbnb-mainnet-graph.nodereal.io/subgraphs/name/pancakeswap/exchange-v2',
}
