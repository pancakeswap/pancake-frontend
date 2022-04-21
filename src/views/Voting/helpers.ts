import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import tokens from 'config/constants/tokens'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import _chunk from 'lodash/chunk'
import { ADMINS, PANCAKE_SPACE, SNAPSHOT_VERSION } from './config'
import { getScores } from './getScores'
import * as strategies from './strategies'

export const isCoreProposal = (proposal: Proposal) => {
  return ADMINS.includes(proposal.author.toLowerCase())
}

export const filterProposalsByType = (proposals: Proposal[], proposalType: ProposalType) => {
  if (proposals) {
    switch (proposalType) {
      case ProposalType.COMMUNITY:
        return proposals.filter((proposal) => !isCoreProposal(proposal))
      case ProposalType.CORE:
        return proposals.filter((proposal) => isCoreProposal(proposal))
      case ProposalType.ALL:
      default:
        return proposals
    }
  } else {
    return []
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

const STRATEGIES = [{ name: 'cake', params: { symbol: 'CAKE', address: tokens.cake.address, decimals: 18 } }]
const NETWORK = '56'

/**
 * Generates metadata required by snapshot to validate payload
 */
export const generateMetaData = () => {
  return {
    plugins: {},
    network: 56,
    strategies: STRATEGIES,
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

export const VOTING_POWER_BLOCK = {
  v0: 16300686,
  v1: 17137653,
}

/**
 *  Get voting power by single user for each category
 */
export const getVotingPower = async (account: string, poolAddresses: string[], blockNumber?: number) => {
  if (blockNumber && blockNumber >= VOTING_POWER_BLOCK.v1) {
    const [cakeBalance, cakeBnbLpBalance, cakePoolBalance, poolsBalance, total] = await getScores(
      PANCAKE_SPACE,
      [
        strategies.cakeBalanceStrategy('v1'),
        strategies.cakeBnbLpBalanceStrategy('v1'),
        strategies.cakePoolBalanceStrategy('v1'),
        strategies.creatPoolsBalanceStrategy(poolAddresses, 'v1'),
        strategies.createTotalStrategy(poolAddresses, 'v1'),
      ],
      NETWORK,
      [account],
      blockNumber,
    )

    return {
      poolsBalance: poolsBalance[account] ? poolsBalance[account] : 0,
      total: total[account] ? total[account] : 0,
      cakeBalance: cakeBalance[account] ? cakeBalance[account] : 0,
      cakeVaultBalance: 0,
      ifoPoolBalance: 0,
      cakePoolBalance: cakePoolBalance[account] ? cakePoolBalance[account] : 0,
      cakeBnbLpBalance: cakeBnbLpBalance[account] ? cakeBnbLpBalance[account] : 0,
      voter: account,
    }
  }

  if (blockNumber && blockNumber >= VOTING_POWER_BLOCK.v0) {
    const [cakeBalance, cakeBnbLpBalance, cakePoolBalance, cakeVaultBalance, ifoPoolBalance, poolsBalance, total] =
      await getScores(
        PANCAKE_SPACE,
        [
          strategies.cakeBalanceStrategy('v0'),
          strategies.cakeBnbLpBalanceStrategy('v0'),
          strategies.cakePoolBalanceStrategy('v0'),
          strategies.cakeVaultBalanceStrategy,
          strategies.ifoPoolBalanceStrategy,
          strategies.creatPoolsBalanceStrategy(poolAddresses, 'v0'),
          strategies.createTotalStrategy(poolAddresses, 'v0'),
        ],
        NETWORK,
        [account],
        blockNumber,
      )

    return {
      poolsBalance: poolsBalance[account] ? poolsBalance[account] : 0,
      total: total[account] ? total[account] : 0,
      cakeBalance: cakeBalance[account] ? cakeBalance[account] : 0,
      cakeVaultBalance: cakeVaultBalance[account] ? cakeVaultBalance[account] : 0,
      ifoPoolBalance: ifoPoolBalance[account] ? ifoPoolBalance[account] : 0,
      cakePoolBalance: cakePoolBalance[account] ? cakePoolBalance[account] : 0,
      cakeBnbLpBalance: cakeBnbLpBalance[account] ? cakeBnbLpBalance[account] : 0,
      voter: account,
    }
  }

  const [total] = await getScores(PANCAKE_SPACE, STRATEGIES, NETWORK, [account], blockNumber)

  // just show 0 in each category at old snapshot
  return {
    poolsBalance: 0,
    total: total[account] ? total[account] : 0,
    cakeBalance: 0,
    cakeVaultBalance: 0,
    ifoPoolBalance: 0,
    cakePoolBalance: 0,
    cakeBnbLpBalance: 0,
    voter: account,
  }
}

export const calculateVoteResults = (votes: Vote[]): { [key: string]: Vote[] } => {
  if (votes) {
    return votes.reduce((accum, vote) => {
      const choiceText = vote.proposal.choices[vote.choice - 1]

      return {
        ...accum,
        [choiceText]: accum[choiceText] ? [...accum[choiceText], vote] : [vote],
      }
    }, {})
  }
  return {}
}

export const getTotalFromVotes = (votes: Vote[]) => {
  if (votes) {
    return votes.reduce((accum, vote) => {
      let power = parseFloat(vote.metadata?.votingPower)

      if (!power) {
        power = 0
      }

      return accum + power
    }, 0)
  }
  return 0
}

/**
 * Get voting power by a list of voters, only total
 */
export async function getVotingPowerByCakeStrategy(voters: string[], blockNumber: number) {
  const strategyResponse = await getScores(PANCAKE_SPACE, STRATEGIES, NETWORK, voters, blockNumber)

  const result = voters.reduce<Record<string, string>>((accum, voter) => {
    const defaultTotal = strategyResponse.reduce(
      (total, scoreList) => total + (scoreList[voter] ? scoreList[voter] : 0),
      0,
    )

    return {
      ...accum,
      [voter]: defaultTotal,
    }
  }, {})

  return result
}
