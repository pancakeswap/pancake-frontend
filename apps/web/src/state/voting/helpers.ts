/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { SNAPSHOT_API } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { Proposal, ProposalState, Vote, VoteWhere } from 'state/types'

export const getProposals = async (first = 5, skip = 0, state = ProposalState.ACTIVE): Promise<Proposal[]> => {
  const response: { proposals: Proposal[] } = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!, $orderDirection: OrderDirection) {
        proposals(
          first: $first
          skip: $skip
          orderBy: "end"
          orderDirection: $orderDirection
          where: { space_in: "cakevote.eth", state: $state }
        ) {
          id
          title
          start
          end
          state
          author
        }
      }
    `,
    { first, skip, state, orderDirection: state === ProposalState.CLOSED ? 'desc' : 'asc' },
  )
  return response.proposals
}

export const getProposal = async (id: string): Promise<Proposal> => {
  const response: { proposal: Proposal } = await request(
    SNAPSHOT_API,
    gql`
      query getProposal($id: String!) {
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
          votes
          ipfs
          scores
          scores_total
        }
      }
    `,
    { id },
  )
  return response.proposal
}

export const getVotes = async (
  first: number,
  skip: number,
  where: VoteWhere,
  orderby?: string,
  orderdirection?: 'asc' | 'desc',
): Promise<Vote[]> => {
  const hasOrderBy = orderby !== undefined
  const hasOrderDirection = orderdirection !== undefined

  const response: { votes: Vote[] } = await request(
    SNAPSHOT_API,
    gql`
      query getVotes($first: Int, $skip: Int, $where: VoteWhere ${hasOrderBy ? ', $orderby: String' : ''} ${
      hasOrderDirection ? ', $orderdirection: OrderDirection' : ''
    }) {
        votes(first: $first, skip: $skip, where: $where ${hasOrderBy ? ', orderBy: $orderby' : ''} ${
      hasOrderDirection ? ', orderDirection: $orderdirection' : ''
    }) {
          id
          voter
          created
          choice
          proposal {
            choices
          }
          vp
          ipfs
        }
      }
    `,
    {
      first,
      skip,
      where,
      ...(hasOrderBy && { orderby }),
      ...(hasOrderDirection && { orderdirection }),
    },
  )
  return response.votes
}

export const getNumberOfVotes = async (
  proposal: Proposal,
  totalVotesToFetch: number,
  voter?: `0x${string}`,
): Promise<Vote[]> => {
  try {
    const votes = await getVotes(totalVotesToFetch, 0, { proposal: proposal.id, ...(voter && { voter }) }, 'vp', 'desc')

    return votes.map((v) => ({
      ...v,
      metadata: {
        votingPower: String(v.vp) || '0',
      },
    }))
  } catch (error) {
    throw new Error(`Failed to fetch votes: ${error}`)
  }
}

export const getAllVotes = async (proposal: Proposal, votesPerChunk = 1000): Promise<Vote[]> => {
  const voters = await new Promise<Vote[]>((resolve, reject) => {
    let votes: Vote[] = []

    const fetchVoteChunk = async (newSkip: number) => {
      try {
        const voteChunk = await getVotes(votesPerChunk, newSkip, { proposal: proposal.id }, 'vp', 'desc')

        if (voteChunk.length === 0) {
          resolve(votes)
        } else {
          votes = [...votes, ...voteChunk]
          fetchVoteChunk(newSkip + votesPerChunk)
        }
      } catch (error) {
        reject(error)
      }
    }

    fetchVoteChunk(0)
  })

  return voters.map((v) => ({
    ...v,
    metadata: {
      votingPower: String(v.vp) || '0',
    },
  }))
}
