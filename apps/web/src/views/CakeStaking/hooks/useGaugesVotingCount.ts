import { useQuery } from '@tanstack/react-query'
import { SUPPORT_CAKE_STAKING } from 'config/constants/supportChains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useGaugesVotingContract } from 'hooks/useContract'

export const useGaugesVotingCount = () => {
  const { chainId } = useActiveChainId()
  const gaugesVotingContract = useGaugesVotingContract()

  const { data } = useQuery({
    queryKey: ['gaugesVotingCount', gaugesVotingContract.address],

    queryFn: async () => {
      try {
        const count = (await gaugesVotingContract.read.gaugeCount()) ?? 0n
        return count
      } catch (error) {
        console.warn(error)
        return 0n
      }
    },

    enabled: Boolean(gaugesVotingContract && chainId && SUPPORT_CAKE_STAKING.includes(chainId)),
  })

  return data
}
