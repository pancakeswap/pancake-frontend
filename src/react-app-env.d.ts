/// <reference types="react-scripts" />

interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => void
  }
}

interface Window {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => Promise<void>
  }
  BinanceChain?: {
    bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
  }
}