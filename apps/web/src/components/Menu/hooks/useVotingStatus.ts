import { useQuery } from '@tanstack/react-query'
import { ProposalState, Proposal } from 'state/types'
import request, { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import { PANCAKE_SPACE, ADMINS } from 'views/Voting/config'

export const getCoreProposal = async (type: ProposalState): Promise<Proposal[]> => {
  const response = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!, $admins: [String]!) {
        proposals(first: $first, skip: $skip, where: { author_in: $admins, space_in: "${PANCAKE_SPACE}", state: $state }) {
          id
        }
      }
    `,
    { first: 1, skip: 0, state: type, admins: ADMINS },
  )
  return response.proposals
}

export const useVotingStatus = () => {
  const { data: votingStatus = null } = useQuery({
    queryKey: ['anyActiveSoonCoreProposals'],

    queryFn: async () => {
      const activeProposals = await getCoreProposal(ProposalState.ACTIVE)
      if (activeProposals.length) {
        return 'vote_now'
      }
      const soonProposals = await getCoreProposal(ProposalState.PENDING)
      if (soonProposals.length) {
        return 'soon'
      }
      return null
    },

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
  return votingStatus
}
