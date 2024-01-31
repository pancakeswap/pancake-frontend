import { isCyberWallet } from '@cyberlab/cyber-app-sdk'
import { WalletConfigV2 } from '@pancakeswap/ui-wallets'
import { WalletFilledIcon } from '@pancakeswap/uikit'
import { getTrustWalletProvider } from '@pancakeswap/wagmi/connectors/trustWallet'
import type { ExtendEthereum } from 'global'
import { walletConnectNoQrCodeConnector } from '../utils/wagmi'
import { ASSET_CDN } from './constants/endpoints'

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  WalletConnectV1 = 'walletConnectLegacy',
  // BSC = 'bsc',
  BinanceW3W = 'BinanceW3W',
  Blocto = 'blocto',
  WalletLink = 'coinbaseWallet',
  Ledger = 'ledger',
  TrustWallet = 'trustWallet',
  CyberWallet = 'cyberwallet',
}

const createQrCode = (chainId: number, connect) => async () => {
  connect({ connector: walletConnectNoQrCodeConnector, chainId })

  const r = await walletConnectNoQrCodeConnector.getProvider()
  return new Promise<string>((resolve) => {
    r.on('display_uri', (uri) => {
      resolve(uri)
    })
  })
}

const isMetamaskInstalled = () => {
  if (typeof window === 'undefined') {
    return false
  }

  if (window.ethereum?.isMetaMask) {
    return true
  }

  if (window.ethereum?.providers?.some((p) => p.isMetaMask)) {
    return true
  }

  return false
}

function isBinanceWeb3WalletInstalled() {
  return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBinance)
}

