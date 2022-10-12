import type { Ethereum } from '@wagmi/core'

export interface ExtendEthereum extends Ethereum {
  isSafePal?: true
  isCoin98?: true
  isBlocto?: true
  isMathWallet?: true
  isTrustWallet?: true
  isBlocto?: true
}

declare global {
  interface Window {
    coin98?: true
    ethereum?: ExtendEthereum
    BinanceChain?: {
      bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
      switchNetwork?: (networkId: string) => Promise<string>
    } & Ethereum
  }
}

export {}
