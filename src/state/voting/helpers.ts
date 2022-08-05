/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { SNAPSHOT_API } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getVotingPowerByCakeStrategy } from 'views/Voting/helpers'
import { Proposal, ProposalState, Vote, VoteWhere } from 'state/types'
import _chunk from 'lodash/chunk'

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
    { first, skip, state, orderDirection: state === ProposalState.CLOSED ? 'desc' : 'asc' },
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
          votes
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

const CHUNK_SIZE = 150
export const getVotes = async (first: number, skip: number, where: VoteWhere): Promise<Vote[]> => {
  const response: { votes: Vote[] } = await request(
    SNAPSHOT_API,
    gql`
      query getVotes($first: Int, $skip: Int, $where: VoteWhere) {
        votes(first: $first, skip: $skip, where: $where) {
          id
          voter
          created
          choice
          space {
            id
            name
          }
          proposal {
            choices
          }
        }
      }
    `,
    { first, skip, where },
  )
  return response.votes
}

export const getAllVotes = async (proposal: Proposal, votesPerChunk = 30000): Promise<Vote[]> => {
  const voters = await new Promise<Vote[]>((resolve, reject) => {
    let votes: Vote[] = []

    const fetchVoteChunk = async (newSkip: number) => {
      try {
        const voteChunk = await getVotes(votesPerChunk, newSkip, { proposal: proposal.id })

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

  const voterChunk = _chunk(
    voters.map((v) => v.voter),
    CHUNK_SIZE,
  )

  let votingPowers = {}

  const vps = await Promise.all(voterChunk.map((v) => getVotingPowerByCakeStrategy(v, parseInt(proposal.snapshot))))

  for (const vp of vps) {
    votingPowers = {
      ...votingPowers,
      ...vp,
    }
  }

  return voters.map((v) => ({
    ...v,
    metadata: {
      votingPower: votingPowers[v.voter] || '0',
    },
  }))
}
