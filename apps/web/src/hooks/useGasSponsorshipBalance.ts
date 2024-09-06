import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { getGasSponsorship } from 'utils/paymaster'

type GasSponsorshipData = {
  balance: bigint
  formattedBalance: string
  isEnoughGasBalance: boolean
}

interface UseGasSponsorshipProps extends Pick<UseQueryOptions<GasSponsorshipData>, 'enabled'> {}

export const useGasSponsorshipBalance = ({ enabled }: UseGasSponsorshipProps = {}) => {
  return useQuery<GasSponsorshipData>({
    queryKey: ['gasSponsorship'],
    queryFn: getGasSponsorship,
    retry: 3,
    refetchInterval: FAST_INTERVAL,
    initialData: {
      balance: 0n,
      formattedBalance: '0',
      isEnoughGasBalance: false,
    },
    enabled,
  })
}
