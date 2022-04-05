import BigNumber from 'bignumber.js'
import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import tokens from 'config/constants/tokens'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { snapshotStrategies, createPoolStrategy } from 'config/constants/snapshot'
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

const TEN_POW_18 = new BigNumber(10).pow(18)

type GetScoresResponse = ScoresResponseByAddress[]
type ScoresListIndex = {
  cakeBalances: number
  cakeVaultShares: number
  cakeVaultPricePerFullShares: number
  ifoPoolShares: number
  ifoPoolPricePerFullShares: number
  userStakeInCakePools: number
  cakeBnbLpBalances: number
}

function calculateVotingPowerPools(scoresList: GetScoresResponse, voters: string[]) {
  return voters.reduce<{ [key: string]: BigNumber }>((acc, cur) => {
    let poolsBalance = new BigNumber(0)
    for (let i = 0; i < scoresList.length; i++) {
      const currentPoolBalance = scoresList[i][cur] ? new BigNumber(scoresList[i][cur]) : new BigNumber(0)
      poolsBalance = poolsBalance.plus(currentPoolBalance)
    }
    return { ...acc, [cur]: poolsBalance }
  }, {})
}

function calculateVotingPower(scoresList: GetScoresResponse, voters: string[], scoresListIndex: ScoresListIndex) {
  let [
    cakeBalances,
    cakeVaultShares,
    cakeVaultPricePerFullShares,
    ifoPoolShares,
    ifoPoolPricePerFullShares,
    userStakeInCakePools,
    cakeBnbLpBalances,
  ] = new Array(9)
  const defaultScore = {}
  // TODO: refactor this
  for (let i = 0; i < voters.length; i++) {
    defaultScore[voters[i]] = 0
  }
  cakeBalances = scoresListIndex.cakeBalances > -1 ? scoresList[scoresListIndex.cakeBalances] : defaultScore
  cakeVaultShares = scoresListIndex.cakeVaultShares > -1 ? scoresList[scoresListIndex.cakeVaultShares] : defaultScore
  cakeVaultPricePerFullShares =
    scoresListIndex.cakeVaultPricePerFullShares > -1
      ? scoresList[scoresListIndex.cakeVaultPricePerFullShares]
      : defaultScore
  ifoPoolShares = scoresListIndex.ifoPoolShares > -1 ? scoresList[scoresListIndex.ifoPoolShares] : defaultScore
  ifoPoolPricePerFullShares =
    scoresListIndex.ifoPoolPricePerFullShares > -1
      ? scoresList[scoresListIndex.ifoPoolPricePerFullShares]
      : defaultScore
  userStakeInCakePools =
    scoresListIndex.userStakeInCakePools > -1 ? scoresList[scoresListIndex.userStakeInCakePools] : defaultScore

  cakeBnbLpBalances =
    scoresListIndex.cakeBnbLpBalances > -1 ? scoresList[scoresListIndex.cakeBnbLpBalances] : defaultScore

  const result = voters.map((address) => {
    const cakeBalance = new BigNumber(cakeBalances[address] || 0)
    // calculate cakeVaultBalance
    const sharePrice = new BigNumber(cakeVaultPricePerFullShares[address] || 0).div(TEN_POW_18)
    const cakeVaultBalance = new BigNumber(cakeVaultShares[address] || 0).times(sharePrice)

    // calculate ifoPoolBalance
    const IFOPoolsharePrice = new BigNumber(ifoPoolPricePerFullShares[address] || 0).div(TEN_POW_18)
    const IFOPoolBalance = new BigNumber(ifoPoolShares[address] || 0).times(IFOPoolsharePrice)

    const cakePoolBalance = new BigNumber(userStakeInCakePools[address] || 0)
    // calculate cakeBnbLpBalance
    const cakeBnbLpBalance = cakeBnbLpBalances[address] || 0

    const total = cakeBalance
      .plus(cakeVaultBalance)
      .plus(cakePoolBalance)
      .plus(IFOPoolBalance)
      .plus(new BigNumber(cakeBnbLpBalance).times(TEN_POW_18))

    return {
      cakeBalance: cakeBalance.div(TEN_POW_18).toFixed(18),
      cakeVaultBalance: cakeVaultBalance.div(TEN_POW_18).toFixed(18),
      IFOPoolBalance: IFOPoolBalance.div(TEN_POW_18).toFixed(18),
      cakePoolBalance: cakePoolBalance.div(TEN_POW_18).toFixed(18),
      cakeBnbLpBalance,
      total,
      voter: address,
    }
  })
  return result
}

