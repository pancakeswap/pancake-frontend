import { SNAPSHOT_API } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import keyBy from 'lodash/keyBy'
import { Proposal, ProposalState, Vote, VoteWhere } from 'state/types'
import { getAddress } from 'utils/addressHelpers'
import { getActivePools } from 'utils/calls/pools'
import { getVotingPowerList } from 'views/Voting/helpers'
import _chunk from 'lodash/chunk'
import _flatten from 'lodash/flatten'

export const getProposals = async (first = 5, skip = 0, state = ProposalState.ACTIVE): Promise<Proposal[]> => {
  const response: { proposals: Proposal[] } = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!) {
        proposals(
          first: $first
          skip: $skip
          orderBy: "end"
          orderDirection: asc
          where: { space_in: "cake.eth", state: $state }
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

const NUMBER_OF_VOTERS_PER_SNAPSHOT_REQUEST = 250

export const getAllVotes = async (proposalId: string, block?: number, votesPerChunk = 1000): Promise<Vote[]> => {
  const eligiblePools = await getActivePools(block)
  const poolAddresses = eligiblePools.map(({ contractAddress }) => getAddress(contractAddress))
  return new Promise((resolve, reject) => {
    let votes: Vote[] = []

    const fetchVoteChunk = async (newSkip: number) => {
      try {
        const voteChunk = await getVotes(votesPerChunk, newSkip, { proposal: proposalId })

        const voteChunkVoters = voteChunk.map((vote) => {
          return vote.voter
        })

        const snapshotVotersChunk = _chunk(voteChunkVoters, NUMBER_OF_VOTERS_PER_SNAPSHOT_REQUEST)

        const votingPowers = await Promise.all(
          snapshotVotersChunk.map((votersChunk) => getVotingPowerList(votersChunk, poolAddresses, block)),
        )

        const vpByVoter = keyBy(_flatten(votingPowers), 'voter')

        const voteChunkWithVP = voteChunk.map((vote) => {
          return {
            ...vote,
            metadata: {
              votingPower: vpByVoter[vote.voter]?.total,
            },
          }
        })

        if (voteChunk.length === 0) {
          resolve(votes)
        } else {
          votes = [...votes, ...voteChunkWithVP]
          fetchVoteChunk(newSkip + votesPerChunk)
        }
      } catch (error) {
        reject(error)
      }
    }

    fetchVoteChunk(0)
  })
}
