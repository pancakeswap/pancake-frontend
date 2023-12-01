import { ChainId } from '@pancakeswap/chains'

export const GAUGES = '0xf81953dC234cdEf1D6D0d3ef61b232C6bCbF9aeF' as const
export const GAUGES_TESTNET = '0x357b01894b21787B41A8FA4DCaFE92293470FaD9' as const

export const GAUGES_ADDRESS = {
  [ChainId.BSC]: GAUGES,
  [ChainId.BSC_TESTNET]: GAUGES_TESTNET,
}

export const GAUGES_CALC_ADDRESS = {
  [ChainId.BSC]: '0x94F8cBa8712B3E72C9BF8Ba4d6619Ac9046FE695' as const,
  [ChainId.BSC_TESTNET]: '0x88B02E6238fa6279281eeA600CBfcAd5dd3597A5' as const,
}
