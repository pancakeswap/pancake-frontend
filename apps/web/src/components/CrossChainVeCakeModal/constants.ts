import { ChainId } from '@pancakeswap/chains'

export const CROSS_CHAIN_CONFIG: Record<
  number,
  { eid: number; dstGas: bigint; name: string; layerZeroFee: bigint; layerZeroFeeBufferTimes?: number }
> = {
  [ChainId.ETHEREUM]: {
    eid: 30101,
    dstGas: 650000n,
    name: 'Ethereum',
    layerZeroFee: 114670586267181697n,
  },
  [ChainId.ARBITRUM_ONE]: {
    eid: 30110,
    dstGas: 850000n,
    name: 'Arbitrum',
    layerZeroFee: 262309998201766n,
  },
  [ChainId.ZKSYNC]: {
    eid: 30165,
    dstGas: 850000n,
    name: 'ZKsync',
    layerZeroFee: 2373941681319489n,
    layerZeroFeeBufferTimes: 10,
  },
}
