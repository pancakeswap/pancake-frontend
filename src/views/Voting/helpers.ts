import snapshot from '@snapshot-labs/snapshot.js'
import BigNumber from 'bignumber.js'
import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import tokens from 'config/constants/tokens'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import {
  CakeBalanceStrategy,
  CakeBnbLpCakeBnbBalanceStrategy,
  CakeBnbLpReserve0Strategy,
  CakeBnbLpTotalSupplyStrategy,
  CakeVaultPricePerFullShareStrategy,
  CakeVaultSharesStrategy,
  createPoolStrategy,
  IFOPoolPricePerFullShareStrategy,
  IFOPoolSharesStrategy,
  UserStakeInCakePoolStrategy,
} from 'config/constants/snapshot'
import { ADMINS, PANCAKE_SPACE, SNAPSHOT_VERSION } from './config'

export const isCoreProposal = (proposal: Proposal) => {
  return ADMINS.includes(proposal.author.toLowerCase())
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
    strategies: [{ name: 'cake', params: { symbol: 'CAKE', address: tokens.cake.address, decimals: 18 } }],
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

export const getVotingPower = async (account: string, poolAddresses: string[], blockNumber?: number) => {
  const votingPowerList = await getVotingPowerList([account], poolAddresses, blockNumber)
  return votingPowerList[0]
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
    let power = parseFloat(vote.metadata?.votingPower)

    if (!power) {
      power = 0
    }

    return accum + power
  }, 0)
}

type ScoresResponseByAddress = {
  [address: string]: number
}

const TEN_POW_18 = new BigNumber(10).pow(18)

type GetScoresResponse = ScoresResponseByAddress[]

function calculateVotingPower(scoresList: GetScoresResponse, voters: string[]) {
  const [
    cakeBalances,
    cakeVaultShares,
    cakeVaultPricePerFullShares,
    ifoPoolShares,
    ifoPoolPricePerFullShares,
    userStakeInCakePools,
    cakeBnbLpTotalSupplies,
    cakeBnbLpReserve0s,
    cakeBnbLpCakeBnbBalances,
  ] = scoresList

  const result = voters.map((address) => {
    const cakeBalance = new BigNumber(cakeBalances[address])
    // calculate cakeVaultBalance
    const sharePrice = new BigNumber(cakeVaultPricePerFullShares[address]).div(TEN_POW_18)
    const cakeVaultBalance = new BigNumber(cakeVaultShares[address]).times(sharePrice)

    // calculate ifoPoolBalance
    const IFOPoolsharePrice = new BigNumber(ifoPoolPricePerFullShares[address]).div(TEN_POW_18)
    const IFOPoolBalance = new BigNumber(ifoPoolShares[address]).times(IFOPoolsharePrice)

    const cakePoolBalance = new BigNumber(userStakeInCakePools[address])
    // calculate cakeBnbLpBalance
    const totalSupplyLP = new BigNumber(cakeBnbLpTotalSupplies[address])
    const cakeBnbLpReserve0 = new BigNumber(cakeBnbLpReserve0s[address])
    const cakeBnbLpCakeBnbBalance = new BigNumber(cakeBnbLpCakeBnbBalances[address])
    const cakeBnbLpBalance = cakeBnbLpCakeBnbBalance.times(cakeBnbLpReserve0).div(totalSupplyLP)

    // calculate poolsBalance
    const poolStartIndex = 9
    let poolsBalance = new BigNumber(0)
    for (let i = poolStartIndex; i < scoresList.length; i++) {
      const currentPoolBalance = new BigNumber(scoresList[i][address])
      poolsBalance = poolsBalance.plus(currentPoolBalance)
    }

    const total = cakeBalance
      .plus(cakeVaultBalance)
      .plus(cakePoolBalance)
      .plus(IFOPoolBalance)
      .plus(cakeBnbLpBalance)
      .plus(poolsBalance)
      .div(TEN_POW_18)
      .toFixed(18)
    return {
      cakeBalance: cakeBalance.div(TEN_POW_18).toFixed(18),
      cakeVaultBalance: cakeVaultBalance.div(TEN_POW_18).toFixed(18),
      IFOPoolBalance: IFOPoolBalance.div(TEN_POW_18).toFixed(18),
      cakePoolBalance: cakePoolBalance.div(TEN_POW_18).toFixed(18),
      cakeBnbLpBalance: cakeBnbLpBalance.div(TEN_POW_18).toFixed(18),
      poolsBalance: poolsBalance.div(TEN_POW_18).toFixed(18),
      total,
      voter: address,
    }
  })
  return result
}

export async function getVotingPowerList(voters: string[], poolAddresses: string[], blockNumber: number) {
  const poolsStrategyList = poolAddresses.map((address) => createPoolStrategy(address))
  const strategies = [
    CakeBalanceStrategy,
    CakeVaultSharesStrategy,
    CakeVaultPricePerFullShareStrategy,
    IFOPoolSharesStrategy,
    IFOPoolPricePerFullShareStrategy,
    UserStakeInCakePoolStrategy,
    CakeBnbLpTotalSupplyStrategy,
    CakeBnbLpReserve0Strategy,
    CakeBnbLpCakeBnbBalanceStrategy,
    ...poolsStrategyList,
  ]
  const network = '56'
  const strategyResponse = await snapshot.utils.getScores(PANCAKE_SPACE, strategies, network, voters, blockNumber)
  const votingPowerList = calculateVotingPower(strategyResponse, voters)
  return votingPowerList
}
