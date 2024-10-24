import { InjectedModalProps } from '@pancakeswap/uikit'
import { Proposal, ProposalTypeName } from 'state/types'
import { VoteState } from 'views/Voting/Proposal/VoteType/types'

export enum ConfirmVoteView {
  MAIN = 'main',
  DETAILS = 'details',
}

export interface CastVoteModalProps extends InjectedModalProps {
  onSuccess: () => Promise<void>
  proposal: Proposal
  proposalId: string
  vote: VoteState
  block?: number
  voteType: ProposalTypeName
}