const walletsConfig = ({
  chainId,
  connect,
}: {
  chainId: number
  connect: (connectorID: ConnectorNames) => void
}): WalletConfigV2<ConnectorNames>[] => {
  const qrCode = createQrCode(chainId, connect)
  return [
    {
      id: 'metamask',
      title: 'Metamask',
      icon: `${ASSET_CDN}/web/wallets/metamask.png`,
      get installed() {
        return isMetamaskInstalled()
        // && metaMaskConnector.ready
      },
      connectorId: ConnectorNames.MetaMask,
      deepLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
      qrCode,
      downloadLink: 'https://metamask.app.link/dapp/pancakeswap.finance/',
    },
    {
      id: 'BinanceW3W',
      title: 'Binance Web3 Wallet',
      icon: `${ASSET_CDN}/web/wallets/binance-w3w.png`,
      connectorId: isBinanceWeb3WalletInstalled() ? ConnectorNames.Injected : ConnectorNames.BinanceW3W,
      get installed() {
        if (isBinanceWeb3WalletInstalled()) {
          return true
        }
        // still showing the SDK if not installed
        return undefined
      },
    },
    // {
    //   id: 'binance',
    //   title: 'Binance Wallet',
    //   icon: `${ASSET_CDN}/web/wallets/binance.png`,
    //   get installed() {
    //     return typeof window !== 'undefined' && Boolean(window.BinanceChain)
    //   },
    //   connectorId: ConnectorNames.BSC,
    //   guide: {
    //     desktop: 'https://www.bnbchain.org/en/binance-wallet',
    //   },
    //   downloadLink: {
    //     desktop: isFirefox
    //       ? 'https://addons.mozilla.org/en-US/firefox/addon/binance-chain/?src=search'
    //       : 'https://chrome.google.com/webstore/detail/binance-wallet/fhbohimaelbohpjbbldcngcnapndodjp',
    //   },
    // },
    {
      id: 'coinbase',
      title: 'Coinbase Wallet',
      icon: `${ASSET_CDN}/web/wallets/coinbase.png`,
      connectorId: ConnectorNames.WalletLink,
    },
    {
      id: 'trust',
      title: 'Trust Wallet',
      icon: `${ASSET_CDN}/web/wallets/trust.png`,
      connectorId: ConnectorNames.TrustWallet,
      get installed() {
        return !!getTrustWalletProvider()
      },
      deepLink: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=https://pancakeswap.finance/',
      downloadLink: 'https://chrome.google.com/webstore/detail/trust-wallet/egjidjbpglichdcondbcbdnbeeppgdph',
      guide: {
        desktop: 'https://trustwallet.com/browser-extension',
        mobile: 'https://trustwallet.com/',
      },
      qrCode,
    },
    {
      id: 'walletconnect',
      title: 'WalletConnect',
      icon: `${ASSET_CDN}/web/wallets/walletconnect.png`,
      connectorId: ConnectorNames.WalletConnect,
    },
    {
      id: 'opera',
      title: 'Opera Wallet',
      icon: `${ASSET_CDN}/web/wallets/opera.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isOpera)
      },
      downloadLink: 'https://www.opera.com/crypto/next',
    },
    {
      id: 'brave',
      title: 'Brave Wallet',
      icon: `${ASSET_CDN}/web/wallets/brave.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isBraveWallet)
      },
      downloadLink: 'https://brave.com/wallet/',
    },
    {
      id: 'rabby',
      title: 'Rabby Wallet',
      icon: `${ASSET_CDN}/web/wallets/rabby.png`,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isRabby)
      },
      connectorId: ConnectorNames.Injected,
      guide: {
        desktop: 'https://rabby.io/',
      },
      downloadLink: {
        desktop: 'https://chrome.google.com/webstore/detail/rabby/acmacodkjbdgmoleebolmdjonilkdbch',
      },
    },
    {
      id: 'math',
      title: 'MathWallet',
      icon: `${ASSET_CDN}/web/wallets/mathwallet.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isMathWallet)
      },
      qrCode,
    },
    {
      id: 'tokenpocket',
      title: 'TokenPocket',
      icon: `${ASSET_CDN}/web/wallets/tokenpocket.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean(window.ethereum?.isTokenPocket)
      },
      qrCode,
    },
    {
      id: 'safepal',
      title: 'SafePal',
      icon: `${ASSET_CDN}/web/wallets/safepal.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isSafePal)
      },
      downloadLink:
        'https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa',
      qrCode,
    },
    {
      id: 'coin98',
      title: 'Coin98',
      icon: `${ASSET_CDN}/web/wallets/coin98.png`,
      connectorId: ConnectorNames.Injected,
      get installed() {
        return (
          typeof window !== 'undefined' &&
          (Boolean((window.ethereum as ExtendEthereum)?.isCoin98) || Boolean(window.coin98))
        )
      },
      qrCode,
    },
    {
      id: 'blocto',
      title: 'Blocto',
      icon: `${ASSET_CDN}/web/wallets/blocto.png`,
      connectorId: ConnectorNames.Blocto,
      get installed() {
        return typeof window !== 'undefined' && Boolean((window.ethereum as ExtendEthereum)?.isBlocto)
          ? true
          : undefined // undefined to show SDK
      },
    },
    {
      id: 'cyberwallet',
      title: 'CyberWallet',
      icon: `${ASSET_CDN}/web/wallets/cyberwallet.png`,
      connectorId: ConnectorNames.CyberWallet,
      get installed() {
        return typeof window !== 'undefined' && isCyberWallet()
      },
      isNotExtension: true,
      guide: {
        desktop: 'https://docs.cyber.co/sdk/cyber-account#supported-chains',
      },
    },
    {
      id: 'ledger',
      title: 'Ledger',
      icon: `${ASSET_CDN}/web/wallets/ledger.png`,
      connectorId: ConnectorNames.Ledger,
    },
  ]
}

export const createWallets = (chainId: number, connect: any) => {
  const hasInjected = typeof window !== 'undefined' && !window.ethereum
  const config = walletsConfig({ chainId, connect })
  return hasInjected && config.some((c) => c.installed && c.connectorId === ConnectorNames.Injected)
    ? config // add injected icon if none of injected type wallets installed
    : [
        ...config,
        {
          id: 'injected',
          title: 'Injected',
          icon: WalletFilledIcon,
          connectorId: ConnectorNames.Injected,
          installed: typeof window !== 'undefined' && Boolean(window.ethereum),
        },
      ]
}

const docLangCodeMapping: Record<string, string> = {
  it: 'italian',
  ja: 'japanese',
  fr: 'french',
  tr: 'turkish',
  vi: 'vietnamese',
  id: 'indonesian',
  'zh-cn': 'chinese',
  'pt-br': 'portuguese-brazilian',
}

export const getDocLink = (code: string) =>
  docLangCodeMapping[code]
    ? `https://docs.pancakeswap.finance/v/${docLangCodeMapping[code]}/get-started/wallet-guide`
    : `https://docs.pancakeswap.finance/get-started/wallet-guide`
