export type Actions =
  | { type: 'set_step'; step: number }
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
}

export interface ContextType extends State {
  nextStep: () => void
  setTeamId: (teamId: number) => void
  setTokenId: (tokenId: number) => void
  setUserName: (userName: string) => void
}
