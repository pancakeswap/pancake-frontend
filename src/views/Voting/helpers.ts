import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import BigNumber from 'bignumber.js'
import { BIG_TEN } from 'utils/bigNumber'
import { bscTokens } from 'config/constants/tokens'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { getCakeVaultAddress } from 'utils/addressHelpers'
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

const STRATEGIES = [
  { name: 'cake', params: { symbol: 'CAKE', address: bscTokens.cake.address, decimals: 18, max: 300 } },
]
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
interface GetVotingPowerType {
  total: number
  voter: string
  poolsBalance?: number
  cakeBalance?: number
  cakePoolBalance?: number
  cakeBnbLpBalance?: number
  cakeVaultBalance?: number
  ifoPoolBalance?: number
  lockedCakeBalance?: number
  lockedEndTime?: number
}

export const getVotingPower = async (
  account: string,
  poolAddresses: string[],
  blockNumber?: number,
): Promise<GetVotingPowerType> => {
  if (blockNumber && (blockNumber >= VOTING_POWER_BLOCK.v0 || blockNumber >= VOTING_POWER_BLOCK.v1)) {
    const cakeVaultAddress = getCakeVaultAddress()
    const version = blockNumber >= VOTING_POWER_BLOCK.v1 ? 'v1' : 'v0'

    const [
      cakeBalance,
      cakeBnbLpBalance,
      cakePoolBalance,
      cakeVaultBalance,
      poolsBalance,
      total,
      lockedCakeBalance,
      lockedEndTime,
      ifoPoolBalance,
    ] = await getScores(
      PANCAKE_SPACE,
      [
        strategies.cakeBalanceStrategy(version),
        strategies.cakeBnbLpBalanceStrategy(version),
        strategies.cakePoolBalanceStrategy(version),
        strategies.cakeVaultBalanceStrategy(version),
        strategies.createPoolsBalanceStrategy(poolAddresses, version),
        strategies.createTotalStrategy(poolAddresses, version),
        strategies.lockedCake(cakeVaultAddress, 'lockedAmount'),
        strategies.lockedCake(cakeVaultAddress, 'lockEndTime'),
        strategies.ifoPoolBalanceStrategy,
      ],
      NETWORK,
      [account],
      blockNumber,
    )

    const versionOne =
      version === 'v0'
        ? {
            ifoPoolBalance: ifoPoolBalance[account] ? ifoPoolBalance[account] : 0,
          }
        : {}

    return {
      ...versionOne,
      voter: account,
      total: total[account] ? total[account] : 0,
      poolsBalance: poolsBalance[account] ? poolsBalance[account] : 0,
      cakeBalance: cakeBalance[account] ? cakeBalance[account] : 0,
      cakePoolBalance: cakePoolBalance[account] ? cakePoolBalance[account] : 0,
      cakeBnbLpBalance: cakeBnbLpBalance[account] ? cakeBnbLpBalance[account] : 0,
      cakeVaultBalance: cakeVaultBalance[account] ? cakeVaultBalance[account] : 0,
      lockedCakeBalance: lockedCakeBalance[account]
        ? new BigNumber(lockedCakeBalance[account]).div(BIG_TEN.pow(18)).toNumber()
        : 0,
      lockedEndTime: lockedEndTime[account] ? lockedEndTime[account] : 0,
    }
  }

  const [total] = await getScores(PANCAKE_SPACE, STRATEGIES, NETWORK, [account], blockNumber)

  return {
    total: total[account] ? total[account] : 0,
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
