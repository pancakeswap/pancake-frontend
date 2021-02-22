import { Contract } from '@ethersproject/contracts'
import poolsConfig from 'config/constants/pools'
import masterChefABI from 'config/abi/masterchef.json'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import { QuoteToken } from 'config/constants/types'
import multicall from 'utils/multicall'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { httpProvider } from 'utils/erc20'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((p) => p.stakingTokenName !== QuoteToken.BNB)
const bnbPools = poolsConfig.filter((p) => p.stakingTokenName === QuoteToken.BNB)
const nonMasterPools = poolsConfig.filter((p) => p.sousId !== 0)
const masterChefContract = new Contract(getMasterChefAddress(), masterChefABI, httpProvider)

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((p) => ({
    address: p.stakingTokenAddress,
    name: 'allowance',
    params: [account, getAddress(p.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return nonBnbPools.reduce((acc, pool, index) => ({ ...acc, [pool.sousId]: allowances[index].toString() }), {})
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((p) => ({
    address: p.stakingTokenAddress,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: tokenBalancesRaw[index].toString() }),
    {},
  )

  // BNB pools
  const bnbBalance = await httpProvider.getBalance(account)
  const bnbBalances = bnbPools.reduce((acc, pool) => ({ ...acc, [pool.sousId]: bnbBalance.toString() }), {})

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(sousChefABI, calls)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: userInfo[index].amount.toString(),
    }),
    {},
  )

  // Cake / Cake pool
  const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  return { ...stakedBalances, 0: masterPoolAmount.toString() }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(sousChefABI, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: res[index].toString(),
    }),
    {},
  )

  // Cake / Cake pool
  const pendingReward = await masterChefContract.pendingCake('0', account)

  return { ...pendingRewards, 0: pendingReward.toString() }
}
