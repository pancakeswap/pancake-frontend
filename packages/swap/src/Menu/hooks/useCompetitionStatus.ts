import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SmartContractPhases, LIVE, REGISTRATION } from 'config/constants/trading-competition/phases'
import { useTradingCompetitionContractMoD } from 'hooks/useContract'

export const useCompetitionStatus = () => {
  const tradingCompetitionContract = useTradingCompetitionContractMoD()

  const { data: state } = useQuery({
    queryKey: ['competitionStatus'],

    queryFn: async () => {
      const competitionStatus = await tradingCompetitionContract.read.currentStatus()
      return SmartContractPhases[competitionStatus].state
    },

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })

  return useMemo(() => {
    if (state === REGISTRATION) {
      return 'soon'
    }

    if (state === LIVE) {
      return 'live'
    }

    return null
  }, [state])
}
