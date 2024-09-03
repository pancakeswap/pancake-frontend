import { Native } from '@pancakeswap/sdk'
import type { Currency } from '@pancakeswap/swap-sdk-core'
import { arbitrumTokens, baseTokens, bscTokens, ethereumTokens, lineaTokens } from '@pancakeswap/tokens'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Field } from 'state/buyCrypto/actions'
import { OnRampUnit } from './types'
import { NativeBtc } from './utils/NativeBtc'

export const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB', 'WBTC']
export const DEFAULT_FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']
export const ABOUT_EQUAL = '≈'

export enum OnRampChainId {
  ETHEREUM = 1,
  GOERLI = 5,
  BSC = 56,
  BSC_TESTNET = 97,
  ZKSYNC_TESTNET = 280,
  ZKSYNC = 324,
  OPBNB_TESTNET = 5611,
  OPBNB = 204,
  POLYGON_ZKEVM = 1101,
  POLYGON_ZKEVM_TESTNET = 1442,
  ARBITRUM_ONE = 42161,
  ARBITRUM_GOERLI = 421613,
  ARBITRUM_SEPOLIA = 421614,
  SCROLL_SEPOLIA = 534351,
  LINEA = 59144,
  LINEA_TESTNET = 59140,
  BASE = 8453,
  BASE_TESTNET = 84531,
  BASE_SEPOLIA = 84532,
  SEPOLIA = 11155111,
  BTC = 0,
}
export enum ONRAMP_PROVIDERS {
  MoonPay = 'MoonPay',
  Mercuryo = 'Mercuryo',
  Transak = 'Transak',
  Topper = 'Topper',
}

export enum FeeTypes {
  NetworkingFees = 'Networking Fees',
  ProviderFees = 'Provider Fees',
  PancakeFees = 'Pancake Fees',
}

export enum WidgetTheme {
  Dark = 'dark',
  Light = 'light',
}
const DEFAULT_FEE_TYPES = [FeeTypes.NetworkingFees, FeeTypes.ProviderFees, FeeTypes.PancakeFees]
const MERCURYO_FEE_TYPES = [FeeTypes.ProviderFees, FeeTypes.PancakeFees]

export const getIsNetworkEnabled = (network: OnRampChainId | undefined) => {
  if (typeof network === 'undefined') return false
  if (typeof network === 'number') return true
  return false
}

export const PROVIDER_ICONS = {
  [ONRAMP_PROVIDERS.MoonPay]: `${ASSET_CDN}/web/onramp/moonpay.svg`,
  [ONRAMP_PROVIDERS.Mercuryo]: `${ASSET_CDN}/web/onramp/mercuryo.svg`,
  [ONRAMP_PROVIDERS.Transak]: `${ASSET_CDN}/web/onramp/transak.svg`,
  [ONRAMP_PROVIDERS.Topper]: `${ASSET_CDN}/web/onramp/topper.png`,
} satisfies Record<keyof typeof ONRAMP_PROVIDERS, string>

export const providerFeeTypes: { [provider in ONRAMP_PROVIDERS]: FeeTypes[] } = {
  [ONRAMP_PROVIDERS.MoonPay]: DEFAULT_FEE_TYPES,
  [ONRAMP_PROVIDERS.Mercuryo]: MERCURYO_FEE_TYPES,
  [ONRAMP_PROVIDERS.Transak]: DEFAULT_FEE_TYPES,
  [ONRAMP_PROVIDERS.Topper]: DEFAULT_FEE_TYPES,
}

export const getNetworkDisplay = (chainId: number | undefined): string => {
  switch (chainId as OnRampChainId) {
    case OnRampChainId.ETHEREUM:
      return 'ethereum'
    case OnRampChainId.BSC:
      return 'binance'
    case OnRampChainId.ZKSYNC:
      return 'zkSync Era'
    case OnRampChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case OnRampChainId.POLYGON_ZKEVM:
      return 'zkEvm'
    case OnRampChainId.LINEA:
      return 'linea'
    case OnRampChainId.BASE:
      return 'base'
    case OnRampChainId.BTC:
      return 'bitcoin'
    default:
      return ''
  }
}

export const getNetworkFullName = (chainId: number | undefined): string => {
  switch (chainId as OnRampChainId) {
    case OnRampChainId.ETHEREUM:
      return 'Ethereum '
    case OnRampChainId.BSC:
      return 'Binance Smart Chain'
    case OnRampChainId.ZKSYNC:
      return 'ZkSync Era'
    case OnRampChainId.ARBITRUM_ONE:
      return 'Arbitrum One'
    case OnRampChainId.POLYGON_ZKEVM:
      return 'Polygon ZkEvm'
    case OnRampChainId.LINEA:
      return 'Linea Mainnet'
    case OnRampChainId.BASE:
      return 'Base Mainnet'
    case OnRampChainId.BTC:
      return 'Bitcoin Network'
    default:
      return ''
  }
}

