import { WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect'

export type PaletteColor = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  A100: string
  A200: string
  A400: string
  A700: string
}

export type Theme = {
  primary: PaletteColor
  secondary: PaletteColor
  divider: string
  background: {
    default: string
  }
  text: {
    primary: string
    secondary: string
  }
  error: PaletteColor
  info: PaletteColor
  success: PaletteColor
  warning: PaletteColor
  button: {
    primary: string
    primaryText: string
    disabled: string
    disabledText: string
    action: string
    actionText: string
    hover: string
  }
  options: {
    hover: string
    select: string
  }
  card: {
    background: string
    elevation: string
    secondary: string
  }
  popover: {
    background: string
    elevation: string
    secondary: string
  }
  modal: {
    background: string
  }
  font: {
    primary: string
    header: string
  }
}

export const MAINNET_CHAINS = {
  solana: 1,
  ethereum: 2,
  bsc: 4,
  polygon: 5,
  avalanche: 6,
  fantom: 10,
  celo: 14,
  moonbeam: 16,
  osmosis: 20,
  sui: 21,
  aptos: 22,
  arbitrum: 23,
  optimism: 24,
  base: 30,
  wormchain: 3104,
  evmos: 4001,
  kujira: 4002,
} as const

export type MainnetChainName = keyof typeof MAINNET_CHAINS
export type MainnetChainId = (typeof MAINNET_CHAINS)[MainnetChainName]

export const TESTNET_CHAINS = {
  solana: 1,
  goerli: 2,
  bsc: 4,
  mumbai: 5,
  fuji: 6,
  fantom: 10,
  alfajores: 14,
  moonbasealpha: 16,
  osmosis: 20,
  sui: 21,
  aptos: 22,
  arbitrumgoerli: 23,
  optimismgoerli: 24,
  basegoerli: 30,
  wormchain: 3104,
  evmos: 4001,
  kujira: 4002,
  arbitrum_sepolia: 10003,
  base_sepolia: 10004,
  optimism_sepolia: 10005,
} as const
export type TestnetChainName = keyof typeof TESTNET_CHAINS
export type TestnetChainId = (typeof TESTNET_CHAINS)[TestnetChainName]

export type ChainName = MainnetChainName | TestnetChainName
export type ChainId = MainnetChainId | TestnetChainId

export type Rpcs = {
  [chain in ChainName]?: string
}

export interface BridgeDefaults {
  fromNetwork?: ChainName
  toNetwork?: ChainName
  token?: string
  requiredNetwork?: ChainName
}

export type ExplorerConfig = {
  href: string
  label?: string
  target?: '_blank' | '_self'
}

export type SearchTxConfig = {
  txHash?: string
  chainName?: ChainName
}

export type MoreTokenConfig = {
  label: string
  href: string
  target?: '_blank' | '_self'
}

export type MoreChainConfig = {
  href: string
  target?: '_blank' | '_self'
  description: string
  networks: MoreChainDefinition[]
}

export type MoreChainDefinition = {
  icon: string
  href?: string
  label: string
  name?: string
  description?: string
  target?: '_blank' | '_self'
  showOpenInNewIcon?: boolean
}

export interface MenuEntry {
  label: string
  href: string
  target?: string
  order?: number
}

export type WidgetTheme = {
  mode: 'light' | 'dark'
  theme: Theme
}

export type ExtendedWidgetConfig = WormholeConnectConfig & { partnerLogo?: string; walletConnectProjectId?: string }

export enum WidgetEnvs {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet',
}

export type Env = keyof typeof WidgetEnvs
