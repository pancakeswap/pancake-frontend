import { BLOCKS_SUBGRAPHS, ChainId } from '@pancakeswap/chains'

export const MINIMUM_SEARCH_CHARACTERS = 2

export const WEEKS_IN_YEAR = 52.1429

export const TOTAL_FEE = 0.0025
export const LP_HOLDERS_FEE = 0.0017
export const TREASURY_FEE = 0.000225
export const BUYBACK_FEE = 0.000575

export const PCS_V2_START = 1619136000 // April 23, 2021, 12:00:00 AM
export const PCS_ETH_START = 1664130827 // Sep 23, 2022, 02:33:47 AM
export const ONE_DAY_UNIX = 86400 // 24h * 60m * 60s
export const ONE_HOUR_SECONDS = 3600

export const ITEMS_PER_INFO_TABLE_PAGE = 10

// These tokens are either incorrectly priced or have some other issues that spoil the query data
// None of them present any interest as they have almost 0 daily trade volume

export const BSC_TOKEN_WHITELIST = []
export const TOKEN_BLACKLIST = [
  // These ones are copied from v1 info
  '0x495c7f3A713870F68F8B418B355c085dFDC412C3',
  '0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA',
  '0xe31DEbd7AbFF90B06bCA21010dD860d8701fd901',
  '0xFc989fBB6B3024DE5Ca0144dc23C18A063942Ac1',
  '0xe40fc6FF5f2895B44268fD2E1a421e07F567e007',
  '0xFd158609228B43aA380140B46FfF3cdF9Ad315de',
  '0xc00AF6212fcF0e6fD3143E692Ccd4191Dc308Bea',
  '0x205969b3ad459F7eBA0DEe07231A6357183D3fb6',
  '0x0bD67D358636Fd7B0597724Aa4F20BEEDBf3073A',
  '0xedf5D2A561E8a3Cb5a846FBce24d2cCD88f50075',
  '0x702B0789a3D4daDe1688a0C8b7d944E5BA80fc30',
  '0x041929a760d7049edAeF0dB246FA76EC975E90Cc',
  '0xbA098DF8C6409669f5e6eC971ac02cD5982AC108',
  '0x1BbED115AFe9e8d6e9255F18ef10d43cE6608d94',
  '0xE99512305BF42745fae78003428dCAF662Afb35d',
  '0xbE609EAcbFca10F6E5504D39E3B113F808389056',
  '0x847dAf9dfDC22d5c61C4A857EC8733EF5950e82e',
  '0xDbF8913dfe14536c0dae5dd06805AFb2731f7e7B',
  // These ones are newly found
  '0xF1D50dB2C40b63D2c598e2A808d1871a40b1E653',
  '0x4269e4090FF9dFc99D8846eB0D42E67F01C3AC8b',
]

export const ETH_TOKEN_BLACKLIST = ['0x72B169AD8aF6c4FB53056b6a2A85602Ad6863864']
export const ETH_TOKEN_WHITELIST = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  '0x993864E43Caa7F7F12953AD6fEb1d1Ca635B875F',
]

export type MultiChainName = 'BSC' | 'ETH' | 'POLYGON_ZKEVM' | 'ZKSYNC' | 'ARB' | 'LINEA' | 'BASE' | 'OPBNB'

export type MultiChainNameExtend = MultiChainName | 'BSC_TESTNET' | 'ZKSYNC_TESTNET'

export const multiChainName: Record<number | string, MultiChainNameExtend> = {
  [ChainId.BSC]: 'BSC',
  [ChainId.ETHEREUM]: 'ETH',
  [ChainId.BSC_TESTNET]: 'BSC_TESTNET',
  [ChainId.POLYGON_ZKEVM]: 'POLYGON_ZKEVM',
  [ChainId.ZKSYNC]: 'ZKSYNC',
  [ChainId.LINEA]: 'LINEA',
  [ChainId.BASE]: 'BASE',
  [ChainId.OPBNB]: 'OPBNB',
}

export const BLOCKS_CLIENT = BLOCKS_SUBGRAPHS[ChainId.BSC]
export const BLOCKS_CLIENT_ETH = BLOCKS_SUBGRAPHS[ChainId.ETHEREUM]
export const BLOCKS_CLIENT_POLYGON_ZKEVM = BLOCKS_SUBGRAPHS[ChainId.POLYGON_ZKEVM]
export const BLOCKS_CLIENT_ZKSYNC = BLOCKS_SUBGRAPHS[ChainId.ZKSYNC]
export const BLOCKS_CLIENT_LINEA = BLOCKS_SUBGRAPHS[ChainId.LINEA]
export const BLOCKS_CLIENT_BASE = BLOCKS_SUBGRAPHS[ChainId.BASE]
export const BLOCKS_CLIENT_OPBNB = BLOCKS_SUBGRAPHS[ChainId.OPBNB]

export const multiChainBlocksClient: Record<MultiChainNameExtend, string> = {
  BSC: BLOCKS_CLIENT,
  ETH: BLOCKS_CLIENT_ETH,
  BSC_TESTNET: 'https://api.thegraph.com/subgraphs/name/lengocphuc99/bsc_testnet-blocks',
  POLYGON_ZKEVM: 'https://api.studio.thegraph.com/query/45376/polygon-zkevm-block/version/latest',
  ZKSYNC_TESTNET: 'https://api.studio.thegraph.com/query/45376/blocks-zksync-testnet/version/latest',
  ZKSYNC: BLOCKS_CLIENT_ZKSYNC,
  ARB: 'https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-one-blocks',
  LINEA: BLOCKS_CLIENT_LINEA,
  BASE: BLOCKS_CLIENT_BASE,
  OPBNB: BLOCKS_CLIENT_OPBNB,
}
