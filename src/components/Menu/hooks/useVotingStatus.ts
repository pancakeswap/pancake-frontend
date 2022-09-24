import useSWRImmutable from 'swr/immutable'
import { ProposalState } from 'state/types'
import request, { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import { PANCAKE_SPACE } from 'views/Voting/config'

export const getActiveProposal = async (): Promise<string[]> => {
  const response = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!) {
        proposals(first: $first, skip: $skip, where: { space_in: "${PANCAKE_SPACE}", state: $state }) {
          id
        }
      }
    `,
    { first: 1, skip: 0, state: ProposalState.ACTIVE },
  )
  return response.proposals
}

export const useVotingStatus = () => {
  const { data: proposals = [] } = useSWRImmutable('anyActiveProposals', getActiveProposal)

  return Boolean(proposals.length)
}
