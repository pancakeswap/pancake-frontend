import { useSelector } from 'react-redux'
import { State } from '../types'

// Voting
export const useGetProposals = () => {
  const proposals = useSelector((state: State) => state.voting.proposals)
  return Object.values(proposals)
}

export const useGetProposal = (proposalId: string) => {
  const proposal = useSelector((state: State) => state.voting.proposals[proposalId])
  return proposal
}

export const useGetVotes = (proposalId: string) => {
  const votes = useSelector((state: State) => state.voting.votes[proposalId])
  return votes ? votes.filter((vote) => vote._inValid !== true) : []
}

export const useGetVotingStateLoadingStatus = () => {
  const votingStatus = useSelector((state: State) => state.voting.voteLoadingStatus)
  return votingStatus
}

export const useGetProposalLoadingStatus = () => {
  const votingStatus = useSelector((state: State) => state.voting.proposalLoadingStatus)
  return votingStatus
}
