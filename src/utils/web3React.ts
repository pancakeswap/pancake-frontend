import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ChainId } from '@pancakeswap/sdk'
import { BscConnector } from '@binance-chain/bsc-connector'
import { ConnectorNames } from '@pancakeswap/uikit'
import useWeb3Provider from 'hooks/useActiveWeb3React'
import { hexlify } from '@ethersproject/bytes'
import { toUtf8Bytes } from '@ethersproject/strings'
import { Web3Provider } from '@ethersproject/providers'

const POLLING_INTERVAL = 12000

const SUPPORTED_CHAIN_ID = [ChainId.BSC, ChainId.BSC_TESTNET]

export const injected = new InjectedConnector({ supportedChainIds: SUPPORTED_CHAIN_ID })

const walletconnect = new WalletConnectConnector({
  rpc: {
    [ChainId.BSC]: 'https://bsc-dataseed.binance.org',
    [ChainId.BSC_TESTNET]: 'https://data-seed-prebsc-2-s3.binance.org:8545',
  },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

const bscConnector = new BscConnector({ supportedChainIds: SUPPORTED_CHAIN_ID })

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: bscConnector,
  [ConnectorNames.Blocto]: async () => {
    const { BloctoConnector } = await import('@blocto/blocto-connector')
    return new BloctoConnector({ chainId: ChainId.BSC, rpc: 'https://bsc.nodereal.io' })
  },
  [ConnectorNames.WalletLink]: async () => {
    const { WalletLinkConnector } = await import('@web3-react/walletlink-connector')
    return new WalletLinkConnector({
      url: 'https://pancakeswap.finance',
      appName: 'PancakeSwap',
      appLogoUrl: 'https://pancakeswap.com/logo.png',
      supportedChainIds: SUPPORTED_CHAIN_ID,
    })
  },
} as const

export const getLibrary = (provider): Web3Provider => {
  const library = new Web3Provider(provider)
  library.pollingInterval = POLLING_INTERVAL
  return library
}

export function useSignMessage() {
  const { library, connector, account } = useWeb3Provider()
  const signMessage = async ({ message }) => {
    if (window.BinanceChain && connector instanceof BscConnector) {
      const { signature } = await window.BinanceChain.bnbSign(account, message)
      return signature
    }

    /**
     * Wallet Connect does not sign the message correctly unless you use their method
     * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
     */
    // @ts-ignore
    if (library.provider?.wc) {
      const wcMessage = hexlify(toUtf8Bytes(message))
      // @ts-ignore
      const signature = await library.provider?.wc.signPersonalMessage([wcMessage, account])
      return signature
    }

    return library.getSigner(account).signMessage(message)
  }

  return {
    signMessageAsync: signMessage,
  }
}

/**
 * BSC Wallet requires a different sign method
 * @see https://docs.binance.org/smart-chain/wallet/wallet_api.html#binancechainbnbsignaddress-string-message-string-promisepublickey-string-signature-string
 */
export const signMessage = async (
  connector: AbstractConnector,
  provider: any,
  account: string,
  message: string,
): Promise<string> => {
  if (window.BinanceChain && connector instanceof BscConnector) {
    const { signature } = await window.BinanceChain.bnbSign(account, message)
    return signature
  }

  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (provider.provider?.wc) {
    const wcMessage = hexlify(toUtf8Bytes(message))
    const signature = await provider.provider?.wc.signPersonalMessage([wcMessage, account])
    return signature
  }

  return provider.getSigner(account).signMessage(message)
}
