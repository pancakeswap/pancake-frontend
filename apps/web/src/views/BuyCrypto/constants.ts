import { ChainId } from '@pancakeswap/sdk'

export const SUPPORTED_CHAINS = [ChainId.ETHEREUM, ChainId.BSC, ChainId.ZKSYNC, ChainId.ARBITRUM_ONE]
export const MOONPAY_UNSUPPORTED_CURRENCY_CODES = ['USDT']
export const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB']
export const whiteListedFiatCurrencies = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']
export const SUPPORTED_MERCURYO_BSC_TOKENS = ['BNB', 'BUSD']
export const SUPPORTED_MERCURYO_ETH_TOKENS = ['ETH', 'USDT', 'DAI']
export const SUPPORTED_MERCURYO_ZKSYNC_TOKENS = []
export const SUPPORTED_MERCURYO_ARBITRUM_TOKENS = ['ETH', 'USDC']

export const SUPPORTED_MONPAY_ETH_TOKENS = ['eth', 'usdc', 'dai', 'usdt']
export const SUPPORTED_MOONPAY_BSC_TOKENS = ['bnb_bsc', 'busd_bsc']
export const SUPPORTED_MOONPAY_ZKSYNC_TOKENS = ['eth_zksync', 'usdc_zksync', 'dai_zksync', 'usdt_zksync']
export const SUPPORTED_MOONPAY_ARBITRUM_TOKENS = ['eth_arbitrum', 'usdc_arbitrum']

export const SUPPORTED_MERCURYO_FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']
const MOONPAY_FEE_TYPES = ['Total Fees', 'Networking Fees', 'Provider Fees']
const MERCURYO_FEE_TYPES = ['Total Fees']

export const supportedTokenMap: {
  [chainId: number]: {
    moonPayTokens: string[]
    mercuryoTokens: string[]
  }
} = {
  [ChainId.BSC]: {
    moonPayTokens: SUPPORTED_MOONPAY_BSC_TOKENS,
    mercuryoTokens: SUPPORTED_MERCURYO_BSC_TOKENS,
  },
  [ChainId.ETHEREUM]: {
    moonPayTokens: SUPPORTED_MONPAY_ETH_TOKENS,
    mercuryoTokens: SUPPORTED_MERCURYO_ETH_TOKENS,
  },
  [ChainId.ZKSYNC]: {
    moonPayTokens: SUPPORTED_MOONPAY_ZKSYNC_TOKENS,
    mercuryoTokens: SUPPORTED_MERCURYO_ZKSYNC_TOKENS,
  },
  [ChainId.ARBITRUM_ONE]: {
    moonPayTokens: SUPPORTED_MOONPAY_ARBITRUM_TOKENS,
    mercuryoTokens: SUPPORTED_MERCURYO_ARBITRUM_TOKENS,
  },
  // Add more chainId mappings as needed
}

export function isBuyCryptoSupported(chain: ChainId) {
  return SUPPORTED_CHAINS.includes(chain)
}

export enum ONRAMP_PROVIDERS {
  MoonPay = 'MoonPay',
  Mercuryo = 'Mercuryo',
}

export const providerFeeTypes: { [provider in ONRAMP_PROVIDERS]: string[] } = {
  [ONRAMP_PROVIDERS.MoonPay]: MOONPAY_FEE_TYPES,
  [ONRAMP_PROVIDERS.Mercuryo]: MERCURYO_FEE_TYPES,
}

export const chainIdToNetwork: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ETHEREUM',
  [ChainId.BSC]: 'BINANCESMARTCHAIN',
  [ChainId.ZKSYNC]: 'ZKSYNC',
  [ChainId.ARBITRUM_ONE]: 'ARBITRUM',
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