export const chainIdToMercuryoNetworkId: { [id: number]: string } = {
  [OnRampChainId.ETHEREUM]: 'ETHEREUM',
  [OnRampChainId.BSC]: 'BINANCESMARTCHAIN',
  [OnRampChainId.ARBITRUM_ONE]: 'ARBITRUM',
  [OnRampChainId.ZKSYNC]: 'ZKSYNC',
  [OnRampChainId.POLYGON_ZKEVM]: 'ZKEVM',
  [OnRampChainId.LINEA]: 'LINEA',
  [OnRampChainId.BASE]: 'BASE',
  [OnRampChainId.BTC]: 'BITCOIN',
}

export const chainIdToMoonPayNetworkId: { [id: number]: string } = {
  [OnRampChainId.ETHEREUM]: '',
  [OnRampChainId.BSC]: '_bsc',
  [OnRampChainId.ARBITRUM_ONE]: '_arbitrum',
  [OnRampChainId.ZKSYNC]: '_zksync',
  [OnRampChainId.POLYGON_ZKEVM]: '_polygonzkevm',
  [OnRampChainId.LINEA]: '_linea',
  [OnRampChainId.BASE]: '_base',
  [OnRampChainId.BTC]: '',
}

export const chainIdToTransakNetworkId: { [id: number]: string } = {
  [OnRampChainId.ETHEREUM]: 'ethereum',
  [OnRampChainId.BSC]: 'bsc',
  [OnRampChainId.ARBITRUM_ONE]: 'arbitrum',
  [OnRampChainId.ZKSYNC]: 'zksync',
  [OnRampChainId.POLYGON_ZKEVM]: 'polygonzkevm',
  [OnRampChainId.LINEA]: 'linea',
  [OnRampChainId.BASE]: 'base',
  [OnRampChainId.BTC]: 'mainnet',
}

export const chainIdToTopperNetworkId: { [id: number]: string } = {
  [OnRampChainId.ETHEREUM]: 'ethereum',
  [OnRampChainId.ARBITRUM_ONE]: 'arbitrum',
  [OnRampChainId.BSC]: 'bnb-smart-chain',
  [OnRampChainId.BASE]: 'base',
  0: 'bitcoin',
}

export const combinedNetworkIdMap: {
  [provider in keyof typeof ONRAMP_PROVIDERS]: { [id: number]: string }
} = {
  [ONRAMP_PROVIDERS.MoonPay]: chainIdToMoonPayNetworkId,
  [ONRAMP_PROVIDERS.Mercuryo]: chainIdToMercuryoNetworkId,
  [ONRAMP_PROVIDERS.Transak]: chainIdToTransakNetworkId,
  [ONRAMP_PROVIDERS.Topper]: chainIdToTopperNetworkId,
}

export const selectCurrencyField = (unit: OnRampUnit, mode: string) => {
  if (unit === OnRampUnit.Fiat) return mode === 'onramp-fiat' ? Field.OUTPUT : Field.INPUT
  return mode === 'onramp-fiat' ? Field.INPUT : Field.OUTPUT
}
export const formatQuoteDecimals = (quote: number | undefined, unit: OnRampUnit) => {
  if (!quote) return ''
  return unit === OnRampUnit.Crypto ? quote.toFixed(2) : quote.toFixed(5)
}
export const isNativeBtc = (currency: Currency | string | undefined) => {
  if (typeof currency === 'string') return Boolean(currency === 'BTC_0')
  return Boolean(currency?.chainId === 0)
}

export const getOnRampCryptoById = (id: string) => onRampCurrenciesMap[id]
export const getOnRampFiatById = (id: string) => fiatCurrencyMap[id]

export const isFiat = (unit: OnRampUnit) => unit === OnRampUnit.Fiat

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
  VND: {
    name: 'Vietnamese Dong',
    symbol: 'VND',
  },
  IDR: {
    name: 'Indonesian Rupiah',
    symbol: 'IDR',
  },
}

export const NON_DECIMAL_FIAT_CURRENCIES = [fiatCurrencyMap.IDR.symbol]

export type OnRampCurrency = Currency | NativeBtc

export const onRampCurrenciesMap: { [tokenSymbol: string]: Currency } = {
  BTC_0: NativeBtc.onChain(),
  ETH_1: Native.onChain(OnRampChainId.ETHEREUM),
  BNB_56: Native.onChain(OnRampChainId.BSC),
  ETH_42161: Native.onChain(OnRampChainId.ARBITRUM_ONE),
  ETH_1101: Native.onChain(OnRampChainId.POLYGON_ZKEVM),
  ETH_324: Native.onChain(OnRampChainId.ZKSYNC),
  ETH_59144: Native.onChain(OnRampChainId.LINEA),
  ETH_8453: Native.onChain(OnRampChainId.BASE),
  // Add more entries for other currencies as needed
  CAKE_56: bscTokens.cake,
  USDT_1: ethereumTokens.usdt,
  USDT_56: bscTokens.usdt,
  USDC_56: bscTokens.usdc,
  USDC_1: ethereumTokens.usdc,
  USDC_42161: arbitrumTokens.usdc,
  USDC_59144: lineaTokens.usdc,
  USDC_8453: baseTokens.usdc,
  DAI_1: ethereumTokens.dai,
  WBTC_1: ethereumTokens.wbtc,
  // 'USDC.e_42161': arbitrumTokens.usdce,
}
