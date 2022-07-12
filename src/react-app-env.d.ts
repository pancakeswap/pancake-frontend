interface Window {
  ethereum?: {
    isMetaMask?: true
    isOpera?: true
    isCoinbaseWallet?: true
    isTrust?: true
    providers?: any[]
    request?: (...args: any[]) => Promise<void>
  }
  bn?: any
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
  }
}

type SerializedBigNumber = string

declare let __NEZHA_BRIDGE__: any
