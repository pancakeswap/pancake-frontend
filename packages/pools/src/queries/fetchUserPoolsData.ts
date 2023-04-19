import { createMulticall, multicallAddresses } from '@pancakeswap/multicall'
import multiCallAbi from '@pancakeswap/multicall/Multicall.json'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'

import { getPoolsConfig } from '../constants'
import sousChefABI from '../abis/ISousChef.json'
import erc20ABI from '../abis/IERC20.json'
import { OnChainProvider, SerializedPool } from '../types'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const getPoolsFactory = (filter: (pool: SerializedPool) => boolean) => (chainId: ChainId) => {
  const poolsConfig = getPoolsConfig(chainId)
  if (!poolsConfig) {
    throw new Error(`Unable to get pools config on chain ${chainId}`)
  }
  return poolsConfig.filter(filter)
}
const getNonBnbPools = getPoolsFactory((pool) => pool.stakingToken.symbol !== 'BNB')
const getBnbPools = getPoolsFactory((pool) => pool.stakingToken.symbol === 'BNB')
const getNonMasterPools = getPoolsFactory((pool) => pool.sousId !== 0)

interface FetchUserDataParams {
  account: string
  chainId: ChainId
  provider: OnChainProvider
}

export const fetchPoolsAllowance = async ({ account, chainId, provider }: FetchUserDataParams) => {
  const nonBnbPools = getNonBnbPools(chainId)
  const calls = nonBnbPools.map(({ contractAddress, stakingToken }) => ({
    address: stakingToken.address,
    name: 'allowance',
    params: [account, contractAddress],
  }))

  const { multicall } = createMulticall(provider)
  const allowances = await multicall(erc20ABI, calls, chainId)
  return fromPairs(nonBnbPools.map((pool, index) => [pool.sousId, new BigNumber(allowances[index]).toJSON()]))
}

export const fetchUserBalances = async ({ account, chainId, provider }: FetchUserDataParams) => {
  const nonBnbPools = getNonBnbPools(chainId)
  const bnbPools = getBnbPools(chainId)
  // Non BNB pools
  const tokens = uniq(nonBnbPools.map((pool) => pool.stakingToken.address))
  const tokenBalanceCalls = tokens.map((token) => ({
    abi: erc20ABI,
    address: token,
    name: 'balanceOf',
    params: [account],
  }))
  const bnbBalanceCall = {
    abi: multiCallAbi,
    address: multicallAddresses[chainId],
    name: 'getEthBalance',
    params: [account],
  }
  const { multicallv3 } = createMulticall(provider)
  const tokenBnbBalancesRaw = await multicallv3({ calls: [...tokenBalanceCalls, bnbBalanceCall], chainId })
  const bnbBalance = tokenBnbBalancesRaw.pop()
  const tokenBalances = fromPairs(tokens.map((token, index) => [token, tokenBnbBalancesRaw[index]]))

  const poolTokenBalances = fromPairs(
    nonBnbPools
      .map<[number, string] | null>((pool) => {
        if (!tokenBalances[pool.stakingToken.address]) return null
        return [pool.sousId, new BigNumber(tokenBalances[pool.stakingToken.address]).toJSON()]
      })
      .filter((p): p is [number, string] => Boolean(p)),
  )

  // BNB pools
  const bnbBalanceJson = new BigNumber(bnbBalance.toString()).toJSON()
  const bnbBalances = fromPairs(bnbPools.map((pool) => [pool.sousId, bnbBalanceJson]))

  return { ...poolTokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async ({ account, chainId, provider }: FetchUserDataParams) => {
  const nonMasterPools = getNonMasterPools(chainId)
  const calls = nonMasterPools.map(({ contractAddress }) => ({
    address: contractAddress,
    name: 'userInfo',
    params: [account],
  }))
  const { multicall } = createMulticall(provider)
  const userInfo = await multicall(sousChefABI, calls, chainId)
  return fromPairs(
    nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(userInfo[index].amount._hex).toJSON()]),
  )
}

export const fetchUserPendingRewards = async ({ account, chainId, provider }: FetchUserDataParams) => {
  const nonMasterPools = getNonMasterPools(chainId)
  const calls = nonMasterPools.map(({ contractAddress }) => ({
    address: contractAddress,
    name: 'pendingReward',
    params: [account],
  }))
  const { multicall } = createMulticall(provider)
  const res = await multicall(sousChefABI, calls, chainId)
  return fromPairs(nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(res[index]).toJSON()]))
}
