import { getCakeAddress } from 'utils/addressHelpers'
import { SNAPSHOT_HUB_API, SNAPSHOT_VOTING_API } from 'config/constants/endpoints'
import { Proposal, ProposalState, ProposalType } from 'state/types'
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

export const filterProposalsByState = (proposals: Proposal[], state: ProposalState) => {
  return proposals.filter((proposal) => proposal.state === state)
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

export const getVotingPower = async (account: string, poolAddresses: string[], block?: number) => {
  const response = await fetch(SNAPSHOT_VOTING_API, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: account,
      block,
      poolAddresses,
    }),
  })
  const data = await response.json()
  return data.data
}
