import { ChainId } from '@pancakeswap/chains'

export const GAUGES = '0xf81953dC234cdEf1D6D0d3ef61b232C6bCbF9aeF' as const
export const GAUGES_TESTNET = '0x357b01894b21787B41A8FA4DCaFE92293470FaD9' as const

export const GAUGES_ADDRESS = {
  [ChainId.BSC]: GAUGES,
  [ChainId.BSC_TESTNET]: GAUGES_TESTNET,
}

export const GAUGES_CALC_ADDRESS = {
  [ChainId.BSC]: '0xa2BAbe69700414BB0342ba0615Ff4B1965d6D36f' as const,
  [ChainId.BSC_TESTNET]: '0xbCe8FDb4aa0e3E7332515abcc6b77f455F9Ff218' as const,
}
