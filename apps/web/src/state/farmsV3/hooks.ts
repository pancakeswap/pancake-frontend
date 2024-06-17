import { ChainId } from '@pancakeswap/chains'
import {
  FarmV3DataWithPrice,
  FarmV3DataWithPriceAndUserInfo,
  FarmV3DataWithPriceTVL,
  FarmsV3Response,
  IPendingCakeByTokenId,
  PositionDetails,
  SerializedFarmsV3Response,
  bCakeSupportedChainId,
  createFarmFetcherV3,
  supportedChainIdV3,
} from '@pancakeswap/farms'
import { priceHelperTokens } from '@pancakeswap/farms/constants/common'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { bCakeFarmBoosterVeCakeABI } from '@pancakeswap/farms/constants/v3/abi/bCakeFarmBoosterVeCake'
import { TvlMap, fetchCommonTokenUSDValue } from '@pancakeswap/farms/src/fetchFarmsV3'
import { deserializeToken } from '@pancakeswap/token-lists'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { FAST_INTERVAL } from 'config/constants'
import { FARMS_API } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCakePrice } from 'hooks/useCakePrice'
import { useBCakeFarmBoosterVeCakeContract, useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import toLower from 'lodash/toLower'
import { useMemo } from 'react'
import fetchWithTimeout from 'utils/fetchWithTimeout'
import { getViemClients } from 'utils/viem'
import { publicClient } from 'utils/wagmi'
import { Hex, decodeFunctionResult, encodeFunctionData } from 'viem'
import { useAccount } from 'wagmi'

export const farmV3ApiFetch = (chainId: number): Promise<FarmsV3Response> =>
  fetch(`/api/v3/${chainId}/farms`)
    .then((res) => res.json())
    .then((data: SerializedFarmsV3Response) => {
      const farmsWithPrice = data.farmsWithPrice.map((f) => ({
        ...f,
        token: deserializeToken(f.token),
        quoteToken: deserializeToken(f.quoteToken),
      }))

      return {
        chainId,
        ...data,
        farmsWithPrice,
      }
    })

const fallback: Awaited<ReturnType<typeof farmFetcherV3.fetchFarms>> = {
  chainId: ChainId.BSC,
  farmsWithPrice: [],
  poolLength: 0,
  cakePerSecond: '0',
  totalAllocPoint: '0',
}

const API_FLAG = false

const farmFetcherV3 = createFarmFetcherV3(getViemClients)

export const useFarmsV3Public = () => {
  const { chainId } = useActiveChainId()

  return useQuery({
    queryKey: [chainId, 'farmV3ApiFetch'],

    queryFn: async () => {
      if (API_FLAG && chainId) {
        return farmV3ApiFetch(chainId).catch((err) => {
          console.error(err)
          return fallback
        })
      }

      // direct copy from api routes, the client side fetch is preventing cache due to migration phase we want fresh data
      const farms = farmsV3ConfigChainMap[chainId as ChainId]

      const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId ?? -1])

      try {
        const data = await farmFetcherV3.fetchFarms({
          chainId: chainId ?? -1,
          farms,
          commonPrice,
        })

        return data
      } catch (error) {
        console.error(error)
        // return fallback for now since not all chains supported
        return fallback
      }
    },

    enabled: Boolean(farmFetcherV3.isChainSupported(chainId ?? -1)),
    refetchInterval: FAST_INTERVAL * 3,
    initialData: fallback,
  })
}

interface UseFarmsOptions {
  // mock apr when tvl is 0
  mockApr?: boolean
}

