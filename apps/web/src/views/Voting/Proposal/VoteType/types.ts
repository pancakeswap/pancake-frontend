export interface SingleVoteState {
  label: string
  value: number
}

export interface WeightedVoteState {
  [key: string]: number
}

export type VoteState = SingleVoteState | WeightedVoteState