const ContractDeployedNumber = {
  Cake: 693963,
  CakeVault: 6975840,
  IFOPool: 13463954,
  MasterChef: 699498,
  CakeLp: 6810706,
}

function verifyDefaultContract(blockNumber: number) {
  return {
    Cake: ContractDeployedNumber.Cake < blockNumber,
    CakeVault: ContractDeployedNumber.CakeVault < blockNumber,
    IFOPool: ContractDeployedNumber.IFOPool < blockNumber,
    MasterChef: ContractDeployedNumber.MasterChef < blockNumber,
    CakeLp: ContractDeployedNumber.CakeLp < blockNumber,
  }
}

export async function getVotingPowerList(voters: string[], poolAddresses: string[], blockNumber: number) {
  const poolsStrategyList = poolAddresses.map((address) => createPoolStrategy(address))
  const contractsValid = verifyDefaultContract(blockNumber)
  const scoresListIndex = {
    cakeBalances: -1,
    cakeVaultShares: -1,
    cakeVaultPricePerFullShares: -1,
    ifoPoolShares: -1,
    ifoPoolPricePerFullShares: -1,
    userStakeInCakePools: -1,
    cakeBnbLpBalances: -1,
  }
  const defaultStrategy = []
  let indexCounter = 0
  if (contractsValid.Cake) {
    defaultStrategy.push(snapshotStrategies.CakeBalanceStrategy)
    scoresListIndex.cakeBalances = indexCounter++
  }
  if (contractsValid.CakeVault) {
    defaultStrategy.push(snapshotStrategies.CakeVaultSharesStrategy)
    scoresListIndex.cakeVaultShares = indexCounter++
    defaultStrategy.push(snapshotStrategies.CakeVaultPricePerFullShareStrategy)
    scoresListIndex.cakeVaultPricePerFullShares = indexCounter++
  }
  if (contractsValid.IFOPool) {
    defaultStrategy.push(snapshotStrategies.IFOPoolSharesStrategy)
    scoresListIndex.ifoPoolShares = indexCounter++
    defaultStrategy.push(snapshotStrategies.IFOPoolPricePerFullShareStrategy)
    scoresListIndex.ifoPoolPricePerFullShares = indexCounter++
  }
  if (contractsValid.MasterChef) {
    defaultStrategy.push(snapshotStrategies.UserStakeInCakePoolStrategy)
    scoresListIndex.userStakeInCakePools = indexCounter++
  }
  if (contractsValid.CakeLp) {
    defaultStrategy.push(snapshotStrategies.CakeBnbMasterChefStrategy)
    scoresListIndex.cakeBnbLpBalances = indexCounter++
  }

  const network = '56'
  const chunkPools = _chunk(poolsStrategyList, 8)
  const finalVotingPowerPools: { [key: string]: BigNumber } = {}
  // eslint-disable-next-line no-restricted-syntax
  for (const chunkPool of chunkPools) {
    // eslint-disable-next-line no-await-in-loop
    const poolStrategyResponse = await getScores(PANCAKE_SPACE, chunkPool, network, voters, blockNumber)
    const votingPowerPools = calculateVotingPowerPools(poolStrategyResponse, voters)
    Object.entries(votingPowerPools).forEach(([key, value]) => {
      if (finalVotingPowerPools[key]) {
        finalVotingPowerPools[key] = finalVotingPowerPools[key].plus(value)
      } else {
        finalVotingPowerPools[key] = value
      }
    })
  }
  const strategyResponse = await getScores(PANCAKE_SPACE, defaultStrategy, network, voters, blockNumber)
  const votingPowerList = calculateVotingPower(strategyResponse, voters, scoresListIndex)
  return votingPowerList.map((vp) => {
    if (finalVotingPowerPools[vp.voter]) {
      return {
        ...vp,
        poolsBalance: finalVotingPowerPools[vp.voter].div(TEN_POW_18).toFixed(18),
        total: vp.total.plus(finalVotingPowerPools[vp.voter]).div(TEN_POW_18).toFixed(18),
      }
    }
    return { ...vp, total: vp.total.div(TEN_POW_18).toFixed(18), poolsBalance: '0' }
  })
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
