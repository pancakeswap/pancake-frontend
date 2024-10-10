import { ChainId } from '@pancakeswap/chains'
import BigNumber from 'bignumber.js'
import fromPairs from 'lodash/fromPairs'
import uniq from 'lodash/uniq'
import { Address, erc20Abi } from 'viem'
import { sousChefABI } from '../abis/ISousChef'
import { getPoolsConfig } from '../constants'
import { OnChainProvider, SerializedPool } from '../types'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const getPoolsFactory = (filter: (pool: SerializedPool) => boolean) => async (chainId: ChainId) => {
  const poolsConfig = await getPoolsConfig(chainId)
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
  const nonBnbPools = await getNonBnbPools(chainId)

  const client = provider({ chainId })
  const allowances = await client.multicall({
    contracts: nonBnbPools.map(
      ({ contractAddress, stakingToken }) =>
        ({
          address: stakingToken.address,
          abi: erc20Abi,
          functionName: 'allowance',
          args: [account as Address, contractAddress] as const,
        } as const),
    ),
    allowFailure: false,
  })
  return fromPairs(
    nonBnbPools.map((pool, index) => [pool.sousId, new BigNumber(allowances[index].toString()).toJSON()]),
  )
}

export const fetchUserBalances = async ({ account, chainId, provider }: FetchUserDataParams) => {
  const nonBnbPools = await getNonBnbPools(chainId)
  const bnbPools = await getBnbPools(chainId)
  // Non BNB pools
  const tokens = uniq(nonBnbPools.map((pool) => pool.stakingToken.address))
  const client = provider({ chainId })

  const tokenBalance = await client.multicall({
    contracts: [
      {
        abi: [
          {
            inputs: [{ internalType: 'address', name: 'addr', type: 'address' }],
            name: 'getEthBalance',
            outputs: [{ internalType: 'uint256', name: 'balance', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ] as const,
        address: '0xcA11bde05977b3631167028862bE2a173976CA11', // TODO: Here is multicall address, should extract addresses to a package for multi chain
        functionName: 'getEthBalance',
        args: [account as Address] as const,
      } as any,
      ...tokens.map(
        (token) =>
          ({
            abi: erc20Abi,
            address: token,
            functionName: 'balanceOf',
            args: [account] as const,
          } as const),
      ),
    ],
  })
  const [bnbBalance, ...tokenBalancesResults] = tokenBalance

  const tokenBalances = fromPairs(tokens.map((token, index) => [token, tokenBalancesResults[index].result as bigint]))

  const poolTokenBalances = fromPairs(
    nonBnbPools
      .map<[number, string] | null>((pool) => {
        if (!tokenBalances[pool.stakingToken.address]) return null
        return [pool.sousId, new BigNumber(tokenBalances[pool.stakingToken.address].toString()).toJSON()]
      })
      .filter((p): p is [number, string] => Boolean(p)),
  )

  // BNB pools
  const bnbBalanceJson = new BigNumber((bnbBalance.result as bigint)?.toString()).toJSON()
  const bnbBalances = fromPairs(bnbPools.map((pool) => [pool.sousId, bnbBalanceJson]))

  return { ...poolTokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async ({ account, chainId, provider }: FetchUserDataParams) => {
  const nonMasterPools = await getNonMasterPools(chainId)

  const client = provider({ chainId })
  const userInfo = await client.multicall({
    contracts: nonMasterPools.map(
      ({ contractAddress }) =>
        ({
          abi: sousChefABI.filter((r) => r.name === 'userInfo'),
          address: contractAddress,
          functionName: 'userInfo',
          args: [account as Address] as const,
        } as const),
    ),
    allowFailure: false,
  })

  return fromPairs(
    nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(userInfo[index][0].toString()).toJSON()]),
  )
}

export const fetchUserPendingRewards = async ({ account, chainId, provider }: FetchUserDataParams) => {
  const nonMasterPools = await getNonMasterPools(chainId)

  const client = provider({ chainId })
  const res = await client.multicall({
    contracts: nonMasterPools.map(
      ({ contractAddress }) =>
        ({
          abi: sousChefABI.filter((r) => r.name === 'pendingReward'),
          address: contractAddress,
          functionName: 'pendingReward',
          args: [account as Address] as const,
        } as const),
    ),
    allowFailure: false,
  })
  return fromPairs(nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(res[index].toString()).toJSON()]))
}
