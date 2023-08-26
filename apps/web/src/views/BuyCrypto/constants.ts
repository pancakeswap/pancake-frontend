import { ChainId } from '@pancakeswap/sdk'
import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'

export const MOONPAY_UNSUPPORTED_CURRENCY_CODES = ['USDT']
export const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB']
export const whiteListedFiatCurrencies = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']

export const SUPPORTED_MERCURYO_BSC_TOKENS = ['BNB', 'BUSD']
export const SUPPORTED_MERCURYO_ETH_TOKENS = ['ETH', 'USDT', 'DAI']
export const SUPPORTED_MERCURYO_ARBITRUM_TOKENS = ['ETH', 'USDC']

export const SUPPORTED_MONPAY_ETH_TOKENS = ['eth', 'usdc', 'dai', 'usdt']
export const SUPPORTED_MOONPAY_BSC_TOKENS = ['bnb_bsc', 'busd_bsc']
export const SUPPORTED_MOONPAY_ARBITRUM_TOKENS = ['eth_arbitrum', 'usdc_arbitrum']

export const SUPPORTED_TRANSAK_BSC_TOKENS = ['BNB', 'BUSD']
export const SUPPORTED_TRANSAK_ETH_TOKENS = ['ETH', 'USDT', 'DAI']
export const SUPPORTED_TRANSAK_ARBITRUM_TOKENS = ['ETH', 'USDC']
export const SUPPORTED_LINEA_ARBITRUM_TOKENS = ['ETH', 'USDC']
export const SUPPORTED_ZKSYNC_TOKENS = ['ETH', 'USDC']

export const SUPPORTED_MERCURYO_FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']
const MOONPAY_FEE_TYPES = ['Est. Total Fees', 'Networking Fees', 'Provider Fees']
const MERCURYO_FEE_TYPES = ['Est. Total Fees']

export const supportedTokenMap: {
  [chainId: number]: {
    moonPayTokens: string[]
    mercuryoTokens: string[]
    transakTokens: string[]
  }
} = {
  [ChainId.BSC]: {
    moonPayTokens: SUPPORTED_MOONPAY_BSC_TOKENS,
    mercuryoTokens: SUPPORTED_TRANSAK_BSC_TOKENS,
    transakTokens: [],
  },
  [ChainId.ETHEREUM]: {
    moonPayTokens: SUPPORTED_MONPAY_ETH_TOKENS,
    mercuryoTokens: SUPPORTED_TRANSAK_ETH_TOKENS,
    transakTokens: [],
  },
  [ChainId.ARBITRUM_ONE]: {
    moonPayTokens: SUPPORTED_MOONPAY_ARBITRUM_TOKENS,
    mercuryoTokens: SUPPORTED_MERCURYO_ARBITRUM_TOKENS,
    transakTokens: SUPPORTED_TRANSAK_ARBITRUM_TOKENS,
  },
  [ChainId.ZKSYNC]: {
    moonPayTokens: [],
    mercuryoTokens: [],
    transakTokens: SUPPORTED_ZKSYNC_TOKENS,
  },
  // [ChainId.ARBITRUM_ONE]: {
  //   moonPayTokens: SUPPORTED_MOONPAY_ARBITRUM_TOKENS,
  //   mercuryoTokens: SUPPORTED_MERCURYO_ARBITRUM_TOKENS,
  //   transakTokens: []
  // },
  // Add more chainId mappings as needed
}

export const transakNetwork: { [chainId: number]: string } = {
  1: 'ethereum',
  56: 'bsc',
  42161: 'arbitrum',
  324: 'zksync',
}

export function isBuyCryptoSupported(chain: ChainId) {
  return SUPPORT_BUY_CRYPTO.includes(chain)
}

export enum ONRAMP_PROVIDERS {
  MoonPay = 'MoonPay',
  Mercuryo = 'Mercuryo',
  Transak = 'Transak',
}

export const providerFeeTypes: { [provider in ONRAMP_PROVIDERS]: string[] } = {
  [ONRAMP_PROVIDERS.MoonPay]: MOONPAY_FEE_TYPES,
  [ONRAMP_PROVIDERS.Mercuryo]: MERCURYO_FEE_TYPES,
  [ONRAMP_PROVIDERS.Transak]: MOONPAY_FEE_TYPES,
}

export const chainIdToNetwork: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ETHEREUM',
  [ChainId.BSC]: 'BINANCESMARTCHAIN',
  [ChainId.ARBITRUM_ONE]: 'ARBITRUM',
  [ChainId.ZKSYNC]: 'ZKSYNC',
}

export const moonapyCurrencyChainidentifier: { [id: number]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '_bsc',
  [ChainId.ARBITRUM_ONE]: '_arbitrum',
  [ChainId.ZKSYNC]: '_zksync',
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
