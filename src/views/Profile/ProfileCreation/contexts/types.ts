export type Actions =
  | { type: 'set_step'; step: number }
  | { type: 'set_team'; teamId: number | null }
  | { type: 'set_bunny'; bunnyId: number | null }
  | { type: 'set_username'; userName: string | null }
  | { type: 'initialize'; step: number }

export interface State {
  isInitialized: boolean
  currentStep: number
  teamId: number | null
  bunnyId: number | null
  userName: string
}

export interface ContextType extends State {
  nextStep: () => void
  setTeamId: (teamId: number) => void
  setBunnyId: (bunnyId: number) => void
  setUserName: (userName: string) => void
}
