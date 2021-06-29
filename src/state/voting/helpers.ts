import request, { gql } from 'graphql-request'
import { SNAPSHOT_API, SNAPSHOT_VOTING_API } from 'config/constants/endpoints'
import { Proposal, ProposalState, Vote, VoteWhere } from 'state/types'
import { archiveRpcProvider } from 'utils/providers'

export const getProposals = async (first = 5, skip = 0, state = ProposalState.ACTIVE): Promise<Proposal[]> => {
  const response: { proposals: Proposal[] } = await request(
    SNAPSHOT_API,
    gql`
      query getProposals($first: Int!, $skip: Int!, $state: String!) {
        proposals(first: $first, skip: $skip, where: { space_in: "cake.eth", state: $state }) {
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
          metadata
        }
      }
    `,
    { first, skip, where },
  )
  return response.votes
}

export const getAllVotes = async (proposalId: string, block?: number, votesPerChunk = 1000): Promise<Vote[]> => {
  const blockNumber = block || (await archiveRpcProvider.getBlockNumber())
  return new Promise((resolve, reject) => {
    let votes: Vote[] = []

    const fetchVoteChunk = async (newSkip: number) => {
      try {
        const voteChunk = await getVotes(votesPerChunk, newSkip, { proposal: proposalId })

        if (voteChunk.length === 0) {
          // Verify all the votes
          const votesToVerify = votes.map((vote) => ({
            address: vote.voter,
            verificationHash: vote.metadata?.verificationHash,
            total: vote.metadata?.votingPower,
          }))
          const response = await fetch(`${SNAPSHOT_VOTING_API}/verify`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              block: blockNumber,
              votes: votesToVerify,
            }),
          })

          if (!response.ok) {
            throw new Error(response.statusText)
          }

          const data = await response.json()
          const verifiedVotes = votes.filter((vote) => {
            return data.data[vote.voter.toLowerCase()]?.isValid === true
          })

          resolve(verifiedVotes)
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
}
