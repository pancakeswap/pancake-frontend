import { Address } from 'wagmi'

export type Actions =
  | { type: 'next_step' }
  | { type: 'set_team'; teamId: number }
  | { type: 'set_selected_nft'; collectionAddress: Address; tokenId: string }
  | { type: 'set_username'; userName: string | null }
  | { type: 'initialize'; step: number }

export interface State {
  isInitialized: boolean
  currentStep: number
  teamId: number
  selectedNft: {
    tokenId: string
    collectionAddress: Address
  }
  userName: string
  minimumCakeRequired: bigint
  allowance: bigint
}

export interface ContextType extends State {
  actions: {
    nextStep: () => void
    setTeamId: (teamId: number) => void
    setSelectedNft: (tokenId: string, collectionAddress: Address) => void
    setUserName: (userName: string) => void
  }
}
