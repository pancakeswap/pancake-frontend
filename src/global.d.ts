import type { Ethereum } from '@wagmi/core'

declare global {
  interface Window {
    ethereum?: Ethereum & {
      isSafePal?: true
      isCoin98?: true
      isBlocto?: true
      isMathWallet?: true
    }
  }
}
