import React, { createContext, useMemo, useReducer } from 'react'

type Actions =
  | { type: 'set_step'; step: number }
  | { type: 'set_team'; teamId: number | null }
  | { type: 'set_bunny'; bunnyId: number | null }

interface State {
  currentStep: number
  teamId: number | null
  bunnyId: number | null
}

interface ContextType extends State {
  nextStep: () => void
  setTeamId: (teamId: number) => void
  setBunnyId: (bunnyId: number) => void
}

const initialState: State = {
  currentStep: 0,
  teamId: null,
  bunnyId: null,
}

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'set_step':
      return {
        ...state,
        currentStep: action.step,
      }
    case 'set_team':
      return {
        ...state,
        teamId: action.teamId,
      }
    case 'set_bunny':
      return {
        ...state,
        bunnyId: action.bunnyId,
      }
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
      setTeamId: (teamId: number) => dispatch({ type: 'set_team', teamId }),
      setBunnyId: (bunnyId: number) => dispatch({ type: 'set_bunny', bunnyId }),
    }),
    [state, dispatch],
  )

  return <ProfileCreationContext.Provider value={memoizedState}>{children}</ProfileCreationContext.Provider>
}

export default ProfileCreationProvider
