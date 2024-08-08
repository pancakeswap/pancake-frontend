import { createContext, useEffect, useMemo, useReducer } from 'react'
import { getBunnyFactoryContract } from 'utils/contractHelpers'
import { Address } from 'viem'
import { useAccount } from 'wagmi'
import { ALLOWANCE_MULTIPLIER, MINT_COST, REGISTER_COST } from '../config'
import { Actions, ContextType, State } from './types'

const totalCost = MINT_COST + REGISTER_COST
const allowance = totalCost * ALLOWANCE_MULTIPLIER

const initialState: State = {
  isInitialized: false,
  currentStep: 0,
  teamId: undefined,
  selectedNft: {
    collectionAddress: undefined,
    tokenId: undefined,
  },
  userName: '',
  minimumCakeRequired: totalCost,
  allowance,
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
    case 'set_selected_nft':
      return {
        ...state,
        selectedNft: {
          tokenId: action.tokenId,
          collectionAddress: action.collectionAddress,
        },
      }
    case 'set_username':
      return {
        ...state,
        userName: action.userName!,
      }
    default:
      return state
  }
}

export const ProfileCreationContext = createContext<ContextType | null>(null)

const ProfileCreationProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { address: account } = useAccount()

  // Initial checks
  useEffect(() => {
    let isSubscribed = true

    const fetchData = async () => {
      if (!account) return
      const bunnyFactoryContract = getBunnyFactoryContract()
      const canMint = await bunnyFactoryContract.read.canMint([account])
      dispatch({ type: 'initialize', step: canMint ? 0 : 1 })

      // When changing wallets quickly unmounting before the hasClaim finished causes a React error
      if (isSubscribed) {
        dispatch({ type: 'initialize', step: canMint ? 0 : 1 })
      }
    }

    if (account) {
      fetchData()
    }

    return () => {
      isSubscribed = false
    }
  }, [account, dispatch])

  const actions: ContextType['actions'] = useMemo(
    () => ({
      nextStep: () => dispatch({ type: 'next_step' }),
      setTeamId: (teamId: number) => dispatch({ type: 'set_team', teamId }),
      setSelectedNft: (tokenId: string, collectionAddress: Address) =>
        dispatch({ type: 'set_selected_nft', tokenId, collectionAddress }),
      setUserName: (userName: string) => dispatch({ type: 'set_username', userName }),
    }),
    [dispatch],
  )

  const providerValue = useMemo(() => ({ ...state, actions }), [state, actions])

  return <ProfileCreationContext.Provider value={providerValue}>{children}</ProfileCreationContext.Provider>
}

export default ProfileCreationProvider
