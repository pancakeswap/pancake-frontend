import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import tokens from 'config/constants/tokens'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { multicallv2 } from 'utils/multicall'
import { formatEther } from '@ethersproject/units'
import _chunk from 'lodash/chunk'
import { ADMINS, PANCAKE_SPACE, SNAPSHOT_VERSION } from './config'

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

const votingPowerContractAddress = '0xc0FeBE244cE1ea66d27D23012B3D616432433F42'

const votingPowerAbi = [
  'function getCakeBalance(address _user) view returns (uint256)',
  'function getCakeBnbLpBalance(address _user) view returns (uint256)',
  'function getCakePoolBalance(address _user) view returns (uint256)',
  'function getCakeVaultBalance(address _user) view returns (uint256)',
  'function getIFOPoolBalancee(address _user) view returns (uint256)',
  'function getPoolsBalance(address _user, address[] _pools) view returns (uint256)',
  'function getVotingPower(address _user, address[] _pools) view returns (uint256)',
]

export const getVotingPower = async (account: string, poolAddresses: string[], blockNumber?: number) => {
  const calls = [
    'getCakeBalance',
    'getCakeBnbLpBalance',
    'getCakePoolBalance',
    'getCakeVaultBalance',
    'getIFOPoolBalancee',
  ].map((method) => {
    return {
      address: votingPowerContractAddress,
      name: method,
      params: [account],
    }
  })

  const poolCalls = ['getPoolsBalance', 'getVotingPower'].map((method) => {
    return {
      address: votingPowerContractAddress,
      name: method,
      params: [account, poolAddresses],
    }
  })

  const [
    [cakeBalance],
    [cakeBnbLpBalance],
    [cakePoolBalance],
    [cakeVaultBalance],
    [ifoPoolBalance],
    [poolsBalance],
    [total],
  ] = await multicallv2(votingPowerAbi, [...calls, ...poolCalls], {
    blockTag: blockNumber,
  })
  return {
    poolsBalance: formatEther(poolsBalance),
    total: formatEther(total),
    cakeBalance: formatEther(cakeBalance),
    cakeVaultBalance: formatEther(cakeVaultBalance),
    IFOPoolBalance: formatEther(ifoPoolBalance),
    cakePoolBalance: formatEther(cakePoolBalance),
    cakeBnbLpBalance: formatEther(cakeBnbLpBalance),
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

type ScoresResponseByAddress = {
  [address: string]: number
}

type GetScoresResponse = ScoresResponseByAddress[]

function createPoolStrategy(poolAddress) {
  return {
    name: 'contract-call',
    params: {
      address: poolAddress,
      decimals: 18,
      output: 'amount',
      methodABI: {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'userInfo',
        outputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardDebt',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    },
  }
}

function calculateVotingPowerPools(scoresList: GetScoresResponse, voters: string[]) {
  return voters.reduce<{ [key: string]: number }>((acc, cur) => {
    let poolsBalance = 0
    for (let i = 0; i < scoresList.length; i++) {
      const currentPoolBalance = scoresList[i][cur] || 0
      poolsBalance += currentPoolBalance
    }
    return { ...acc, [cur]: poolsBalance }
  }, {})
}

export async function getVotingPowerByCakeStrategy(voters: string[], poolAddresses: string[], blockNumber: number) {
  const network = '56'
  const poolsStrategyList = poolAddresses.map((address) => createPoolStrategy(address))
  const chunkPools = _chunk(poolsStrategyList, 8)
  const finalVotingPowerPools: { [key: string]: number } = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const chunkPool of chunkPools) {
    // eslint-disable-next-line no-await-in-loop
    const poolStrategyResponse = await getScores(PANCAKE_SPACE, chunkPool, network, voters, blockNumber)
    const votingPowerPools = calculateVotingPowerPools(poolStrategyResponse, voters)
    Object.entries(votingPowerPools).forEach(([key, value]) => {
      if (finalVotingPowerPools[key]) {
        // eslint-disable-next-line operator-assignment
        finalVotingPowerPools[key] = finalVotingPowerPools[key] + value
      } else {
        finalVotingPowerPools[key] = value
      }
    })
  }

  const strategyResponse = await getScores(PANCAKE_SPACE, STRATEGIES, network, voters, blockNumber)

  const result = voters.reduce<Record<string, string>>((accum, voter) => {
    const defaultTotal = strategyResponse.reduce((total, scoreList) => total + scoreList[voter], 0)

    return {
      ...accum,
      [voter]: finalVotingPowerPools[voter] ? finalVotingPowerPools[voter] + defaultTotal : 0 + defaultTotal,
    }
  }, {})

  return result
}

async function getScores(
  space: string,
  strategies: any[],
  network: string,
  addresses: string[],
  snapshot: number | string = 'latest',
  scoreApiUrl = 'https://score.snapshot.org/api/scores',
) {
  try {
    const params = {
      space,
      network,
      snapshot,
      strategies,
      addresses,
    }
    const res = await fetch(scoreApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ params }),
    })
    const obj = await res.json()
    return obj.result.scores
  } catch (e) {
    return Promise.reject(e)
  }
}
