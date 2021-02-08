import BigNumber from 'bignumber.js'

export type Actions =
  | { type: 'next_step' }
  | { type: 'set_team'; teamId: number | null }
  | { type: 'set_tokenid'; tokenId: number | null }
  | { type: 'set_username'; userName: string | null }
  | { type: 'initialize'; step: number }

export interface State {
  isInitialized: boolean
  currentStep: number
  teamId: number | null
  tokenId: number | null
  userName: string
  minimumCakeRequired: BigNumber
  allowance: BigNumber
}

export interface ContextType extends State {
  actions: {
    nextStep: () => void
    setTeamId: (teamId: number) => void
    setTokenId: (tokenId: number) => void
    setUserName: (userName: string) => void
  }
}