export const useFarmsV3 = ({ mockApr = false }: UseFarmsOptions = {}) => {
  const { chainId } = useActiveChainId()

  const farmV3 = useFarmsV3Public()

  const cakePrice = useCakePrice()

  const { data } = useQuery({
    queryKey: [chainId, 'cake-apr-tvl'],

    queryFn: async ({ signal }) => {
      if (chainId !== farmV3?.data.chainId) {
        throw new Error('ChainId mismatch')
      }
      const tvls: TvlMap = {}
      if (supportedChainIdV3.includes(chainId)) {
        const farmsToFetch = farmV3.data.farmsWithPrice.filter((f) => f.poolWeight !== '0')
        const results = await Promise.allSettled(
          farmsToFetch.map((f) =>
            fetchWithTimeout(`${FARMS_API}/v3/${chainId}/liquidity/${f.lpAddress}`, {
              signal,
            })
              .then((r) => r.json())
              .catch((err) => {
                console.error(err)
                throw err
              }),
          ),
        )
        results.forEach((r, i) => {
          tvls[farmsToFetch[i].lpAddress] =
            r.status === 'fulfilled' ? { ...r.value.formatted, updatedAt: r.value.updatedAt } : null
        })
      }

      const farmWithPriceAndCakeAPR = farmV3.data.farmsWithPrice.map((f) => {
        if (!tvls[f.lpAddress]) {
          return f
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tvl = tvls[f.lpAddress]!
        // Mock 1$ tvl if the farm doesn't have lp staked
        if (mockApr && tvl?.token0 === '0' && tvl?.token1 === '0') {
          const [token0Price, token1Price] = f.token.sortsBefore(f.quoteToken)
            ? [f.tokenPriceBusd, f.quoteTokenPriceBusd]
            : [f.quoteTokenPriceBusd, f.tokenPriceBusd]
          tvl.token0 = token0Price ? String(1 / Number(token0Price)) : '1'
          tvl.token1 = token1Price ? String(1 / Number(token1Price)) : '1'
        }
        const { activeTvlUSD, activeTvlUSDUpdatedAt, cakeApr } = farmFetcherV3.getCakeAprAndTVL(
          f,
          tvl,
          cakePrice.toString(),
          farmV3.data.cakePerSecond,
        )

        return {
          ...f,
          cakeApr,
          activeTvlUSD,
          activeTvlUSDUpdatedAt,
        }
      })

      return {
        ...farmV3.data,
        farmsWithPrice: farmWithPriceAndCakeAPR,
      }
    },

    enabled: Boolean(farmV3.data.farmsWithPrice.length > 0),
    refetchInterval: FAST_INTERVAL * 3,
    staleTime: FAST_INTERVAL,
  })

  return {
    data: useMemo(() => {
      return farmV3.isLoading || farmV3.data.chainId !== chainId
        ? (farmV3.data as FarmsV3Response<FarmV3DataWithPriceTVL>)
        : ((data?.chainId !== chainId ? farmV3.data : data ?? farmV3.data) as FarmsV3Response<FarmV3DataWithPriceTVL>)
    }, [chainId, data, farmV3.data, farmV3.isLoading]),
    isLoading: farmV3.isLoading,
    error: farmV3.error,
  }
}

const zkSyncChains = [ChainId.ZKSYNC_TESTNET, ChainId.ZKSYNC]

export const useStakedPositionsByUser = (stakedTokenIds: bigint[]) => {
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const masterchefV3 = useMasterchefV3()

  const harvestCalls = useMemo(() => {
    if (!masterchefV3?.abi || !account || !supportedChainIdV3.includes(chainId ?? -1)) return []
    const callData: Hex[] = []
    for (const stakedTokenId of stakedTokenIds) {
      if (zkSyncChains.includes(chainId ?? -1)) {
        callData.push(
          encodeFunctionData({
            abi: masterchefV3?.abi ?? [],
            functionName: 'pendingCake',
            args: [stakedTokenId],
          }),
        )
      } else {
        callData.push(
          encodeFunctionData({
            abi: masterchefV3?.abi ?? [],
            functionName: 'harvest',
            args: [stakedTokenId, account],
          }),
        )
      }
    }
    return callData
  }, [account, masterchefV3?.abi, stakedTokenIds, chainId])

  const { data } = useQuery<bigint[]>({
    queryKey: ['mcv3-harvest', ...harvestCalls],

    queryFn: () => {
      if (!masterchefV3 || !harvestCalls.length) return []

      return masterchefV3?.simulate.multicall([harvestCalls], { account, value: 0n }).then((res) => {
        return res.result
          .map((r) =>
            decodeFunctionResult({
              abi: masterchefV3?.abi,
              functionName: zkSyncChains.includes(chainId ?? 0) ? 'pendingCake' : 'harvest',
              data: r,
            }),
          )
          .map((r) => {
            return r
          })
      })
    },

    enabled: Boolean(account),
    placeholderData: keepPreviousData,
  })

  return { tokenIdResults: data || [], isLoading: harvestCalls.length > 0 && !data }
}

const usePositionsByUserFarms = (
  farmsV3: FarmV3DataWithPrice[],
): {
  farmsWithPositions: FarmV3DataWithPriceAndUserInfo[]
  userDataLoaded: boolean
} => {
  const { address: account } = useAccount()
  const positionManager = useV3NFTPositionManagerContract()
  const masterchefV3 = useMasterchefV3()

  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3?.address, account)

  const stakedIds = useMemo(() => stakedTokenIds || [], [stakedTokenIds])

  const { tokenIds } = useV3TokenIdsByAccount(positionManager?.address, account)

  const uniqueTokenIds = useMemo(() => [...stakedIds, ...tokenIds], [stakedIds, tokenIds])

  const { positions } = useV3PositionsFromTokenIds(uniqueTokenIds)

  const { tokenIdResults, isLoading: isStakedPositionLoading } = useStakedPositionsByUser(stakedIds)

  const [unstakedPositions, stakedPositions] = useMemo(() => {
    if (!positions) return [[], []]
    const unstakedIds = tokenIds.filter((id) => !stakedIds.find((s) => s === id))
    return [
      unstakedIds
        .map((id) => positions.find((p) => p.tokenId === id))
        .filter((p) => (p?.liquidity ?? 0n) > 0n) as PositionDetails[],
      stakedIds
        .map((id) => positions.find((p) => p.tokenId === id))
        .filter((p) => (p?.liquidity ?? 0n) > 0n) as PositionDetails[],
    ]
  }, [positions, stakedIds, tokenIds])

  const pendingCakeByTokenIds = useMemo(
    () =>
      (tokenIdResults as bigint[])?.reduce<IPendingCakeByTokenId>((acc, pendingCake, i) => {
        const position = stakedPositions[i]

        return pendingCake && position?.tokenId ? { ...acc, [position.tokenId.toString()]: pendingCake } : acc
      }, {} as IPendingCakeByTokenId) ?? {},
    [stakedPositions, tokenIdResults],
  )

  // assume that if any of the tokenIds have a valid result, the data is ready
  const userDataLoaded = !isStakedPositionLoading

  const farmsWithPositions = useMemo(
    () =>
      farmsV3.map((farm) => {
        const { feeAmount, token0, token1 } = farm

        const unstaked = unstakedPositions.filter(
          (p) =>
            toLower(p?.token0) === toLower(token0.address) &&
            toLower(p?.token1) === toLower(token1.address) &&
            feeAmount === p?.fee,
        )
        const staked = stakedPositions.filter((p) => {
          return (
            toLower(p?.token0) === toLower(token0.address) &&
            toLower(p?.token1) === toLower(token1.address) &&
            feeAmount === p?.fee
          )
        })

        return {
          ...farm,
          unstakedPositions: unstaked,
          stakedPositions: staked,
          pendingCakeByTokenIds: Object.entries(pendingCakeByTokenIds).reduce<IPendingCakeByTokenId>(
            (acc, [tokenId, cake]) => {
              const foundPosition = staked.find((p) => p?.tokenId === BigInt(tokenId))

              if (foundPosition) {
                return { ...acc, [tokenId]: cake }
              }

              return acc
            },
            {},
          ),
        }
      }),
    [farmsV3, pendingCakeByTokenIds, stakedPositions, unstakedPositions],
  )

  return {
    farmsWithPositions,
    userDataLoaded,
  }
}

