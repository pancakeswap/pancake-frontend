interface Window {
  ethereum?: {
    isMetaMask?: true
    isOpera?: true
    isTrust?: true
    providers?: any[]
    request?: (...args: any[]) => Promise<void>
  }
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
  }
}

type SerializedBigNumber = string
