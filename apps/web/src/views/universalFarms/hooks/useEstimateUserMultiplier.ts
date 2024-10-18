import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { veCakeABI } from 'config/abi/veCake'
import { SLOW_INTERVAL } from 'config/constants'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useCallback } from 'react'
import { getVeCakeAddress } from 'utils/addressHelpers'
import { getBCakeFarmWrapperBoosterVeCakeContract } from 'utils/contractHelpers'
import { publicClient } from 'utils/viem'
import { getUserMultiplier } from 'views/Farms/components/YieldBooster/hooks/bCakeV3/multiplierAPI'
import { useMasterChefV3FarmBoosterAddress } from './useMasterChefV3FarmBoosterAddress'

export const useEstimateUserMultiplier = (chainId: number, tokenId?: bigint) => {
  const { data: farmBoosterAddress } = useMasterChefV3FarmBoosterAddress(chainId)
  return useQuery({
    queryKey: ['useEstimateUserMultiplier', farmBoosterAddress, chainId, tokenId?.toString()],
    queryFn: async () => {
      return getUserMultiplier({ address: farmBoosterAddress, tokenId, chainId })
    },
    enabled: !!farmBoosterAddress && !!tokenId && !!chainId,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  })
}

export const useV2EstimateUserMultiplier = (chainId: number, userLiquidity: bigint = 0n, lpLiquidity: bigint = 0n) => {
  const veCakeBalance = useVeCakeBalance(chainId)
  const farmBooster = getBCakeFarmWrapperBoosterVeCakeContract(undefined, chainId)
  const queryFn = useCallback(async () => {
    const client = publicClient({ chainId })
    const [cA, CA_PRECISION, cB, CB_PRECISION, veCakeTotalSupply] = await client.multicall({
      contracts: [
        {
          address: farmBooster.address,
          functionName: 'cA',
          abi: farmBooster.abi,
        },
        {
          address: farmBooster.address,
          functionName: 'CA_PRECISION',
          abi: farmBooster.abi,
        },
        {
          address: farmBooster.address,
          functionName: 'cB',
          abi: farmBooster.abi,
        },
        {
          address: farmBooster.address,
          functionName: 'CB_PRECISION',
          abi: farmBooster.abi,
        },
        {
          address: getVeCakeAddress(chainId),
          functionName: 'totalSupply',
          abi: veCakeABI,
        },
      ],
      allowFailure: false,
    })
    const CA = new BigNumber(cA.toString()).div(CA_PRECISION.toString())
    const CB = new BigNumber(cB.toString()).div(CB_PRECISION.toString())
    const dB = CA.times(userLiquidity.toString())
    const aB = veCakeBalance.balance.times(lpLiquidity.toString()).div(CB.times(veCakeTotalSupply.toString()))
    const min = dB.plus(aB).lt(userLiquidity.toString()) ? new BigNumber(userLiquidity.toString()) : dB.plus(aB)
    return min.div(dB)
  }, [chainId, farmBooster.abi, farmBooster.address, lpLiquidity, userLiquidity, veCakeBalance.balance])

  return useQuery({
    queryKey: ['useV2EstimateUserMultiplier', chainId, userLiquidity?.toString(), lpLiquidity?.toString()],
    queryFn,
    enabled: !!chainId && !!userLiquidity && !!lpLiquidity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  })
}
