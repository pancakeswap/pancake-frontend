import { useMemo, useEffect, useState } from 'react'
import {
  SmartContractPhases,
  CompetitionPhases,
  LIVE,
  FINISHED,
  CLAIM,
  OVER,
} from 'config/constants/trading-competition/phases'
import { useTradingCompetitionContractMoD } from 'hooks/useContract'

export const useCompetitionStatus = () => {
  const tradingCompetitionContract = useTradingCompetitionContractMoD(false)
  const [currentPhase, setCurrentPhase] = useState(CompetitionPhases.REGISTRATION)

  useEffect(() => {
    const fetchCompetitionInfoContract = async () => {
      const competitionStatus = await tradingCompetitionContract.currentStatus()
      setCurrentPhase(SmartContractPhases[competitionStatus])
    }

    fetchCompetitionInfoContract()
  }, [tradingCompetitionContract])

  return useMemo(() => {
    const { state } = currentPhase

    const hasCompetitionEnded = state === FINISHED || state === CLAIM || state === OVER
    if (hasCompetitionEnded) {
      return null
    }

    if (state === LIVE) {
      return 'live'
    }

    return 'soon'
  }, [currentPhase])
}
