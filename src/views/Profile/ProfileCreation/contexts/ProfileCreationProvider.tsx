import React, { createContext, useEffect, useMemo, useReducer } from 'react'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { getBunnyFactoryContract } from 'utils/contractHelpers'
import { Actions, State, ContextType } from './types'

const initialState: State = {
  isInitialized: false,
  currentStep: 0,
  teamId: null,
  tokenId: null,
  userName: '',
  minimumCakeRequired: new BigNumber(5).multipliedBy(new BigNumber(10).pow(18)), // 5 CAKE
  allowance: new BigNumber(25).multipliedBy(new BigNumber(10).pow(18)), // 25 CAKE
}

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'initialize':
      return {
        ...state,
        isInitialized: true,
        currentStep: action.step,
      }
    case 'next_step':
      return {
        ...state,
        currentStep: state.currentStep + 1,
      }
    case 'set_team':
      return {
        ...state,
        teamId: action.teamId,
      }
    case 'set_tokenid':
      return {
        ...state,
        tokenId: action.tokenId,
      }
    case 'set_username':
      return {
        ...state,
        userName: action.userName,
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
      const bunnyFactoryContract = getBunnyFactoryContract()
      const canMint = await bunnyFactoryContract.methods.canMint(account).call()
      dispatch({ type: 'initialize', step: canMint ? 0 : 1 })
    }

    if (account) {
      fetchData()
    }
  }, [account, dispatch])

  const actions: ContextType['actions'] = useMemo(
    () => ({
      nextStep: () => dispatch({ type: 'next_step' }),
      setTeamId: (teamId: number) => dispatch({ type: 'set_team', teamId }),
      setTokenId: (tokenId: number) => dispatch({ type: 'set_tokenid', tokenId }),
      setUserName: (userName: string) => dispatch({ type: 'set_username', userName }),
    }),
    [dispatch],
  )

  return <ProfileCreationContext.Provider value={{ ...state, actions }}>{children}</ProfileCreationContext.Provider>
}

export default ProfileCreationProvider
