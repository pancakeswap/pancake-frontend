import BigNumber from 'bignumber.js'
import { getCakeAddress } from 'utils/addressHelpers'
import { SNAPSHOT_HUB_API, SNAPSHOT_VOTING_API } from 'config/constants/endpoints'
import { BIG_ZERO } from 'utils/bigNumber'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { simpleRpcProvider } from 'utils/providers'
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
    plugins: {},
    network: 56,
    strategies: [{ name: 'cake', params: { symbol: 'CAKE', address: getCakeAddress(), decimals: 18 } }],
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
export const sendSnapshotData = async (message: Message) => {
  const response = await fetch(SNAPSHOT_HUB_API, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error_description)
  }

  const data = await response.json()
  return data
}

export const getVotingPower = async (account: string, poolAddresses: string[], block?: number) => {
  const blockNumber = block || (await simpleRpcProvider.getBlockNumber())
  const response = await fetch(`${SNAPSHOT_VOTING_API}/power`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address: account,
      block: blockNumber,
      poolAddresses,
    }),
  })
  const data = await response.json()
  return data.data
}

export const calculateVoteResults = (votes: Vote[]): { [key: string]: Vote[] } => {
  return votes.reduce((accum, vote) => {
    const choiceText = vote.proposal.choices[vote.choice - 1]

    return {
      ...accum,
      [choiceText]: accum[choiceText] ? [...accum[choiceText], vote] : [vote],
    }
  }, {})
}

export const getTotalFromVotes = (votes: Vote[]) => {
  return votes.reduce((accum, vote) => {
    const power = new BigNumber(vote.metadata?.votingPower)
    return accum.plus(power)
  }, BIG_ZERO)
}
