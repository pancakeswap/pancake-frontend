import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { bscRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
const nonMasterPools = poolsConfig.filter((pool) => pool.sousId !== 0)

export const fetchPoolsAllowance = async (
  account: string,
  fetchPoolOrPools: 'finishedPools' | 'nonFinishedPools' | number,
) => {
  const calls = nonBnbPools
    .filter((p) => {
      if (!isUndefinedOrNull(fetchPoolOrPools)) {
        if (fetchPoolOrPools === 'finishedPools') {
          return p.isFinished
        }
        if (fetchPoolOrPools === 'nonFinishedPools') {
          return !p.isFinished
        }
        if (Number.isFinite(fetchPoolOrPools)) {
          return p.sousId === fetchPoolOrPools
        }
      }
      return true
    })
    .map((pool) => ({
      address: pool.stakingToken.address,
      name: 'allowance',
      params: [account, getAddress(pool.contractAddress)],
    }))

  const allowances = await multicall(erc20ABI, calls)
  return fromPairs(nonBnbPools.map((pool, index) => [pool.sousId, new BigNumber(allowances[index]).toJSON()]))
}

export const fetchUserBalances = async (
  account: string,
  fetchPoolOrPools: 'finishedPools' | 'nonFinishedPools' | number,
) => {
  // Non BNB pools
  const tokens = uniq(
    nonBnbPools
      .filter((p) => {
        if (!isUndefinedOrNull(fetchPoolOrPools)) {
          if (fetchPoolOrPools === 'finishedPools') {
            return p.isFinished
          }
          if (fetchPoolOrPools === 'nonFinishedPools') {
            return !p.isFinished
          }
          if (Number.isFinite(fetchPoolOrPools)) {
            return p.sousId === fetchPoolOrPools
          }
        }
        return true
      })
      .map((pool) => pool.stakingToken.address),
  )
  const calls = tokens.map((token) => ({
    address: token,
    name: 'balanceOf',
    params: [account],
  }))
  const filteredBnbPools = bnbPools.filter((p) => {
    if (!isUndefinedOrNull(fetchPoolOrPools)) {
      if (fetchPoolOrPools === 'finishedPools') {
        return p.isFinished
      }
      if (fetchPoolOrPools === 'nonFinishedPools') {
        return !p.isFinished
      }
      if (Number.isFinite(fetchPoolOrPools)) {
        return p.sousId === fetchPoolOrPools
      }
    }
    return true
  })
  const [tokenBalancesRaw, bnbBalance] = await Promise.all([
    multicall(erc20ABI, calls),
    filteredBnbPools.length ? bscRpcProvider.getBalance(account) : Promise.resolve(null),
  ])
  const tokenBalances = fromPairs(tokens.map((token, index) => [token, tokenBalancesRaw[index]]))

  const poolTokenBalances = fromPairs(
    nonBnbPools
      .map((pool) => {
        if (!tokenBalances[pool.stakingToken.address]) return null
        return [pool.sousId, new BigNumber(tokenBalances[pool.stakingToken.address]).toJSON()]
      })
      .filter(Boolean),
  )

  // BNB pools
  const bnbBalanceJson = bnbBalance ? new BigNumber(bnbBalance.toString()).toJSON() : null
  const bnbBalances = fromPairs(filteredBnbPools.map((pool) => [pool.sousId, bnbBalanceJson]))

  return { ...poolTokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account: string, sousId: number = null) => {
  const calls = nonMasterPools
    .filter((p) => (!isUndefinedOrNull(sousId) ? p.sousId === sousId : true))
    .map((p) => ({
      address: getAddress(p.contractAddress),
      name: 'userInfo',
      params: [account],
    }))
  const userInfo = await multicall(sousChefABI, calls)
  return fromPairs(
    nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(userInfo[index].amount._hex).toJSON()]),
  )
}

export const fetchUserPendingRewards = async (
  account: string,
  fetchPoolOrPools: 'finishedPools' | 'nonFinishedPools' | number,
) => {
  const calls = nonMasterPools
    .filter((p) => {
      if (!isUndefinedOrNull(fetchPoolOrPools)) {
        if (fetchPoolOrPools === 'finishedPools') {
          return p.isFinished
        }
        if (fetchPoolOrPools === 'nonFinishedPools') {
          return !p.isFinished
        }
        if (Number.isFinite(fetchPoolOrPools)) {
          return p.sousId === fetchPoolOrPools
        }
      }
      return true
    })
    .map((p) => ({
      address: getAddress(p.contractAddress),
      name: 'pendingReward',
      params: [account],
    }))
  const res = await multicall(sousChefABI, calls)
  return fromPairs(nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(res[index]).toJSON()]))
}
