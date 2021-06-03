import { Pair, TokenAmount, Token } from '@pancakeswap-libs/sdk'
import BigNumber from 'bignumber.js'
import { getLpContract, getMasterchefContract } from 'utils/contractHelpers'
import farms from 'config/constants/farms'
import { getAddress, getCakeAddress } from 'utils/addressHelpers'
import tokens from 'config/constants/tokens'
import pools from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import multicall from './multicall'
import { getWeb3NoAccount } from './web3'
import { getBalanceAmount } from './formatBalance'

const chainId = parseInt(process.env.REACT_APP_CHAIN_ID, 10)
const cakeBnbPid = 251
const cakeBnbFarm = farms.find((farm) => farm.pid === cakeBnbPid)

const CAKE_TOKEN = new Token(chainId, getCakeAddress(), 18)
const WBNB_TOKEN = new Token(chainId, tokens.wbnb.address[chainId], 18)
const CAKE_BNB_TOKEN = new Token(chainId, getAddress(cakeBnbFarm.lpAddresses), 18)

/**
 * Returns the total CAKE staked in the CAKE-BNB LP
 */
export const getUserStakeInCakeBnbLp = async (account: string, block?: number) => {
  try {
    const masterContract = getMasterchefContract()
    const cakeBnbContract = getLpContract(getAddress(cakeBnbFarm.lpAddresses))
    const totalSupplyLP = await cakeBnbContract.methods.totalSupply().call(undefined, block)
    const reservesLP = await cakeBnbContract.methods.getReserves().call(undefined, block)
    const cakeBnbBalance = await masterContract.methods.userInfo(cakeBnbPid, account).call(undefined, block)

    const pair: Pair = new Pair(
      new TokenAmount(CAKE_TOKEN, reservesLP._reserve0.toString()),
      new TokenAmount(WBNB_TOKEN, reservesLP._reserve1.toString()),
    )
    const cakeLPBalance = pair.getLiquidityValue(
      pair.token0,
      new TokenAmount(CAKE_BNB_TOKEN, totalSupplyLP.toString()),
      new TokenAmount(CAKE_BNB_TOKEN, cakeBnbBalance.amount.toString()),
      false,
    )

    return cakeLPBalance.toSignificant(18)
  } catch (error) {
    console.error(`CAKE-BNB LP error: ${error}`)
    return 0
  }
}

/**
 * Gets the cake staked in the main pool
 */
export const getUserStakeInCakePool = async (account: string, block?: number) => {
  try {
    const masterContract = getMasterchefContract()
    const response = await masterContract.methods.userInfo(0, account).call(undefined, block)

    return getBalanceAmount(new BigNumber(response.amount)).toNumber()
  } catch (error) {
    console.error('Error getting stake in CAKE pool', error)
    return 0
  }
}

/**
 * Returns total staked value of active pools
 */
export const getUserStakeInPools = async (account: string) => {
  try {
    const web3 = getWeb3NoAccount()
    const eligiblePools = pools
      .filter((pool) => pool.sousId !== 0)
      .filter((pool) => pool.isFinished === false || pool.isFinished === undefined)

    // Get the ending block is eligible pools
    const calls = eligiblePools.map((eligiblePool) => ({
      address: getAddress(eligiblePool.contractAddress),
      name: 'bonusEndBlock',
    }))
    const currentBlock = await web3.eth.getBlockNumber()
    const ends = await multicall(sousChefABI, calls)

    // Filter out pools that have ended
    const activePools = eligiblePools.filter((eligiblePool, index) => {
      const endBlock = new BigNumber(ends[index])
      return endBlock.gt(currentBlock)
    })

    // Get the user info of each pool
    const userInfoCalls = activePools.map((activePool) => ({
      address: getAddress(activePool.contractAddress),
      name: 'userInfo',
      params: [account],
    }))
    const userInfos = await multicall(sousChefABI, userInfoCalls)

    return userInfos
      .reduce((accum: BigNumber, userInfo) => {
        return accum.plus(new BigNumber(userInfo.amount._hex))
      }, new BigNumber(0))
      .toNumber()
  } catch (error) {
    console.error('Coult not fetch staked value in pools', error)
    return 0
  }
}
