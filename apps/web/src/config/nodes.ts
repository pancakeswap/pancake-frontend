import { ChainId } from '@pancakeswap/chains'
import {
  arbitrum,
  polygonZkEvm,
  zkSync,
  zkSyncTestnet,
  polygonZkEvmTestnet,
  arbitrumGoerli,
  baseGoerli,
  scrollSepolia,
  base,
  linea,
  opBNB,
  opBNBTestnet,
} from 'wagmi/chains'
import { getNodeRealUrl } from 'utils/node/nodeReal'
import { getPoktUrl } from 'utils/node/pokt'

const ARBITRUM_NODES = [
  ...arbitrum.rpcUrls.public.http,
  'https://arbitrum-one.publicnode.com',
  'https://arbitrum.llamarpc.com',
  getPoktUrl(ChainId.ARBITRUM_ONE, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
].filter(Boolean)

export const SERVER_NODES = {
  [ChainId.BSC]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
    getPoktUrl(ChainId.BSC, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
    'https://bsc.publicnode.com',
    'https://binance.llamarpc.com',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.binance.org',
  ].filter(Boolean),
  [ChainId.BSC_TESTNET]: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  [ChainId.ETHEREUM]: [
    getNodeRealUrl(ChainId.ETHEREUM, process.env.SERVER_NODE_REAL_API_ETH) || '',
    getPoktUrl(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ],
  [ChainId.GOERLI]: [
    getNodeRealUrl(ChainId.GOERLI, process.env.SERVER_NODE_REAL_API_GOERLI) || '',
    'https://eth-goerli.public.blastapi.io',
  ].filter(Boolean),
  [ChainId.ARBITRUM_ONE]: ARBITRUM_NODES,
  [ChainId.ARBITRUM_GOERLI]: arbitrumGoerli.rpcUrls.public.http,
  [ChainId.POLYGON_ZKEVM]: [
    'https://f2562de09abc5efbd21eefa083ff5326.zkevm-rpc.com/',
    process.env.NEXT_PUBLIC_NODIES_POLYGON_ZKEVM || '',
    ...polygonZkEvm.rpcUrls.public.http,
    getPoktUrl(ChainId.POLYGON_ZKEVM, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
  ].filter(Boolean),
  [ChainId.POLYGON_ZKEVM_TESTNET]: [
    'https://polygon-zkevm-testnet.rpc.thirdweb.com',
    ...polygonZkEvmTestnet.rpcUrls.public.http,
  ],
  [ChainId.ZKSYNC]: [
    ...zkSync.rpcUrls.public.http,
    getNodeRealUrl(ChainId.ZKSYNC, process.env.SERVER_NODE_REAL_API_ETH) || '',
  ],
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnet.rpcUrls.public.http,
  [ChainId.LINEA]: linea.rpcUrls.public.http,
  [ChainId.LINEA_TESTNET]: [
    'https://rpc.goerli.linea.build',
    'https://linea-testnet.rpc.thirdweb.com',
    'https://consensys-zkevm-goerli-prealpha.infura.io/v3/93e8a17747e34ec0ac9a554c1b403965',
  ],
  [ChainId.OPBNB_TESTNET]: opBNBTestnet.rpcUrls.public.http,
  [ChainId.OPBNB]: [
    ...opBNB.rpcUrls.public.http,
    getNodeRealUrl(ChainId.OPBNB, process.env.SERVER_NODE_REAL_API_ETH) || '',
  ],
  [ChainId.BASE]: [
    'https://base.publicnode.com',
    getPoktUrl(ChainId.BASE, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
    // process.env.NEXT_PUBLIC_NODE_REAL_BASE_PRODUCTION,
    ...base.rpcUrls.public.http,
  ],
  [ChainId.BASE_TESTNET]: baseGoerli.rpcUrls.public.http,
  [ChainId.SCROLL_SEPOLIA]: scrollSepolia.rpcUrls.public.http,
} satisfies Record<ChainId, readonly string[]>

export const PUBLIC_NODES = {
  [ChainId.BSC]: [
    process.env.NEXT_PUBLIC_NODE_PRODUCTION || '',
    getNodeRealUrl(ChainId.BSC, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    process.env.NEXT_PUBLIC_NODIES_BSC || '',
    getPoktUrl(ChainId.BSC, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
    'https://bsc.publicnode.com',
    'https://binance.llamarpc.com',
    'https://bsc-dataseed1.defibit.io',
    'https://bsc-dataseed1.binance.org',
  ].filter(Boolean),
  [ChainId.BSC_TESTNET]: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
  [ChainId.ETHEREUM]: [
    getNodeRealUrl(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    process.env.NEXT_PUBLIC_NODIES_ETH || '',
    getPoktUrl(ChainId.ETHEREUM, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
    'https://cloudflare-eth.com',
  ].filter(Boolean),
  [ChainId.GOERLI]: [
    getNodeRealUrl(ChainId.GOERLI, process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI) || '',
    'https://eth-goerli.public.blastapi.io',
  ].filter(Boolean),
  [ChainId.ARBITRUM_ONE]: [
    ...ARBITRUM_NODES,
    process.env.NEXT_PUBLIC_NODIES_ARB || '',
    getNodeRealUrl(ChainId.ARBITRUM_ONE, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
  ].filter(Boolean),
  [ChainId.ARBITRUM_GOERLI]: arbitrumGoerli.rpcUrls.public.http,
  [ChainId.POLYGON_ZKEVM]: [
    process.env.NEXT_PUBLIC_NODIES_POLYGON_ZKEVM || '',
    ...polygonZkEvm.rpcUrls.public.http,
    'https://f2562de09abc5efbd21eefa083ff5326.zkevm-rpc.com/',
    getPoktUrl(ChainId.POLYGON_ZKEVM, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
  ].filter(Boolean),
  [ChainId.POLYGON_ZKEVM_TESTNET]: [
    ...polygonZkEvmTestnet.rpcUrls.public.http,
    'https://polygon-zkevm-testnet.rpc.thirdweb.com',
  ],
  [ChainId.ZKSYNC]: [
    ...zkSync.rpcUrls.public.http,
    getNodeRealUrl(ChainId.ZKSYNC, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
  ],
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnet.rpcUrls.public.http,
  [ChainId.LINEA]: linea.rpcUrls.public.http,
  [ChainId.LINEA_TESTNET]: [
    'https://rpc.goerli.linea.build',
    'https://linea-testnet.rpc.thirdweb.com',
    'https://consensys-zkevm-goerli-prealpha.infura.io/v3/93e8a17747e34ec0ac9a554c1b403965',
  ],
  [ChainId.OPBNB_TESTNET]: opBNBTestnet.rpcUrls.public.http,
  [ChainId.OPBNB]: [
    ...opBNB.rpcUrls.public.http,
    getNodeRealUrl(ChainId.OPBNB, process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) || '',
    'https://opbnb.publicnode.com',
  ],
  [ChainId.BASE]: [
    'https://base.publicnode.com',
    process.env.NEXT_PUBLIC_NODIES_BASE || '',
    getPoktUrl(ChainId.BASE, process.env.NEXT_PUBLIC_POKT_API_KEY) || '',
    // process.env.NEXT_PUBLIC_NODE_REAL_BASE_PRODUCTION,
    ...base.rpcUrls.public.http,
  ].filter(Boolean),
  [ChainId.BASE_TESTNET]: baseGoerli.rpcUrls.public.http,
  [ChainId.SCROLL_SEPOLIA]: scrollSepolia.rpcUrls.public.http,
} satisfies Record<ChainId, readonly string[]>
