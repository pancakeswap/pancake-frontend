import { ChainId } from '@pancakeswap/chains'
import { createPublicClient, fallback, http, parseAbiItem } from 'viem'
import * as CHAINS from 'viem/chains'
import { describe, expect, it } from 'vitest'
import { STABLE_POOL_MAP } from './pools'

const PUBLIC_NODES: Record<string, string[]> = {
  [ChainId.ARBITRUM_ONE]: [
    CHAINS.arbitrum.rpcUrls.default.http[0],
    'https://arbitrum-one.publicnode.com',
    'https://arbitrum.llamarpc.com',
  ],
  [ChainId.ETHEREUM]: [
    CHAINS.mainnet.rpcUrls.default.http[0],
    'https://ethereum.publicnode.com',
    'https://eth.llamarpc.com',
  ],
}

const createViemClient = (chainId: number) => {
  const node = PUBLIC_NODES[chainId]
  return createPublicClient({
    chain: Object.values(CHAINS).find((chain) => chain.id === chainId),
    transport: node ? fallback(node.map((rpc: string) => http(rpc))) : http(),
  })
}

describe.concurrent('stable swap pools', () => {
  const networks = Object.entries(STABLE_POOL_MAP)

  networks.forEach(([chainId, pools]) => {
    describe(`chainId: ${chainId}`, async () => {
      const client = createViemClient(Number(chainId))
      const denominatorCalls = pools.map((pool) => {
        return {
          abi: [parseAbiItem('function FEE_DENOMINATOR() view returns (uint256)')],
          address: pool.stableSwapAddress,
          functionName: 'FEE_DENOMINATOR',
        } as const
      })
      const adminFeeCalls = pools.map((pool) => {
        return {
          abi: [parseAbiItem('function admin_fee() view returns (uint256)')],
          address: pool.stableSwapAddress,
          functionName: 'admin_fee',
        } as const
      })
      const feeCalls = pools.map((pool) => {
        return {
          abi: [parseAbiItem('function fee() view returns (uint256)')],
          address: pool.stableSwapAddress,
          functionName: 'fee',
        } as const
      })
      const [feeDenominators, adminFees, fees] = await Promise.all([
        client.multicall({
          contracts: denominatorCalls,
          allowFailure: false,
        }),
        client.multicall({
          contracts: adminFeeCalls,
          allowFailure: false,
        }),
        client.multicall({
          contracts: feeCalls,
          allowFailure: false,
        }),
      ])

      const results = pools.map((pool, index) => {
        const stableTotalFee = Number(fees[index]) / Number(feeDenominators[index])
        const lpFeeRateOfTotalFee = 1 - Number(adminFees[index]) / Number(feeDenominators[index])
        return {
          stableTotalFee,
          lpFeeRateOfTotalFee,
          stableLpFee: stableTotalFee * lpFeeRateOfTotalFee,
        }
      })

      pools.forEach((pool, index) => {
        it(`should match the fee for ${chainId}:${pool.lpSymbol}`, () => {
          expect(results[index].stableTotalFee).toEqual(pool.stableTotalFee)
          expect(results[index].stableLpFee).toEqual(pool.stableLpFee)
          expect(results[index].lpFeeRateOfTotalFee).toEqual(pool.stableLpFeeRateOfTotalFee)
        })
      })
    })
  })
})
