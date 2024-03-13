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

export type OnRampCurrency = Currency | NativeBtc
export const onRampCurrencies: OnRampCurrency[] = [
  NativeBtc.onChain(),
  Native.onChain(OnRampChainId.ETHEREUM),
  Native.onChain(OnRampChainId.BSC),
  Native.onChain(OnRampChainId.ARBITRUM_ONE),
  Native.onChain(OnRampChainId.POLYGON_ZKEVM),
  Native.onChain(OnRampChainId.ZKSYNC),
  Native.onChain(OnRampChainId.LINEA),
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
