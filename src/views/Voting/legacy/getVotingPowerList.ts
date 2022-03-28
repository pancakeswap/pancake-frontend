/**
 * Legacy after block 16300686
 */
import BigNumber from 'bignumber.js'
import _chunk from 'lodash/chunk'
import { createPoolStrategy, snapshotStrategies } from './strategy'
import { PANCAKE_SPACE } from '../config'
import { getScores } from '../getScores'

const TEN_POW_18 = new BigNumber(10).pow(18)

type ScoresResponseByAddress = {
  [address: string]: number
}

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
      ifoPoolBalance: IFOPoolBalance.div(TEN_POW_18).toFixed(18),
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

export const getVotingPowerListMapTotal = async (voters: string[], poolAddresses: string[], blockNumber: number) => {
  const votingPowerList = await getVotingPowerList(voters, poolAddresses, blockNumber)
  const votingPowerListMap: { [key: string]: string } = {}
  votingPowerList.forEach((vp) => {
    votingPowerListMap[vp.voter] = vp?.total
  })
  return votingPowerListMap
}