export function useFarmsV3WithPositionsAndBooster(options: UseFarmsOptions = {}): {
  farmsWithPositions: FarmV3DataWithPriceAndUserInfo[]
  userDataLoaded: boolean
  cakePerSecond: string
  poolLength: number
  isLoading: boolean
} {
  const { data, error: _error, isLoading } = useFarmsV3(options)
  const { data: boosterWhitelist } = useV3BoostedFarm(data?.farmsWithPrice?.map((f) => f.pid))

  return {
    ...usePositionsByUserFarms(
      data.farmsWithPrice?.map((d, index) => ({ ...d, boosted: boosterWhitelist?.[index]?.boosted })),
    ),
    poolLength: data.poolLength,
    cakePerSecond: data.cakePerSecond,
    isLoading,
  }
}

const useV3BoostedFarm = (pids?: number[]) => {
  const { chainId } = useActiveChainId()
  const farmBoosterVeCakeContract = useBCakeFarmBoosterVeCakeContract()

  const { data } = useQuery({
    queryKey: ['v3/boostedFarm', chainId, pids?.join('-')],

    queryFn: () =>
      getV3FarmBoosterWhiteList({
        farmBoosterContract: farmBoosterVeCakeContract,
        chainId: chainId ?? -1,
        pids: pids ?? [],
      }),

    enabled: Boolean(chainId && pids && pids.length > 0 && bCakeSupportedChainId.includes(chainId)),
    retry: 3,
    retryDelay: 3000,
  })
  return { data }
}

export async function getV3FarmBoosterWhiteList({
  farmBoosterContract,
  chainId,
  pids,
}: {
  farmBoosterContract: ReturnType<typeof useBCakeFarmBoosterVeCakeContract>
  chainId: ChainId
  pids: number[]
}): Promise<{ pid: number; boosted: boolean }[]> {
  const contracts = pids?.map((pid) => {
    return {
      address: farmBoosterContract.address,
      functionName: 'whiteList',
      abi: bCakeFarmBoosterVeCakeABI,
      args: [BigInt(pid)],
    } as const
  })
  const whiteList = await publicClient({ chainId }).multicall({
    contracts,
  })

  if (!whiteList || whiteList?.length !== pids?.length) return []
  return pids?.map((d, index) => ({ pid: d, boosted: whiteList[index].result ?? false }))
}
