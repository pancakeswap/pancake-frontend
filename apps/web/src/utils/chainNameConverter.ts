import { MultiChainName } from 'state/info/constant'
import { bsc, linea } from 'wagmi/chains'

export const chainNameConverter = (name: string) => {
  switch (name) {
    case bsc.name:
      return 'BNB Chain'
    case linea.name:
      return 'Linea'
    default:
      return name
  }
}

export const multiChainNameConverter = (name: MultiChainName) => {
  switch (name) {
    case 'BSC':
      return 'BNB Chain'
    case 'LINEA':
      return 'Linea'
    default:
      return name
  }
}
