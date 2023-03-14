import {
  createFarmFetcherV3,
  FarmsV3Response,
  FarmV3DataWithPrice,
  FarmV3DataWithPriceAndUserInfo,
  IPendingCakeByTokenId,
} from '@pancakeswap/farms'
import { priceHelperTokens } from '@pancakeswap/farms/constants/common'
import { farmsV3ConfigChainMap } from '@pancakeswap/farms/constants/v3'
import { fetchCommonTokenUSDValue, TvlMap } from '@pancakeswap/farms/src/fetchFarmsV3'
import { ChainId } from '@pancakeswap/sdk'
import { deserializeToken } from '@pancakeswap/token-lists'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import partition from 'lodash/partition'
import toLower from 'lodash/toLower'
import { useMemo } from 'react'
import useSWR from 'swr'
import { multicallv2 } from 'utils/multicall'

const farmV3ApiFetch = (chainId: number) =>
  fetch(`/api/v3/${chainId}/farms`)
    .then((res) => res.json())
    .then((data: FarmsV3Response) => {
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

const fallback = {
  farmsWithPrice: [],
  poolLength: 0,
  latestPeriodCakePerSecond: '0',
}

const API_FLAG = false

const farmFetcherV3 = createFarmFetcherV3(multicallv2)

export const useFarmsV3 = () => {
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

      const commonPrice = await fetchCommonTokenUSDValue(priceHelperTokens[chainId])

      const data = await farmFetcherV3.fetchFarms({
        tvlMap: tvls,
        chainId,
        farms,
        commonPrice,
      })

      return data
    },
    {
      refreshInterval: FAST_INTERVAL * 3,
      keepPreviousData: true,
      fallbackData: fallback,
    },
  )
}

export const usePositionsByUser = (
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

  const [unstakedPositions, stakedPositions] = useMemo(() => {
    return partition(positions, (p) => tokenIds.find((i) => i.eq(p.tokenId)))
  }, [positions, tokenIds])

  const harvestCalls = useMemo(() => {
    if (!account) return []
    const callData = []
    for (const stakedPosition of stakedPositions) {
      callData.push(masterchefV3.interface.encodeFunctionData('harvest', [stakedPosition.tokenId.toString(), account]))
    }
    return callData
  }, [account, masterchefV3.interface, stakedPositions])

  const { data: tokenIdResults, isLoading } = useSWR(account && [harvestCalls], () => {
    return masterchefV3.callStatic.multicall(harvestCalls).then((res) => {
      return res
        .map((r) => masterchefV3.interface.decodeFunctionResult('harvest', r))
        .map((r) => {
          if ('reward' in r) {
            return r.reward
          }
          return null
        })
    })
  })

  const pendingCakeByTokenIds = useMemo(
    () =>
      tokenIdResults?.reduce<IPendingCakeByTokenId>((acc, pendingCake, i) => {
        const position = stakedPositions[i]

        return pendingCake ? { ...acc, [position.tokenId.toString()]: pendingCake } : acc
      }, {} as IPendingCakeByTokenId),
    [stakedPositions, tokenIdResults],
  )

  // assume that if any of the tokenIds have a valid result, the data is ready
  const userDataLoaded = harvestCalls.length > 0 && !isLoading

  const farmsWithPositions = useMemo(
    () =>
      farmsV3.map((farm) => {
        const { token, quoteToken, feeAmount } = farm

        const stakedIdsInFarm = stakedIds.filter((userPosition) => userPosition.toString() === farm.pid.toString())

        const unstaked = unstakedPositions.filter(
          (p) =>
            toLower(p.token0) === toLower(token.address) &&
            toLower(p.token1) === toLower(quoteToken.address) &&
            feeAmount === p.fee,
        )
        const staked = stakedPositions.filter((p) => {
          const foundPosition = stakedIdsInFarm.find((tokenId) => p.tokenId.eq(tokenId))

          if (foundPosition) return true

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
    [farmsV3, pendingCakeByTokenIds, stakedIds, stakedPositions, unstakedPositions],
  )

  return {
    farmsWithPositions,
    userDataLoaded,
  }
}

export function useFarmsV3WithPositions(): {
  farmsWithPositions: FarmV3DataWithPriceAndUserInfo[]
  userDataLoaded: boolean
  poolLength: number
  isLoading: boolean
} {
  const { data, isLoading, error: _error } = useFarmsV3()

  return {
    ...usePositionsByUser(data.farmsWithPrice),
    poolLength: data.poolLength,
    isLoading,
  }
}
