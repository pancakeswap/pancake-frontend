import useSWRImmutable from 'swr/immutable'
import { ProposalState } from 'state/types'
import request, { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'

export const getActiveProposal = async (): Promise<string[]> => {
  const response = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!) {
        proposals(first: $first, skip: $skip, where: { space_in: "cakevote.eth", state: $state }) {
          id
        }
      }
    `,
    { first: 1, skip: 0, state: ProposalState.ACTIVE },
  )
  return response.proposals
}

export const useVotingStatus = () => {
  const { data: proposals = [] } = useSWRImmutable(['proposals', ProposalState.ACTIVE], getActiveProposal)

  return Boolean(proposals.length)
}
