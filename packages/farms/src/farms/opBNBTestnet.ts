import { ChainId } from '@pancakeswap/chains'
import { opBnbTestnetTokens } from '@pancakeswap/tokens'
import { FeeAmount, Pool } from '@pancakeswap/v3-sdk'
import { Protocol, UniversalFarmConfig } from '../types'

const pinnedFarmConfig: UniversalFarmConfig[] = []

export const opBNBTestnetFarmConfig: UniversalFarmConfig[] = [
  ...pinnedFarmConfig,
  {
    pid: 1,
    chainId: ChainId.OPBNB_TESTNET,
    protocol: Protocol.V3,
    token0: opBnbTestnetTokens.mockA,
    token1: opBnbTestnetTokens.wbnb,
    feeAmount: FeeAmount.LOW,
    lpAddress: Pool.getAddress(opBnbTestnetTokens.mockA, opBnbTestnetTokens.wbnb, FeeAmount.LOW),
  },

  {
    pid: 2,
    chainId: ChainId.OPBNB_TESTNET,
    protocol: Protocol.V3,
    token0: opBnbTestnetTokens.mockB,
    token1: opBnbTestnetTokens.wbnb,
    feeAmount: FeeAmount.MEDIUM,
    lpAddress: Pool.getAddress(opBnbTestnetTokens.mockB, opBnbTestnetTokens.wbnb, FeeAmount.MEDIUM),
  },
  {
    pid: 3,
    chainId: ChainId.OPBNB_TESTNET,
    protocol: Protocol.V3,
    token0: opBnbTestnetTokens.mockB,
    token1: opBnbTestnetTokens.mockC,
    feeAmount: FeeAmount.OPBNB_TESTNET,
    lpAddress: Pool.getAddress(opBnbTestnetTokens.mockB, opBnbTestnetTokens.mockC, FeeAmount.HIGH),
  },
]

export default opBNBTestnetFarmConfig
