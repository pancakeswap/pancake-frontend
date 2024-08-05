import { ChainId } from '@pancakeswap/chains'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { Hex, hexToBigInt, parseEther } from 'viem'
import { useWalletClient } from 'wagmi'

export enum GAS_PRICE {
  default = '1',
  fast = '4',
  instant = '5',
  testnet = '10',
}

export const GAS_PRICE_GWEI = {
  rpcDefault: 'rpcDefault',
  default: parseEther(GAS_PRICE.default, 'gwei').toString(),
  fast: parseEther(GAS_PRICE.fast, 'gwei').toString(),
  instant: parseEther(GAS_PRICE.instant, 'gwei').toString(),
  testnet: parseEther(GAS_PRICE.testnet, 'gwei').toString(),
}

const DEFAULT_BSC_GAS_BIGINT = BigInt(GAS_PRICE_GWEI.default)
const DEFAULT_BSC_TESTNET_GAS_BIGINT = BigInt(GAS_PRICE_GWEI.testnet)

/**
 * Note that this hook will only works well for BNB chain
 */
export function useGasPrice(chainIdOverride?: number): bigint | undefined {
  const { chainId: chainId_ } = useActiveChainId()
  const chainId = chainIdOverride ?? chainId_
  const { data: signer } = useWalletClient({ chainId })
  const userGas = GAS_PRICE_GWEI.rpcDefault
  const { data: bscProviderGasPrice = DEFAULT_BSC_GAS_BIGINT } = useQuery({
    queryKey: ['bscProviderGasPrice', signer],

    queryFn: async () => {
      // @ts-ignore
      const gasPrice = await signer?.request({
        method: 'eth_gasPrice' as any,
      })
      return hexToBigInt(gasPrice as Hex)
    },

    enabled: Boolean(signer && chainId === ChainId.BSC && userGas === GAS_PRICE_GWEI.rpcDefault),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  if (chainId === ChainId.BSC) {
    return userGas === GAS_PRICE_GWEI.rpcDefault ? bscProviderGasPrice : BigInt(userGas ?? GAS_PRICE_GWEI.default)
  }
  if (chainId === ChainId.BSC_TESTNET) {
    return DEFAULT_BSC_TESTNET_GAS_BIGINT
  }
  return undefined
}
