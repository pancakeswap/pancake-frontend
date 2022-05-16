import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { SmartContractPhases, LIVE, FINISHED, CLAIM, OVER } from 'config/constants/trading-competition/phases'
import { useTradingCompetitionContractMoD } from 'hooks/useContract'

export const useCompetitionStatus = () => {
  const tradingCompetitionContract = useTradingCompetitionContractMoD(false)

  const { data: state } = useSWRImmutable('competitionStatus', async () => {
    const competitionStatus = await tradingCompetitionContract.currentStatus()
    return SmartContractPhases[competitionStatus].state
  })

  return useMemo(() => {
    const hasCompetitionEnded = state === FINISHED || state === CLAIM || state === OVER
    if (hasCompetitionEnded) {
      return null
    }

    if (state === LIVE) {
      return 'live'
    }

    return 'soon'
  }, [state])
}
