import { ChainId } from '@pancakeswap/chains'

export const GAUGES = '0xf81953dC234cdEf1D6D0d3ef61b232C6bCbF9aeF' as const
export const GAUGES_TESTNET = '0x357b01894b21787B41A8FA4DCaFE92293470FaD9' as const

export default {
  [ChainId.BSC]: GAUGES,
  [ChainId.BSC_TESTNET]: GAUGES_TESTNET,
}
