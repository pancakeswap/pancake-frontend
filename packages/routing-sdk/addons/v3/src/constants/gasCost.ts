import { ChainId } from '@pancakeswap/chains'

export const BASE_SWAP_COST_STABLE_SWAP = 180000n

export const COST_PER_EXTRA_HOP_STABLE_SWAP = 70000n

// Constant cost for doing any swap regardless of pools.
export const BASE_SWAP_COST_V2 = 135000n // 115000, bumped up by 20_000

// Constant per extra hop in the route.
export const COST_PER_EXTRA_HOP_V2 = 50000n // 20000, bumped up by 30_000

// Cost for crossing an uninitialized tick.
export const COST_PER_UNINIT_TICK = 0n

export const BASE_SWAP_COST_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPBNB:
    case ChainId.OPBNB_TESTNET:
      return 2000n
    default:
      return 0n
  }
}
export const COST_PER_INIT_TICK = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPBNB:
    case ChainId.OPBNB_TESTNET:
      return 31000n
    default:
      return 0n
  }
}

export const COST_PER_HOP_V3 = (id: ChainId): bigint => {
  switch (id) {
    case ChainId.BSC:
    case ChainId.BSC_TESTNET:
    case ChainId.ETHEREUM:
    case ChainId.GOERLI:
    case ChainId.ZKSYNC:
    case ChainId.ZKSYNC_TESTNET:
    case ChainId.POLYGON_ZKEVM:
    case ChainId.POLYGON_ZKEVM_TESTNET:
    case ChainId.OPBNB:
    case ChainId.OPBNB_TESTNET:
      return 80000n
    default:
      return 0n
  }
}
