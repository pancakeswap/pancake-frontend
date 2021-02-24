import { Web3Provider } from '@ethersproject/providers'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import getRpcUrl from 'utils/getRpcUrl'

import { NetworkConnector } from './NetworkConnector'

const NETWORK_URL = getRpcUrl()

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '56')

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`)
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
})

let networkLibrary: Web3Provider | undefined
export async function getNetworkLibrary(): Promise<Web3Provider> {
  const provider = await network.getProvider()
  networkLibrary = networkLibrary ?? new Web3Provider(provider as any)
  return networkLibrary
}

export const injected = new InjectedConnector({
  supportedChainIds: [NETWORK_CHAIN_ID],
})

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000,
})
