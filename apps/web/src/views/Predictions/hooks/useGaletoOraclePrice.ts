import { EvmPriceServiceConnection } from '@pythnetwork/pyth-evm-js'
import { useQuery } from '@tanstack/react-query'
import { Address } from 'viem'

interface UseGaletoOraclePriceProps {
  address: undefined | Address
  enabled: boolean
}

export const useGaletoOraclePrice = ({ address, enabled }: UseGaletoOraclePriceProps) => {
  const { data, refetch } = useQuery({
    queryKey: ['galeto-oracle-price', address],

    queryFn: async () => {
      const connection = new EvmPriceServiceConnection('https://hermes.pyth.network', { verbose: true })
      const priceIds = [address]
      const result = (await connection.getLatestPriceFeeds(priceIds as Array<string>)) as any[]

      return result?.[0]?.price?.price ?? 0n
    },

    refetchInterval: 5000,
    enabled: Boolean(enabled),
  })

  return {
    galetoOraclePrice: BigInt(data ?? 0n),
    refetchGaletoOraclePrice: refetch,
  }
}
