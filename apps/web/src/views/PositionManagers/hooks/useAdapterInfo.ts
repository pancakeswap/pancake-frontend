import { positionManagerAdapterABI, positionManagerWrapperABI } from '@pancakeswap/position-managers'
import { Percent } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract, usePositionManagerWrapperContract } from 'hooks/useContract'
import { publicClient } from 'utils/wagmi'
import { Address, erc20Abi } from 'viem'
import { useAccount } from 'wagmi'

export async function getAdapterTokensAmounts({ address, chainId }): Promise<{
  token0Amounts: bigint
  token1Amounts: bigint
  token0PerShare: bigint
  token1PerShare: bigint
  precision: bigint
  totalSupply: bigint
  managerFeePercentage: Percent
  vaultAddress: Address
  managerAddress: Address
} | null> {
  const [totalSupplyData, tokenPerShareData, PRECISIONData, managerFeeData, vaultAddressData, managerAddressData] =
    await publicClient({
      chainId,
    }).multicall({
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
        {
          address,
          functionName: 'managerFee',
          abi: positionManagerAdapterABI,
        },
        {
          address,
          functionName: 'vault',
          abi: positionManagerAdapterABI,
        },
        {
          address,
          functionName: 'manager',
          abi: positionManagerAdapterABI,
        },
      ],
    })

  if (
    !totalSupplyData?.result ||
    !tokenPerShareData?.result ||
    !PRECISIONData?.result ||
    (!managerFeeData?.result && managerFeeData?.result !== 0n) ||
    !vaultAddressData?.result ||
    !managerAddressData?.result
  )
    return null

  const [totalSupply, tokenPerShare, PRECISION, managerFee, vaultAddress, managerAddress] = [
    totalSupplyData.result,
    tokenPerShareData.result,
    PRECISIONData.result,
    managerFeeData.result,
    vaultAddressData.result,
    managerAddressData.result,
  ]
  const precision = PRECISION ?? BigInt(0)
  const token0Amounts = (totalSupply * tokenPerShare[0]) / precision
  const token1Amounts = (totalSupply * tokenPerShare[1]) / precision
  const managerFeePercentage = new Percent(Number((managerFee * 100n) / precision), 10000)

  return {
    token0Amounts,
    token1Amounts,
    token0PerShare: tokenPerShare[0],
    token1PerShare: tokenPerShare[1],
    precision,
    totalSupply,
    managerFeePercentage,
    vaultAddress,
    managerAddress,
  }
}

