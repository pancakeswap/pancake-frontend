import { useQuery } from '@tanstack/react-query'
import { getPotteryVaultContract } from 'utils/contractHelpers'
import { fetchLastVaultAddress } from 'state/pottery/fetchPottery'

export const usePotteryStatus = () => {
  const { data: potteryStatus } = useQuery({
    queryKey: ['potteryLastStatus'],

    queryFn: async () => {
      const lastVaultAddress = await fetchLastVaultAddress()
      const potteryVaultContract = getPotteryVaultContract(lastVaultAddress)
      return potteryVaultContract.read.getStatus()
    },

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return potteryStatus
}
