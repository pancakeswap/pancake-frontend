import { ContextData, TranslationKey } from '@pancakeswap/localization'
import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'
import { ChainId } from '@pancakeswap/chains'

export const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB']
export const DEFAULT_FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']
export const WHITELISTED_FIAT_CURRENCIES_BASE = ['EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'JPY', 'KRW', 'VND']
export const WHITELISTED_FIAT_CURRENCIES_LINEA = ['EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'JPY', 'KRW', 'VND']

const MOONPAY_FEE_TYPES = ['Est. Total Fees', 'Networking Fees', 'Provider Fees']
const MERCURYO_FEE_TYPES = ['Est. Total Fees']

const SUPPORTED_MERCURYO_BSC_TOKENS = ['BNB', 'BUSD']
const SUPPORTED_MERCURYO_ETH_TOKENS = ['ETH', 'USDT', 'DAI']
const SUPPORTED_MERCURYO_ARBITRUM_TOKENS = ['ETH', 'USDC']

const SUPPORTED_MONPAY_ETH_TOKENS = ['ETH', 'USDC', 'DAI', 'USDT']
const SUPPORTED_MOONPAY_BSC_TOKENS = ['BNB', 'BUSD']
const SUPPORTED_MOONPAY_ARBITRUM_TOKENS = ['ETH', 'USDC']
const SUPPORTED_MOONPAY_ZKSYNC_TOKENS = ['ETH', 'USDC', 'DAI', 'USDT']

const SUPPORTED_TRANSAK_BSC_TOKENS = ['BNB', 'BUSD']
const SUPPORTED_TRANSAK_ETH_TOKENS = ['ETH', 'USDT', 'DAI']
const SUPPORTED_TRANSAK_ARBITRUM_TOKENS = ['ETH', 'USDC']
const SUPPORTED_TRANSAK_LINEA_TOKENS = ['ETH', 'USDC']
const SUPPORTED_TRANSAK_ZKSYNC_TOKENS = ['ETH']
const SUPPORTED_TRANSAK_ZKEVM_TOKENS = ['ETH']
const SUPPORTED_TRANSAK_BASE_TOKENS = ['ETH', 'USDC']

export const CURRENT_CAMPAIGN_TIMESTAMP = 1694512859

export enum ONRAMP_PROVIDERS {
  MoonPay = 'MoonPay',
  Mercuryo = 'Mercuryo',
  Transak = 'Transak',
}

export const supportedTokenMap: {
  [chainId: number]: {
    [ONRAMP_PROVIDERS.MoonPay]: string[]
    [ONRAMP_PROVIDERS.Mercuryo]: string[]
    [ONRAMP_PROVIDERS.Transak]: string[]
  }
} = {
  [ChainId.BSC]: {
    [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MOONPAY_BSC_TOKENS,
    [ONRAMP_PROVIDERS.Mercuryo]: SUPPORTED_MERCURYO_BSC_TOKENS,
    [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_BSC_TOKENS,
  },
  [ChainId.ETHEREUM]: {
    [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MONPAY_ETH_TOKENS,
    [ONRAMP_PROVIDERS.Mercuryo]: SUPPORTED_MERCURYO_ETH_TOKENS,
    [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ETH_TOKENS,
  },
  [ChainId.ARBITRUM_ONE]: {
    [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MOONPAY_ARBITRUM_TOKENS,
    [ONRAMP_PROVIDERS.Mercuryo]: SUPPORTED_MERCURYO_ARBITRUM_TOKENS,
    [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ARBITRUM_TOKENS,
  },
  [ChainId.ZKSYNC]: {
    [ONRAMP_PROVIDERS.MoonPay]: SUPPORTED_MOONPAY_ZKSYNC_TOKENS,
    [ONRAMP_PROVIDERS.Mercuryo]: [],
    [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ZKSYNC_TOKENS,
  },
  [ChainId.LINEA]: {
    [ONRAMP_PROVIDERS.MoonPay]: [],
    [ONRAMP_PROVIDERS.Mercuryo]: [],
    [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_LINEA_TOKENS,
  },
  [ChainId.POLYGON_ZKEVM]: {
    [ONRAMP_PROVIDERS.MoonPay]: [],
    [ONRAMP_PROVIDERS.Mercuryo]: [],
    [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_ZKEVM_TOKENS,
  },
  [ChainId.BASE]: {
    [ONRAMP_PROVIDERS.MoonPay]: [],
    [ONRAMP_PROVIDERS.Mercuryo]: [],
    [ONRAMP_PROVIDERS.Transak]: SUPPORTED_TRANSAK_BASE_TOKENS,
  },
  // Add more chainId mappings as needed
}

export const whiteListedFiatCurrenciesMap: {
  [chainId: number]: string[]
} = {
  [ChainId.BSC]: DEFAULT_FIAT_CURRENCIES,
  [ChainId.ETHEREUM]: DEFAULT_FIAT_CURRENCIES,
  [ChainId.ARBITRUM_ONE]: DEFAULT_FIAT_CURRENCIES,
  [ChainId.ZKSYNC]: DEFAULT_FIAT_CURRENCIES,
  [ChainId.LINEA]: WHITELISTED_FIAT_CURRENCIES_LINEA,
  [ChainId.POLYGON_ZKEVM]: DEFAULT_FIAT_CURRENCIES,
  [ChainId.BASE]: WHITELISTED_FIAT_CURRENCIES_BASE,
}

export function isBuyCryptoSupported(chain: ChainId) {
  return SUPPORT_BUY_CRYPTO.includes(chain)
}

export const providerFeeTypes: { [provider in ONRAMP_PROVIDERS]: string[] } = {
  [ONRAMP_PROVIDERS.MoonPay]: MOONPAY_FEE_TYPES,
  [ONRAMP_PROVIDERS.Mercuryo]: MERCURYO_FEE_TYPES,
  [ONRAMP_PROVIDERS.Transak]: MOONPAY_FEE_TYPES,
}

export const getNetworkDisplay = (chainId: number | undefined): string => {
  switch (chainId as ChainId) {
    case ChainId.ETHEREUM:
      return 'Ethereum'
    case ChainId.BSC:
      return 'BNB Smart Chain'
    case ChainId.ZKSYNC:
      return 'zkSync Era'
    case ChainId.ARBITRUM_ONE:
      return 'Arbitrum One'
    case ChainId.POLYGON_ZKEVM:
      return 'Polygon zkEVM'
    case ChainId.LINEA:
      return 'Linea Mainnet'
    case ChainId.BASE:
      return 'Base Mainnet'
    default:
      return ''
  }
}

export const chainIdToMercuryoNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ETHEREUM',
  [ChainId.BSC]: 'BINANCESMARTCHAIN',
  [ChainId.ARBITRUM_ONE]: 'ARBITRUM',
  [ChainId.ZKSYNC]: 'ZKSYNC',
  [ChainId.POLYGON_ZKEVM]: 'ZKEVM',
  [ChainId.LINEA]: 'LINEA',
  [ChainId.BASE]: 'BASE',
}

export const chainIdToMoonPayNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '_bsc',
  [ChainId.ARBITRUM_ONE]: '_arbitrum',
  [ChainId.ZKSYNC]: '_zksync',
  [ChainId.POLYGON_ZKEVM]: '_polygonzkevm',
  [ChainId.LINEA]: '_linea',
  [ChainId.BASE]: '_base',
}

export const chainIdToTransakNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'bsc',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.LINEA]: 'linea',
  [ChainId.BASE]: 'base',
}

export const combinedNetworkIdMap: {
  [provider in keyof typeof ONRAMP_PROVIDERS]: { [id: number]: string }
} = {
  [ONRAMP_PROVIDERS.MoonPay]: chainIdToMoonPayNetworkId,
  [ONRAMP_PROVIDERS.Mercuryo]: chainIdToMercuryoNetworkId,
  [ONRAMP_PROVIDERS.Transak]: chainIdToTransakNetworkId,
}

export const getChainCurrencyWarningMessages = (
  t: (key: TranslationKey, data?: ContextData) => string,
  chainId: number,
) => {
  const networkDisplay = getNetworkDisplay(chainId)
  return {
    [ChainId.ARBITRUM_ONE]: t(
      'UEDC.e quotes are currently unavailable in USD on Arbitrum. Please select another currency to receive USDC.e quotes',
      { chainId: networkDisplay },
    ),
    [ChainId.LINEA]: t('%chainId% supports limited fiat currencies. USD are not supported', {
      chainId: networkDisplay,
    }),
    [ChainId.BASE]: t('%chainId% supports limited fiat currencies. USD are not supported', {
      chainId: networkDisplay,
    }),
  }
}

export const fiatCurrencyMap: Record<string, { symbol: string; name: string }> = {
  USD: {
    name: 'United States Dollar',
    symbol: 'USD',
  },
  EUR: {
    name: 'Euro',
    symbol: 'EUR',
  },
  GBP: {
    name: 'Great British Pound',
    symbol: 'GBP',
  },
  HKD: {
    name: 'Hong Kong Dollar',
    symbol: 'HKD',
  },
  CAD: {
    name: 'Canadian Dollar',
    symbol: 'CAD',
  },
  AUD: {
    name: 'Australian Dollar',
    symbol: 'AUD',
  },
  BRL: {
    name: 'Brazilian Real',
    symbol: 'BRL',
  },
  JPY: {
    name: 'Japanese Yen',
    symbol: 'JPY',
  },
  KRW: {
    name: 'South Korean Won',
    symbol: 'KRW',
  },
  TWD: {
    name: 'New Taiwan Dollar',
    symbol: 'TWD',
  },
  IDR: {
    name: 'Indonesian Rupiah',
    symbol: 'IDR',
  },
  SGD: {
    name: 'Singapore Dollar',
    symbol: 'SGD',
  },
  VND: {
    name: 'Vietnamese Dong',
    symbol: 'VND',
  },
}
