import { request, gql } from 'graphql-request'
import { getCakeAddress } from 'utils/addressHelpers'
import { SNAPSHOT_API, SNAPSHOT_HUB_API, SNAPSHOT_VOTING_API } from 'config/constants/endpoints'
import { Proposal, ProposalState, ProposalType, Vote } from './types'
import { ADMIN_ADDRESS, PANCAKE_SPACE, SNAPSHOT_VERSION } from './config'

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

export interface Message {
  address: string
  msg: string
  sig: string
}

/**
 * Generates metadata required by snapshot to validate payload
 */
export const generateMetaData = () => {
  return {
    strategies: [{ name: PANCAKE_SPACE, params: { address: getCakeAddress(), chefAddresses: [] } }],
  }
}

/**
 * Returns data that is required on all snapshot payloads
 */
export const generatePayloadData = () => {
  return {
    version: SNAPSHOT_VERSION,
    timestamp: (Date.now() / 1e3).toFixed(),
    space: PANCAKE_SPACE,
  }
}

/**
 * General function to send commands to the snapshot api
 */
export const sendSnaphotData = async (message: Message) => {
  const response = await fetch(SNAPSHOT_HUB_API, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
  const data = await response.json()
  return data
}

export const saveVotingPower = async (account: string, proposal: string, power: string) => {
  const response = await fetch(SNAPSHOT_VOTING_API, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ account, proposal, power }),
  })
  const data = await response.json()
  return data
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
          metadata
        }
      }
    `,
    { first, skip, where },
  )
  return response.votes
}

interface VoteItem {
  _id: string
  address: string
  power: number
}

interface VotingResponse {
  code: number
  message: string
  data: VoteItem[]
}

export const getVoteCache = async (proposalId: string): Promise<{ [key: string]: number }> => {
  const response = await fetch(`${SNAPSHOT_VOTING_API}/${proposalId}`)
  const data: VotingResponse = await response.json()

  return data.data.reduce((accum, vote) => {
    return { ...accum, [vote.address]: vote.power }
  }, {})
}
