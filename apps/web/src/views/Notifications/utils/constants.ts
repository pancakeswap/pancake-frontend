if (!process.env.NEXT_PUBLIC_PROJECT_ID) throw new Error('`NEXT_PUBLIC_PROJECT_ID` env variable is missing.')

export const DEFAULT_MAIN_CHAINS = [
  // mainnets
  'eip155:1',
]

export const DEFAULT_TEST_CHAINS = [
  // testnets
  'eip155:5',
]

export const DEFAULT_CHAINS = [...DEFAULT_MAIN_CHAINS, ...DEFAULT_TEST_CHAINS]

export const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID
export const DEFAULT_RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL

export const DEFAULT_LOGGER = 'debug'

export const DEFAULT_APP_METADATA = {
  description: 'demp for push',
  icons: ['https://i.imgur.com/q9QDRXc.png'],
  name: 'test-push',
  url: 'http://127.0.0.1:3000',
}

/**
 * EIP155
 */
export enum DEFAULT_EIP155_METHODS {
  ETH_SEND_TRANSACTION = 'eth_sendTransaction',
  PERSONAL_SIGN = 'personal_sign',
}

export enum DEFAULT_EIP155_OPTIONAL_METHODS {
  ETH_SIGN_TRANSACTION = 'eth_signTransaction',
  ETH_SIGN = 'eth_sign',
  ETH_SIGN_TYPED_DATA = 'eth_signTypedData',
  ETH_SIGN_TYPED_DATA_V4 = 'eth_signTypedData_v4',
}

export enum DEFAULT_EIP_155_EVENTS {
  ETH_CHAIN_CHANGED = 'chainChanged',
  ETH_ACCOUNTS_CHANGED = 'accountsChanged',
}

export const DEFAULT_GITHUB_REPO_URL = 'https://github.com/WalletConnect/web-examples/tree/main/dapps/react-dapp-v2'

type RelayerType = {
  value: string | undefined
  label: string
}

export const REGIONALIZED_RELAYER_ENDPOINTS: RelayerType[] = [
  {
    value: DEFAULT_RELAY_URL,
    label: 'Default',
  },

  {
    value: 'wss://us-east-1.relay.walletconnect.com',
    label: 'US',
  },
  {
    value: 'wss://eu-central-1.relay.walletconnect.com',
    label: 'EU',
  },
  {
    value: 'wss://ap-southeast-1.relay.walletconnect.com',
    label: 'Asia Pacific',
  },
]

export const PROJECT_METADATA = {
  description: 'A simple test dapp',
  icons: ['https://i.imgur.com/q9QDRXc.png'],
  name: 'test-dApp',
  url: 'https://pancakeswap.finance',
}
