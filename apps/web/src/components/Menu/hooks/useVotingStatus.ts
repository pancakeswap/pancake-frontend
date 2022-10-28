import useSWRImmutable from 'swr/immutable'
import { ProposalState } from 'state/types'
import request, { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import { PANCAKE_SPACE, ADMINS } from 'views/Voting/config'

export const getActiveCoreProposal = async (): Promise<string[]> => {
  const response = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!, $admins: [String]!) {
        proposals(first: $first, skip: $skip, where: { author_in: $admins, space_in: "${PANCAKE_SPACE}", state: $state }) {
          id
        }
      }
    `,
    { first: 1, skip: 0, state: ProposalState.ACTIVE, admins: ADMINS },
  )
  return response.proposals
}

export const useVotingStatus = () => {
  const { data: proposals = [] } = useSWRImmutable('anyActiveCoreProposals', getActiveCoreProposal)

  return Boolean(proposals.length)
}
