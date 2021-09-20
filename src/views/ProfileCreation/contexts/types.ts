import { ethers } from 'ethers'

export type Actions =
  | { type: 'next_step' }
  | { type: 'set_team'; teamId: number }
  | { type: 'set_selected_nft'; nftAddress: string; tokenId: string }
  | { type: 'set_username'; userName: string | null }
  | { type: 'initialize'; step: number }

export interface State {
  isInitialized: boolean
  currentStep: number
  teamId: number
  selectedNft: {
    tokenId: string
    nftAddress: string
  }
  userName: string
  minimumCakeRequired: ethers.BigNumber
  allowance: ethers.BigNumber
}

export interface ContextType extends State {
  actions: {
    nextStep: () => void
    setTeamId: (teamId: number) => void
    setSelectedNft: (tokenId: string, nftAddress: string) => void
    setUserName: (userName: string) => void
  }
}
