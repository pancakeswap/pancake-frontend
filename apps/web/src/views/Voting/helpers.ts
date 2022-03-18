import BigNumber from 'bignumber.js'
import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import tokens from 'config/constants/tokens'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { snapshotStrategies, createPoolStrategy } from 'config/constants/snapshot'
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
  cakeBnbLpTotalSupplies: number
  cakeBnbLpReserve0s: number
  cakeBnbLpCakeBnbBalances: number
  poolStart: number
}

function calculateVotingPower(scoresList: GetScoresResponse, voters: string[], scoresListIndex: ScoresListIndex) {
  let [
    cakeBalances,
    cakeVaultShares,
    cakeVaultPricePerFullShares,
    ifoPoolShares,
    ifoPoolPricePerFullShares,
    userStakeInCakePools,
    cakeBnbLpTotalSupplies,
    cakeBnbLpReserve0s,
    cakeBnbLpCakeBnbBalances,
  ] = new Array(9)
  const defaultScore = {}
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
  cakeBnbLpTotalSupplies =
    scoresListIndex.cakeBnbLpTotalSupplies > -1 ? scoresList[scoresListIndex.cakeBnbLpTotalSupplies] : defaultScore
  cakeBnbLpReserve0s =
    scoresListIndex.cakeBnbLpReserve0s > -1 ? scoresList[scoresListIndex.cakeBnbLpReserve0s] : defaultScore
  cakeBnbLpCakeBnbBalances =
    scoresListIndex.cakeBnbLpCakeBnbBalances > -1 ? scoresList[scoresListIndex.cakeBnbLpCakeBnbBalances] : defaultScore

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
    const poolStartIndex = scoresListIndex.poolStart
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
    cakeBnbLpTotalSupplies: -1,
    cakeBnbLpReserve0s: -1,
    cakeBnbLpCakeBnbBalances: -1,
    poolStart: 0,
  }
  const defaultStrategy = []
  let indexCounter = 0
  if (contractsValid.Cake) {
    defaultStrategy.push(snapshotStrategies[0])
    scoresListIndex.cakeBalances = indexCounter++
  }
  if (contractsValid.CakeVault) {
    defaultStrategy.push(snapshotStrategies[1])
    scoresListIndex.cakeVaultShares = indexCounter++
    defaultStrategy.push(snapshotStrategies[2])
    scoresListIndex.cakeVaultPricePerFullShares = indexCounter++
  }
  if (contractsValid.IFOPool) {
    defaultStrategy.push(snapshotStrategies[3])
    scoresListIndex.ifoPoolShares = indexCounter++
    defaultStrategy.push(snapshotStrategies[4])
    scoresListIndex.ifoPoolPricePerFullShares = indexCounter++
  }
  if (contractsValid.MasterChef) {
    defaultStrategy.push(snapshotStrategies[5])
    scoresListIndex.userStakeInCakePools = indexCounter++
  }
  if (contractsValid.CakeLp) {
    defaultStrategy.push(snapshotStrategies[6])
    scoresListIndex.cakeBnbLpTotalSupplies = indexCounter++
    defaultStrategy.push(snapshotStrategies[7])
    scoresListIndex.cakeBnbLpReserve0s = indexCounter++
    defaultStrategy.push(snapshotStrategies[8])
    scoresListIndex.cakeBnbLpCakeBnbBalances = indexCounter++
  }
  scoresListIndex.poolStart = indexCounter

  const strategies = [...defaultStrategy, ...poolsStrategyList]
  const network = '56'
  const strategyResponse = await getScores(PANCAKE_SPACE, strategies, network, voters, blockNumber)
  const votingPowerList = calculateVotingPower(strategyResponse, voters, scoresListIndex)
  return votingPowerList
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
