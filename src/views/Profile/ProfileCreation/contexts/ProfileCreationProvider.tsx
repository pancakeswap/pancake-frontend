import React, { createContext, useEffect, useMemo, useReducer } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getRabbitMintingContract } from 'utils/contractHelpers'

type Actions =
  | { type: 'set_step'; step: number }
  | { type: 'set_team'; teamId: number | null }
  | { type: 'set_bunny'; bunnyId: number | null }
  | { type: 'initialize'; step: number }

interface State {
  isInitialized: boolean
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
  isInitialized: false,
  currentStep: 0,
  teamId: null,
  bunnyId: null,
}

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        isInitialized: true,
        currentStep: action.step,
      }
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
  const { account } = useWallet()

  // Initial checks
  useEffect(() => {
    const fetchData = async () => {
      const mintingContract = getRabbitMintingContract()
      const hasClaimed = await mintingContract.methods.hasClaimed(account).call()

      dispatch({ type: 'initialize', step: hasClaimed ? 1 : 0 })
    }

    if (account) {
      fetchData()
    }
  }, [account, dispatch])

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
