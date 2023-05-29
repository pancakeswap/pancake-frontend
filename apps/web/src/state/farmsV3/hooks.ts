import {
  createFarmFetcherV3,
  SerializedFarmsV3Response,
  FarmV3DataWithPrice,
  FarmV3DataWithPriceAndUserInfo,
  FarmV3DataWithPriceTVL,
  IPendingCakeByTokenId,
  FarmsV3Response,
} from '@pancakeswap/farms'
import { priceHelperTokens } from '@pancakeswap/farms/constants/common'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { fetchCommonTokenUSDValue, TvlMap } from '@pancakeswap/farms/src/fetchFarmsV3'
import { ChainId } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { useCakePriceAsBN } from '@pancakeswap/utils/useCakePrice'
import { FAST_INTERVAL } from 'config/constants'
import { FARMS_API } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import toLower from 'lodash/toLower'
import { useMemo } from 'react'
import useSWR from 'swr'
import { getViemClients } from 'utils/viem'
import { decodeFunctionResult, encodeFunctionData, Hex } from 'viem'
import { useAccount } from 'wagmi'
import fetchWithTimeout from 'utils/fetchWithTimeout'

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
        ...data,
        farmsWithPrice,
      }
    })

const fallback: Awaited<ReturnType<typeof farmFetcherV3.fetchFarms>> = {
  farmsWithPrice: [],
  poolLength: 0,
  cakePerSecond: '0',
  totalAllocPoint: '0',
}

const API_FLAG = false

const farmFetcherV3 = createFarmFetcherV3(getViemClients)

export const useFarmsV3Public = () => {
  const { chainId } = useActiveChainId()

  return useSWR(
    [chainId, 'farmV3ApiFetch'],
    async () => {
      if (API_FLAG) {
        return farmV3ApiFetch(chainId).catch((err) => {
          console.error(err)
          return fallback
        })
      }

      // direct copy from api routes, the client side fetch is preventing cache due to migration phase we want fresh data
      const farms = farmsV3ConfigChainMap[chainId as ChainId]

      const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId])

      try {
        const data = await farmFetcherV3.fetchFarms({
          chainId,
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
    {
      refreshInterval: FAST_INTERVAL * 3,
      keepPreviousData: true,
      fallbackData: fallback,
    },
  )
}

interface UseFarmsOptions {
  // mock apr when tvl is 0
  mockApr?: boolean
}

export const useFarmsV3 = ({ mockApr = false }: UseFarmsOptions = {}) => {
  const { chainId } = useActiveChainId()

  const farmV3 = useFarmsV3Public()

  const cakePrice = useCakePriceAsBN()

  const { data } = useSWR<FarmsV3Response<FarmV3DataWithPriceTVL>>(
    [chainId, 'cake-apr-tvl', farmV3.data],
    async () => {
      const tvls: TvlMap = {}
      if ([ChainId.BSC, ChainId.GOERLI, ChainId.ETHEREUM, ChainId.BSC_TESTNET].includes(chainId)) {
        const results = await Promise.allSettled(
          farmV3.data.farmsWithPrice.map((f) =>
            fetchWithTimeout(`${FARMS_API}/v3/${chainId}/liquidity/${f.lpAddress}`)
              .then((r) => r.json())
              .catch((err) => {
                console.error(err)
                throw err
              }),
          ),
        )
        results.forEach((r, i) => {
          tvls[farmV3.data.farmsWithPrice[i].lpAddress] =
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
    {
      refreshInterval: FAST_INTERVAL * 3,
      dedupingInterval: FAST_INTERVAL,
      keepPreviousData: true,
    },
  )

  return {
    data: (data ?? farmV3.data) as FarmsV3Response<FarmV3DataWithPriceTVL>,
    isLoading: farmV3.isLoading,
    error: farmV3.error,
  }
}

export const useStakedPositionsByUser = (stakedTokenIds: bigint[]) => {
  const { address: account } = useAccount()
  const masterchefV3 = useMasterchefV3()

  const harvestCalls = useMemo(() => {
    if (!account) return []
    const callData: Hex[] = []
    for (const stakedTokenId of stakedTokenIds) {
      callData.push(
        encodeFunctionData({
          abi: masterchefV3.abi,
          functionName: 'harvest',
          args: [stakedTokenId, account],
        }),
      )
    }
    return callData
  }, [account, masterchefV3.abi, stakedTokenIds])

  const { data } = useSWR(
    account && ['mcv3-harvest', harvestCalls],
    () => {
      return masterchefV3.simulate.multicall([harvestCalls], { account, value: 0n }).then((res) => {
        return res.result
          .map((r) =>
            decodeFunctionResult({
              abi: masterchefV3.abi,
              functionName: 'harvest',
              data: r,
            }),
          )
          .map((r) => {
            return r
          })
      })
    },
    {
      keepPreviousData: true,
    },
  )

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
      unstakedIds.map((id) => positions.find((p) => p.tokenId === id)).filter((p) => p?.liquidity > 0n),
      stakedIds.map((id) => positions.find((p) => p.tokenId === id)).filter((p) => p?.liquidity > 0n),
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
            toLower(p.token0) === toLower(token0.address) &&
            toLower(p.token1) === toLower(token1.address) &&
            feeAmount === p.fee,
        )
        const staked = stakedPositions.filter((p) => {
          return (
            toLower(p.token0) === toLower(token0.address) &&
            toLower(p.token1) === toLower(token1.address) &&
            feeAmount === p.fee
          )
        })

        return {
          ...farm,
          unstakedPositions: unstaked,
          stakedPositions: staked,
          pendingCakeByTokenIds: Object.entries(pendingCakeByTokenIds).reduce<IPendingCakeByTokenId>(
            (acc, [tokenId, cake]) => {
              const foundPosition = staked.find((p) => p.tokenId === BigInt(tokenId))

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

export function useFarmsV3WithPositions(options: UseFarmsOptions = {}): {
  farmsWithPositions: FarmV3DataWithPriceAndUserInfo[]
  userDataLoaded: boolean
  cakePerSecond: string
  poolLength: number
  isLoading: boolean
} {
  const { data, error: _error, isLoading } = useFarmsV3(options)

  return {
    ...usePositionsByUserFarms(data.farmsWithPrice),
    poolLength: data.poolLength,
    cakePerSecond: data.cakePerSecond,
    isLoading,
  }
}
