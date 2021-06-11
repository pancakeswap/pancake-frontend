import request, { gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import { Proposal, ProposalState } from 'state/types'

export const getProposals = async (first = 5, skip = 0, state = ProposalState.ACTIVE): Promise<Proposal[]> => {
  const response: { proposals: Proposal[] } = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!) {
        proposals(first: $first, skip: $skip, where: { space_in: "pancake", state: $state }) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          space {
            id
            name
          }
        }
      }
    `,
    { first, skip, state },
  )
  return response.proposals
}

export const getProposal = async (id: string): Promise<Proposal> => {
  const response: { proposal: Proposal } = await request(
    SNAPSHOT_API,
    gql`
      query getProposal($id: String) {
        proposal(id: $id) {
          id
          title
          body
          choices
          start
          end
          snapshot
          state
          author
          space {
            id
            name
          }
        }
      }
    `,
    { id },
  )
  return response.proposal
}
