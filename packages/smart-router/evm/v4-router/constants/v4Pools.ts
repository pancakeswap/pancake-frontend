// TODO: move to sdk

import { zeroAddress, type Address } from 'viem'

export const CL_PRESETS: {
  fee: number
  tickSpacing: number
}[] = [
  {
    fee: 500,
    tickSpacing: 10,
  },
]

export const CL_HOOKS: Address[] = [zeroAddress]
