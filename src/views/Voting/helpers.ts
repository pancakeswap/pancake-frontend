import { request, gql } from 'graphql-request'
import { SNAPSHOT_API } from 'config/constants/endpoints'
import { Proposal, ProposalState, ProposalType, Vote } from './types'
import { ADMIN_ADDRESS } from './config'

export const isCoreProposal = (proposal: Proposal) => {
  return proposal.author.toLowerCase() === ADMIN_ADDRESS.toLowerCase()
}

export const filterProposalsByType = (proposals: Proposal[], proposalType: ProposalType) => {
  switch (proposalType) {
    case ProposalType.COMMUNITY:
      return proposals.filter((proposal) => !isCoreProposal(proposal))
    case ProposalType.CORE:
      return proposals.filter((proposal) => isCoreProposal(proposal))
    case ProposalType.ALL:
    default:
      return proposals
  }
}

export const getProposals = async (first = 5, skip = 0, state = ProposalState.ACTIVE): Promise<Proposal[]> => {
  try {
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
  } catch (error) {
    throw new Error(error)
  }
}

export const getProposal = async (id: string): Promise<Proposal> => {
  try {
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
  } catch (error) {
    throw new Error(error)
  }
}

/* eslint-disable camelcase */
/**
 * @see https://hub.snapshot.page/graphql
 */
export interface VoteWhere {
  id?: string
  id_in?: string[]
  voter?: string
  voter_in?: string[]
  proposal?: string
  proposal_in?: string[]
}

export const getVotes = async (first: number, skip: number, where: VoteWhere): Promise<Vote[]> => {
  try {
    const response: { votes: Vote[] } = await request(
      SNAPSHOT_API,
      gql`
        query getVotes($first: Int, $skip: Int, $where: VoteWhere) {
          votes(first: $first, skip: $skip, where: $where) {
            id
            voter
            created
            proposal
            choice
            space {
              id
              name
            }
          }
        }
      `,
      { first, skip, where },
    )
    return response.votes
  } catch (error) {
    throw new Error(error)
  }
}
