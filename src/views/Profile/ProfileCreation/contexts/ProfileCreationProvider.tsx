import React, { createContext, useMemo, useReducer } from 'react'
import { Team } from 'state/types'

type Actions = { type: 'set_step'; step: number } | { type: 'set_team'; team: Team }

interface State {
  currentStep: number
  selectedTeam: Team | null
}

interface ContextType extends State {
  nextStep: () => void
  setTeam: (team: Team) => void
}

const initialState: State = {
  currentStep: 0,
  selectedTeam: null,
}

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    default:
      return state
  }
}

export const ProfileCreationContext = createContext<ContextType>(null)

const ProfileCreationProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const memoizedState = useMemo(
    () => ({
      ...state,
      nextStep: () => dispatch({ type: 'set_step', step: state.currentStep + 1 }),
      setTeam: (team: Team) => dispatch({ type: 'set_team', team }),
    }),
    [state, dispatch],
  )

  return <ProfileCreationContext.Provider value={memoizedState}>{children}</ProfileCreationContext.Provider>
}

export default ProfileCreationProvider
