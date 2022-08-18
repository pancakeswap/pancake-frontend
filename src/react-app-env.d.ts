import { Ethereum } from '@wagmi/core'

type SerializedBigNumber = string

declare let __NEZHA_BRIDGE__: any

interface Window {
  ethereum?: Ethereum & {
    isSafePal?: true
  }
}
