import { BLOCKS_SUBGRAPHS, ChainId, STABLESWAP_SUBGRAPHS, V2_SUBGRAPHS, V3_SUBGRAPHS } from '@pancakeswap/chains'

export const THE_GRAPH_PROXY_API = 'https://thegraph.pancakeswap.com'

export const GRAPH_API_PROFILE = `${THE_GRAPH_PROXY_API}/profile`

export const GRAPH_API_LOTTERY = `${THE_GRAPH_PROXY_API}/lottery-bsc`
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = 'https://profile.pancakeswap.com'
export const API_NFT = 'https://nft.pancakeswap.com/api/v1'
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const GRAPH_API_POTTERY = `${THE_GRAPH_PROXY_API}/pottery`
// export const ONRAMP_API_BASE_URL = 'https://monkfish-app-s4mda.ondigitalocean.app'
export const ONRAMP_API_BASE_URL = 'https://onramp2-api.pancakeswap.com'
export const TRANSAK_API_BASE_URL = 'https://api-stg.transak.com/api/v1'
export const MOONPAY_BASE_URL = 'https://api.moonpay.com'
export const NOTIFICATION_HUB_BASE_URL = 'https://notification-hub.pancakeswap.com'
/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = `${THE_GRAPH_PROXY_API}/prediction-v1-bsc`

export const V3_BSC_INFO_CLIENT = `https://open-platform.nodereal.io/${
  process.env.NEXT_PUBLIC_NODE_REAL_API_INFO || process.env.NEXT_PUBLIC_NODE_REAL_API_ETH
}/pancakeswap-v3/graphql`

const BLOCKS_SUBGRAPH_URLS = {
  ...BLOCKS_SUBGRAPHS,
  [ChainId.OPBNB]: `${THE_GRAPH_PROXY_API}/blocks-opbnb`,
}

export const GRAPH_API_NFTMARKET = `${THE_GRAPH_PROXY_API}/nft-marketplace-bsc`
export const GRAPH_HEALTH = 'https://api.thegraph.com/index-node/graphql'

export const TC_MOBOX_SUBGRAPH = `${THE_GRAPH_PROXY_API}/trading-competition-v3`
export const TC_MOD_SUBGRAPH = `${THE_GRAPH_PROXY_API}/trading-competition-v4`

export const BIT_QUERY = 'https://graphql.bitquery.io'

export const ACCESS_RISK_API = 'https://red.alert.pancakeswap.com/red-api'

export const CELER_API = 'https://api.celerscan.com/scan'

export const V2_SUBGRAPH_URLS = {
  ...V2_SUBGRAPHS,
  [ChainId.POLYGON_ZKEVM]: `${THE_GRAPH_PROXY_API}/exchange-v2-polygon-zkevm`,
  [ChainId.BASE]: `${THE_GRAPH_PROXY_API}/exchange-v2-base`,
  [ChainId.ETHEREUM]: `${THE_GRAPH_PROXY_API}/exchange-v2-eth`,
  [ChainId.BSC]: `${THE_GRAPH_PROXY_API}/exchange-v2-bsc`,
  [ChainId.ARBITRUM_ONE]: `${THE_GRAPH_PROXY_API}/exchange-v2-arb`,
  [ChainId.ZKSYNC]: `${THE_GRAPH_PROXY_API}/exchange-v2-zksync`,
  [ChainId.LINEA]: `${THE_GRAPH_PROXY_API}/exchange-v2-linea`,
  [ChainId.OPBNB]: `${THE_GRAPH_PROXY_API}/exchange-v2-opbnb`,
}
export const INFO_CLIENT_ETH = V2_SUBGRAPH_URLS[ChainId.ETHEREUM]

export const BLOCKS_CLIENT_WITH_CHAIN = BLOCKS_SUBGRAPH_URLS

export const ASSET_CDN = 'https://assets.pancakeswap.finance'

export const V3_SUBGRAPH_URLS = {
  ...V3_SUBGRAPHS,
  [ChainId.POLYGON_ZKEVM]: `${THE_GRAPH_PROXY_API}/exchange-v3-polygon-zkevm`,
  [ChainId.BASE]: `${THE_GRAPH_PROXY_API}/exchange-v3-base`,
  [ChainId.ETHEREUM]: `${THE_GRAPH_PROXY_API}/exchange-v3-eth`,
  [ChainId.BSC]: `${THE_GRAPH_PROXY_API}/exchange-v3-bsc`,
  [ChainId.ARBITRUM_ONE]: `${THE_GRAPH_PROXY_API}/exchange-v3-arb`,
  [ChainId.ZKSYNC]: `${THE_GRAPH_PROXY_API}/exchange-v3-zksync`,
  [ChainId.LINEA]: `${THE_GRAPH_PROXY_API}/exchange-v3-linea`,
  [ChainId.OPBNB]: `${THE_GRAPH_PROXY_API}/exchange-v3-opbnb`,
}

export const STABLESWAP_SUBGRAPHS_URLS = {
  ...STABLESWAP_SUBGRAPHS,
  [ChainId.BSC]: `${THE_GRAPH_PROXY_API}/exchange-stableswap-bsc`,
  [ChainId.ARBITRUM_ONE]: `${THE_GRAPH_PROXY_API}/exchange-stableswap-arb`,
  [ChainId.ETHEREUM]: `${THE_GRAPH_PROXY_API}/exchange-stableswap-eth`,
}

export const TRADING_REWARD_API = 'https://trading-reward.pancakeswap.com/api/v1'

export const X_API_ENDPOINT = process.env.NEXT_PUBLIC_QUOTING_API

export const QUOTING_API_PREFIX = `${X_API_ENDPOINT}/order-price`

export const QUOTING_API = `${QUOTING_API_PREFIX}/get-price`

export const FARMS_API = 'https://farms-api.pancakeswap.com'

export const MERCURYO_WIDGET_ID = process.env.NEXT_PUBLIC_MERCURYO_WIDGET_ID || '64d1f9f9-85ee-4558-8168-1dc0e7057ce6'

export const MOONPAY_API_KEY = process.env.NEXT_PUBLIC_MOONPAY_LIVE_KEY || 'pk_test_1Ibe44lMglFVL8COOYO7SEKnIBrzrp54'

export const TRANSAK_API_KEY = process.env.NEXT_PUBLIC_TRANSAK_LIVE_KEY || 'bf960e79-6d98-4fd0-823d-8409d290c346'

export const WALLET_API = 'https://wallet-api.pancakeswap.com'

export const BINANCE_DATA_API = 'https://data-api.binance.vision/api'

export const PREDICTION_PRICE_API = '/api/prediction/price'