export const useAdapterTokensAmounts = (adapterAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data, refetch } = useQuery({
    queryKey: ['AdapterTokensAmounts', adapterAddress, chainId],
    queryFn: () => getAdapterTokensAmounts({ address: adapterAddress, chainId }),
    enabled: !!adapterAddress && !!chainId,
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  return { data, refetch }
}

export const useUserAmounts = (wrapperAddress: Address) => {
  const { address: account } = useAccount()
  const contract = usePositionManagerWrapperContract(wrapperAddress)
  const { data, refetch } = useQuery({
    queryKey: ['useUserAmounts', wrapperAddress, account],
    queryFn: () => contract.read.userInfo([account ?? '0x']),
    enabled: !!wrapperAddress && !!account,
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  return { data, refetch }
}

export const useWrapperStaticData = (wrapperAddress: Address) => {
  const { chainId } = useActiveChainId()
  const { data, refetch } = useQuery({
    queryKey: ['useWrapperStaticData', wrapperAddress, chainId],
    queryFn: () => getWrapperStaticData({ address: wrapperAddress, chainId }),
    enabled: !!wrapperAddress && !!chainId,
    refetchInterval: 30000,
    staleTime: 30000,
    gcTime: 30000,
  })
  return { data, refetch }
}

export const useVaultStaticData = (vaultAddress?: Address) => {
  const { chainId } = useActiveChainId()
  const vaultContract = useContract(vaultAddress, erc20Abi)
  const { data, refetch } = useQuery({
    queryKey: ['useVaultStaticData', vaultAddress, chainId],
    queryFn: () => vaultContract?.read.decimals(),
    enabled: !!vaultAddress && !!chainId,
  })
  return { data, refetch }
}

export const usePositionInfo = (wrapperAddress: Address, adapterAddress: Address) => {
  const { data: userAmounts, refetch: refetchUserAmounts } = useUserAmounts(wrapperAddress)
  const { data: poolAmounts, refetch: refetchPoolAmounts } = useAdapterTokensAmounts(adapterAddress)
  const { data: pendingReward, refetch: refetchPendingReward } = useUserPendingRewardAmounts(wrapperAddress)
  const { data: staticData } = useWrapperStaticData(wrapperAddress)
  const { data: lpTokenDecimals } = useVaultStaticData(poolAmounts?.vaultAddress)

  const poolAndUserAmountsReady = userAmounts && poolAmounts

  return {
    pendingReward,
    poolToken0Amounts: poolAmounts?.token0Amounts ?? BigInt(0),
    poolToken1Amounts: poolAmounts?.token1Amounts ?? BigInt(0),
    userToken0Amounts: poolAndUserAmountsReady
      ? (userAmounts[0] * poolAmounts?.token0PerShare) / poolAmounts.precision
      : BigInt(0),
    userToken1Amounts: poolAndUserAmountsReady
      ? (userAmounts[0] * poolAmounts?.token1PerShare) / poolAmounts.precision
      : BigInt(0),
    userVaultPercentage: poolAndUserAmountsReady
      ? new Percent(userAmounts[0], poolAmounts.totalSupply)
      : new Percent(0, 100),
    refetchPositionInfo: () => {
      refetchUserAmounts()
      refetchPoolAmounts()
      refetchPendingReward()
    },
    startTimestamp: staticData?.startTimestamp ? Number(staticData.startTimestamp) : 0,
    endTimestamp: staticData?.endTimestamp ? Number(staticData.endTimestamp) : 0,
    rewardPerSecond: staticData?.rewardPerSecond ?? '',
    totalSupplyAmounts: poolAmounts?.totalSupply,
    userLpAmounts: userAmounts?.[0],
    precision: poolAmounts?.precision,
    adapterAddress: staticData?.adapterAddress,
    vaultAddress: poolAmounts?.vaultAddress,
    managerFeePercentage: poolAmounts?.managerFeePercentage,
    managerAddress: poolAmounts?.managerAddress,
    lpTokenDecimals,
  }
}

export const useUserPendingRewardAmounts = (wrapperAddress: Address) => {
  const { address: account } = useAccount()
  const contract = usePositionManagerWrapperContract(wrapperAddress)
  const { data, refetch } = useQuery({
    queryKey: ['useUserPendingRewardAmounts', account, wrapperAddress],
    queryFn: () => contract.read.pendingReward([account ?? '0x']),
    enabled: !!account,
    refetchInterval: 3000,
    staleTime: 3000,
    gcTime: 3000,
  })
  return { data, refetch }
}

export async function getWrapperStaticData({ address, chainId }): Promise<{
  startTimestamp: string
  endTimestamp: string
  rewardPerSecond: string
  adapterAddress: Address
} | null> {
  const [startTimestampData, endTimestampData, rewardPerSecondData, adapterAddrData] = await publicClient({
    chainId,
  }).multicall({
    contracts: [
      {
        address,
        functionName: 'startTimestamp',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'endTimestamp',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'rewardPerSecond',
        abi: positionManagerWrapperABI,
      },
      {
        address,
        functionName: 'adapterAddr',
        abi: positionManagerWrapperABI,
      },
    ],
  })

  if (!startTimestampData.result || !endTimestampData.result || !rewardPerSecondData.result || !adapterAddrData.result)
    return null

  const [startTimestamp, endTimestamp, rewardPerSecond, adapterAddress] = [
    startTimestampData.result,
    endTimestampData.result,
    rewardPerSecondData.result,
    adapterAddrData.result,
  ]

  return {
    startTimestamp: startTimestamp.toString(),
    endTimestamp: endTimestamp.toString(),
    rewardPerSecond: rewardPerSecond?.toString() ?? '',
    adapterAddress,
  }
}
