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
