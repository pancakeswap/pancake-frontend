import { Native } from '@pancakeswap/sdk'
import { Currency } from '@pancakeswap/swap-sdk-core'
import { arbitrumTokens, baseTokens, bscTokens, ethereumTokens, lineaTokens } from '@pancakeswap/tokens'
import { NativeBtc } from './utils/NativeBtc'

export const SUPPORTED_ONRAMP_TOKENS = ['ETH', 'DAI', 'USDT', 'USDC', 'BUSD', 'BNB', 'WBTC']
export const DEFAULT_FIAT_CURRENCIES = ['USD', 'EUR', 'GBP', 'HKD', 'CAD', 'AUD', 'BRL', 'JPY', 'KRW', 'VND']

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
}

export enum FeeTypes {
  NetworkingFees = 'Networking Fees',
  ProviderFees = 'Provider Fees',
  ProviderRate = 'Rate',
}

const MOONPAY_FEE_TYPES = [FeeTypes.NetworkingFees, FeeTypes.ProviderFees, FeeTypes.ProviderRate]
const MERCURYO_FEE_TYPES = [FeeTypes.ProviderFees, FeeTypes.ProviderRate]

export const getIsNetworkEnabled = (network: OnRampChainId | undefined) => {
  if (typeof network === 'undefined') return false
  if (typeof network === 'number') return true
  return false
}

export const providerFeeTypes: { [provider in ONRAMP_PROVIDERS]: FeeTypes[] } = {
  [ONRAMP_PROVIDERS.MoonPay]: MOONPAY_FEE_TYPES,
  [ONRAMP_PROVIDERS.Mercuryo]: MERCURYO_FEE_TYPES,
  [ONRAMP_PROVIDERS.Transak]: MOONPAY_FEE_TYPES,
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

export const combinedNetworkIdMap: {
  [provider in keyof typeof ONRAMP_PROVIDERS]: { [id: number]: string }
} = {
  [ONRAMP_PROVIDERS.MoonPay]: chainIdToMoonPayNetworkId,
  [ONRAMP_PROVIDERS.Mercuryo]: chainIdToMercuryoNetworkId,
  [ONRAMP_PROVIDERS.Transak]: chainIdToTransakNetworkId,
}
const extractOnRampCurrencyChainId = (currencyId: string) => {
  const parts = currencyId.split('_')
  return parts[1]
}

export const formatQuoteDecimals = (quote: number | undefined, typedValue: string | undefined) => {
  if (!quote || !typedValue || typedValue === '') return ''
  return quote.toFixed(5)
}
export const isNativeBtc = (currency: Currency | string | undefined) => {
  if (typeof currency === 'string') return Boolean(currency === 'BTC_0')
  return Boolean(currency?.chainId === 0)
}

export const getOnRampCryptoById = (id: string) => onRampCurrenciesMap[id]
export const getOnRampFiatById = (id: string) => fiatCurrencyMap[id]

export const getOnrampCurrencyChainId = (currencyId: string | undefined): any => {
  if (!currencyId) return undefined
  return Number(extractOnRampCurrencyChainId(currencyId))
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
  VND: {
    name: 'Vietnamese Dong',
    symbol: 'VND',
  },
}

export type OnRampCurrency = Currency | NativeBtc
export const onRampCurrencies: OnRampCurrency[] = [
  NativeBtc.onChain(),
  Native.onChain(OnRampChainId.ETHEREUM),
  Native.onChain(OnRampChainId.BSC),
  Native.onChain(OnRampChainId.ARBITRUM_ONE),
  Native.onChain(OnRampChainId.POLYGON_ZKEVM),
  Native.onChain(OnRampChainId.ZKSYNC),
  Native.onChain(OnRampChainId.LINEA),
  Native.onChain(OnRampChainId.BASE),
  ethereumTokens.usdt,
  bscTokens.usdt,
  bscTokens.usdc,
  ethereumTokens.usdc,
  arbitrumTokens.usdc,
  lineaTokens.usdc,
  baseTokens.usdc,
  ethereumTokens.dai,
  ethereumTokens.wbtc,
  // arbitrumTokens.usdce,
]

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
