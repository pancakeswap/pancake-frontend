import { ChainId, JSBI } from '@pancakeswap/sdk'

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = JSBI.BigInt(0)

export const BASE_SWAP_COST_V3 = (id: ChainId): JSBI => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
      return JSBI.BigInt(2000)
    default:
      return JSBI.BigInt(0)
  }
}
export const COST_PER_INIT_TICK = (id: ChainId): JSBI => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
      return JSBI.BigInt(31000)
    default:
      return JSBI.BigInt(0)
  }
}

export const COST_PER_HOP_V3 = (id: ChainId): JSBI => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
      return JSBI.BigInt(80000)
    default:
      return JSBI.BigInt(0)
  }
}
