import { ChainId } from '@pancakeswap/chains'

export const CROSS_CHIAN_CONFIG: Record<number, { eid: number; dstGas: bigint; name: string; layerZeroFee: bigint }> = {
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
}
