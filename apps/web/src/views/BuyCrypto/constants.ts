import { ChainId } from '@pancakeswap/sdk'
import { SUPPORT_BUY_CRYPTO } from 'config/constants/supportChains'

export const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB']
export const whiteListedFiatCurrencies = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']

const MOONPAY_FEE_TYPES = ['Est. Total Fees', 'Networking Fees', 'Provider Fees']
const MERCURYO_FEE_TYPES = ['Est. Total Fees']

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

export const chainIdToMercuryoNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ETHEREUM',
  [ChainId.BSC]: 'BINANCESMARTCHAIN',
  [ChainId.ARBITRUM_ONE]: 'ARBITRUM',
  [ChainId.ZKSYNC]: 'ZKSYNC',
  [ChainId.POLYGON_ZKEVM]: 'ZKEVM',
  [ChainId.LINEA]: 'LINEA',
}

export const chainIdToMoonPayNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.BSC]: '_bsc',
  [ChainId.ARBITRUM_ONE]: '_arbitrum',
  [ChainId.ZKSYNC]: '_zksync',
  [ChainId.POLYGON_ZKEVM]: '_polygonzkevm',
  [ChainId.LINEA]: '_linea',
}

export const chainIdToTransakNetworkId: { [id: number]: string } = {
  [ChainId.ETHEREUM]: 'ethereum',
  [ChainId.BSC]: 'bsc',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ZKSYNC]: 'zksync',
  [ChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [ChainId.LINEA]: 'linea',
}

export const combinedNetworkIdMap: {
  [provider in keyof typeof ONRAMP_PROVIDERS]: { [id: number]: string }
} = {
  [ONRAMP_PROVIDERS.MoonPay]: chainIdToMoonPayNetworkId,
  [ONRAMP_PROVIDERS.Mercuryo]: chainIdToMercuryoNetworkId,
  [ONRAMP_PROVIDERS.Transak]: chainIdToTransakNetworkId,
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
