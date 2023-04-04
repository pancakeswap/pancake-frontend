import { BigNumber } from '@ethersproject/bignumber'
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
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import toLower from 'lodash/toLower'
import { useMemo } from 'react'
import useSWR from 'swr'
import { multicallv2 } from 'utils/multicall'

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
}

const API_FLAG = false

const farmFetcherV3 = createFarmFetcherV3(multicallv2)

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

export const useFarmsV3 = () => {
  const { chainId } = useActiveChainId()

  const farmV3 = useFarmsV3Public()

  const cakePrice = useCakePriceAsBN()

  const { data } = useSWR<FarmsV3Response<FarmV3DataWithPriceTVL>>(
    [chainId, 'cake-apr-tvl', farmV3.data],
    async () => {
      const farms = farmsV3ConfigChainMap[chainId as ChainId]

      const HOST = process.env.NEXT_PUBLIC_VERCEL_URL ? `` : 'http://localhost:3000'

      const tvls: TvlMap = {}
      if ([ChainId.BSC, ChainId.GOERLI, ChainId.ETHEREUM, ChainId.BSC_TESTNET].includes(chainId)) {
        const results = await Promise.allSettled(
          farms.map((f) =>
            fetch(`${HOST}/api/v3/${chainId}/farms/liquidity/${f.lpAddress}`)
              .then((r) => r.json())
              .catch((err) => {
                console.error(err)
                throw err
              }),
          ),
        )
        results.forEach((r, i) => {
          tvls[farms[i].lpAddress] =
            r.status === 'fulfilled' ? { ...r.value.formatted, updatedAt: r.value.updatedAt } : null
        })
      }

      const farmWithPriceAndCakeAPR = farmV3.data.farmsWithPrice.map((f) => {
        if (!tvls[f.lpAddress]) {
          return f
        }
        const { activeTvlUSD, activeTvlUSDUpdatedAt, cakeApr } = farmFetcherV3.getCakeAprAndTVL(
          f,
          tvls[f.lpAddress],
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

export const useStakedPositionsByUser = (stakedTokenIds: BigNumber[]) => {
  const { account } = useActiveWeb3React()
  const masterchefV3 = useMasterchefV3(false)

  const harvestCalls = useMemo(() => {
    if (!account) return []
    const callData = []
    for (const stakedTokenId of stakedTokenIds) {
      callData.push(masterchefV3.interface.encodeFunctionData('harvest', [stakedTokenId.toString(), account]))
    }
    return callData
  }, [account, masterchefV3.interface, stakedTokenIds])

  const { data } = useSWR(
    account && ['mcv3-harvest', harvestCalls],
    () => {
      return masterchefV3.callStatic.multicall(harvestCalls, { from: account }).then((res) => {
        return res
          .map((r) => masterchefV3.interface.decodeFunctionResult('harvest', r))
          .map((r) => {
            if ('reward' in r) {
              return r.reward as BigNumber
            }
            return null
          })
      })
    },
    {
      compare(a, b) {
        if (!a && !b) return true
        if (a && !b) return false
        if (!a && b) return false
        return a?.every((v, i) => {
          return BigNumber.isBigNumber(v) && b?.[i] && BigNumber.isBigNumber(b?.[i]) && v?.eq(b?.[i])
        })
      },
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
  const { account } = useActiveWeb3React()
  const positionManager = useV3NFTPositionManagerContract()
  const masterchefV3 = useMasterchefV3()

  const { tokenIds: stakedTokenIds } = useV3TokenIdsByAccount(masterchefV3, account)

  const stakedIds = useMemo(() => stakedTokenIds || [], [stakedTokenIds])

  const { tokenIds } = useV3TokenIdsByAccount(positionManager, account)

  const uniqueTokenIds = useMemo(() => [...stakedIds, ...tokenIds], [stakedIds, tokenIds])

  const { positions } = useV3PositionsFromTokenIds(uniqueTokenIds)

  const { tokenIdResults, isLoading: isStakedPositionLoading } = useStakedPositionsByUser(stakedIds)

  const [unstakedPositions, stakedPositions] = useMemo(() => {
    if (!positions) return [[], []]
    const unstakedIds = tokenIds.filter((id) => !stakedIds.find((s) => s.eq(id)))
    return [
      unstakedIds.map((id) => positions.find((p) => p.tokenId.eq(id))).filter((p) => p?.liquidity.gt(0)),
      stakedIds.map((id) => positions.find((p) => p.tokenId.eq(id))).filter((p) => p?.liquidity.gt(0)),
    ]
  }, [positions, stakedIds, tokenIds])

  const pendingCakeByTokenIds = useMemo(
    () =>
      tokenIdResults?.reduce<IPendingCakeByTokenId>((acc, pendingCake, i) => {
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
        const { token, quoteToken, feeAmount } = farm

        const unstaked = unstakedPositions.filter(
          (p) =>
            toLower(p.token0) === toLower(token.address) &&
            toLower(p.token1) === toLower(quoteToken.address) &&
            feeAmount === p.fee,
        )
        const staked = stakedPositions.filter((p) => {
          return (
            toLower(p.token0) === toLower(token.address) &&
            toLower(p.token1) === toLower(quoteToken.address) &&
            feeAmount === p.fee
          )
        })

        return {
          ...farm,
          unstakedPositions: unstaked,
          stakedPositions: staked,
          pendingCakeByTokenIds: Object.entries(pendingCakeByTokenIds).reduce<IPendingCakeByTokenId>(
            (acc, [tokenId, cake]) => {
              const foundPosition = staked.find((p) => p.tokenId.eq(tokenId))

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

export function useFarmsV3WithPositions(): {
  farmsWithPositions: FarmV3DataWithPriceAndUserInfo[]
  userDataLoaded: boolean
  cakePerSecond: string
  poolLength: number
  isLoading: boolean
} {
  const { data, error: _error, isLoading } = useFarmsV3()

  return {
    ...usePositionsByUserFarms(data.farmsWithPrice),
    poolLength: data.poolLength,
    cakePerSecond: data.cakePerSecond,
    isLoading,
  }
}
