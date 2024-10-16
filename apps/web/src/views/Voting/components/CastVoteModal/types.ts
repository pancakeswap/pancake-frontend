import { InjectedModalProps } from '@pancakeswap/uikit'
import { ProposalTypeName } from 'state/types'

export enum ConfirmVoteView {
  MAIN = 'main',
  DETAILS = 'details',
}

export interface CastVoteModalProps extends InjectedModalProps {
  onSuccess: () => Promise<void>
  proposalId: string
  vote: {
    label: string
    value: number
  }
  block?: number
  voteType: ProposalTypeName
}
