import { useQuery } from '@tanstack/react-query'
import { positionManagerAdapterABI } from 'config/abi/positionManagerAdapter'
import { usePositionManagerWrapperContract } from 'hooks/useContract'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { publicClient } from 'utils/wagmi'
import { Address } from 'viem'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Percent } from '@pancakeswap/sdk'

export async function getAdapterTokensAmounts({ address, chainId }): Promise<{
  token0Amounts: bigint
  token1Amounts: bigint
  token0PerShare: bigint
  token1PerShare: bigint
  PRECISION: bigint
  totalSupply: bigint
} | null> {
  const [totalSupplyData, tokenPerShareData, PRECISIONData] = await publicClient({ chainId }).multicall({
    contracts: [
      {
        address,
        functionName: 'totalSupply',
        abi: positionManagerAdapterABI,
      },
      {
        address,
        functionName: 'tokenPerShare',
        abi: positionManagerAdapterABI,
      },
      {
        address,
        functionName: 'PRECISION',
        abi: positionManagerAdapterABI,
      },
    ],
  })

  if (!totalSupplyData.result || !tokenPerShareData.result || !PRECISIONData) return null

  const [totalSupply, tokenPerShare, PRECISION] = [
    totalSupplyData.result,
    tokenPerShareData.result,
    PRECISIONData.result,
  ]

  const token0Amounts = (totalSupply * tokenPerShare[0]) / PRECISION
  const token1Amounts = (totalSupply * tokenPerShare[1]) / PRECISION

  return {
    token0Amounts,
    token1Amounts,
    token0PerShare: tokenPerShare[0],
    token1PerShare: tokenPerShare[1],
    PRECISION,
    totalSupply,
  }
}

export const useAdapterTokensAmounts = (adapterAddress: Address) => {
  const chainId = useActiveChainId()
  const { data, refetch } = useQuery(
    ['AdapterTokensAmounts', adapterAddress],
    () => getAdapterTokensAmounts({ address: adapterAddress, chainId }),
    {
      enabled: !!adapterAddress,
      refetchInterval: 3000,
      staleTime: 3000,
      cacheTime: 3000,
    },
  )
  return { data, refetch }
}

export const useUserAmounts = (wrapperAddress: Address) => {
  const { account } = useActiveWeb3React()
  const contract = usePositionManagerWrapperContract(wrapperAddress)
  const { data, refetch } = useQuery(
    ['useUserAmounts', wrapperAddress, account],
    () => contract.read.userInfo([account]),
    {
      enabled: !!wrapperAddress && !!account,
      refetchInterval: 3000,
      staleTime: 3000,
      cacheTime: 3000,
    },
  )
  return { data, refetch }
}

export const usePositionInfo = (wrapperAddress: Address, adapterAddress: Address) => {
  const { data: userAmounts, refetch: refetchUserAmounts } = useUserAmounts(wrapperAddress)
  const { data: poolAmounts, refetch: refetchPoolAmounts } = useAdapterTokensAmounts(adapterAddress)
  const { data: pendingReward, refetch: refetchPendingReward } = useUserPendingRewardAmounts()

  return {
    pendingReward,
    poolToken0Amounts: poolAmounts?.token0Amounts ?? BigInt(0),
    poolToken1Amounts: poolAmounts?.token1Amounts ?? BigInt(0),
    userToken0Amounts: userAmounts ? (userAmounts[0] * poolAmounts.token0PerShare) / poolAmounts.PRECISION : BigInt(0),
    userToken1Amounts: userAmounts ? (userAmounts[0] * poolAmounts.token1PerShare) / poolAmounts.PRECISION : BigInt(0),
    userVaultPercentage: userAmounts ? new Percent(userAmounts[0], poolAmounts.totalSupply) : new Percent(0, 100),
    refetchPositionInfo: () => {
      refetchUserAmounts()
      refetchPoolAmounts()
      refetchPendingReward()
    },
  }
}

export const useUserPendingRewardAmounts = () => {
  const { account } = useActiveWeb3React()
  const contract = usePositionManagerWrapperContract()
  const { data, refetch } = useQuery(
    ['useUserPendingRewardAmounts', account],
    () => contract.read.pendingReward([account]),
    {
      enabled: !!account,
      refetchInterval: 3000,
      staleTime: 3000,
      cacheTime: 3000,
    },
  )
  return { data, refetch }
}
