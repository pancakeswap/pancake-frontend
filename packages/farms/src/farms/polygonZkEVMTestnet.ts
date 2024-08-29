import { ChainId } from '@pancakeswap/chains'
import { polygonZkEvmTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
import { Protocol, UniversalFarmConfig } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = []

export const polygonZkEVMTestnetFarmConfig: UniversalFarmConfig[] = [
  ...pinnedFarmConfig,
  {
    pid: 1,
    chainId: ChainId.POLYGON_ZKEVM_TESTNET,
    protocol: Protocol.V3,
    token0: polygonZkEvmTestnetTokens.weth,
    token1: polygonZkEvmTestnetTokens.mockA,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(polygonZkEvmTestnetTokens.weth, polygonZkEvmTestnetTokens.mockA, FeeAmount.LOW),
  },
  {
    pid: 2,
    chainId: ChainId.POLYGON_ZKEVM_TESTNET,
    protocol: Protocol.V3,
    token0: polygonZkEvmTestnetTokens.weth,
    token1: polygonZkEvmTestnetTokens.mockB,
    feeAmount: FeeAmount.MEDIUM,
    lpAddress: Pool.getAddress(polygonZkEvmTestnetTokens.weth, polygonZkEvmTestnetTokens.mockB, FeeAmount.MEDIUM),
  },
  {
    pid: 3,
    chainId: ChainId.POLYGON_ZKEVM_TESTNET,
    protocol: Protocol.V3,
    token0: polygonZkEvmTestnetTokens.mockB,
    token1: polygonZkEvmTestnetTokens.mockC,
    feeAmount: FeeAmount.HIGH,
    lpAddress: Pool.getAddress(polygonZkEvmTestnetTokens.mockB, polygonZkEvmTestnetTokens.mockC, FeeAmount.HIGH),
  },
]

export default polygonZkEVMTestnetFarmConfig
