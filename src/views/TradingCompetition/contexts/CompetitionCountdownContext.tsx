import React, { createContext, useState, useEffect } from 'react'
import useGetBlockCountdown from '../../../hooks/useGetBlockCountdown'
import useGetCompetitionState from '../hooks/useGetCompetitionState'

export const CompetitionCountdownContext = createContext({
  timeUntilNextEvent: null,
  competitionState: null,
  isLoading: true,
})

export const CompetitionCountdownContextProvider = ({ children }) => {
  const [timeUntilNextEvent, setTimeUntilNextEvent] = useState(null)
  const { targetBlock, competitionState, isLoading } = useGetCompetitionState()
  const timeUntilTargetBlock = useGetBlockCountdown(targetBlock)

  useEffect(() => {
    setTimeUntilNextEvent(timeUntilTargetBlock)
  }, [timeUntilTargetBlock])

  return (
    <CompetitionCountdownContext.Provider
      value={{
        timeUntilNextEvent,
        competitionState,
        isLoading,
      }}
    >
      {children}
    </CompetitionCountdownContext.Provider>
  )
}
