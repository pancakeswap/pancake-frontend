import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { BscConnector } from '@binance-chain/bsc-connector'
import Web3 from 'web3'
import { CHAIN_ID } from 'config'
import getNodeUrl from './getRpcUrl'

const POLLING_INTERVAL = 12000
const rpcUrl = getNodeUrl()

const injected = new InjectedConnector({ supportedChainIds: [CHAIN_ID] })

const walletconnect = new WalletConnectConnector({
  rpc: { [CHAIN_ID]: rpcUrl },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: [CHAIN_ID] })

// TODO move this enum to the uikit
enum ConnectorNames {
  Injected = 'injected',
  WalletConnect = 'walletconnect',
  BSC = 'bsc',
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
}

export const getLibrary = (provider): Web3 => {
  return provider
}
