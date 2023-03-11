import { BigNumber } from '@ethersproject/bignumber'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useMemo } from 'react'
import useSWR from 'swr'
import partition from 'lodash/partition'
import toLower from 'lodash/toLower'
import {
  FarmsV3Response,
  FarmV3DataWithPrice,
  FarmV3DataWithPriceAndUserInfo,
  IPendingCakeByTokenId,
} from '@pancakeswap/farms'
import { FARM_API } from 'config/constants/endpoints'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useSingleContractMultipleData } from 'state/multicall/hooks'
import { deserializeToken } from '@pancakeswap/token-lists'
import { FAST_INTERVAL } from 'config/constants'

const farmV3ApiFetch = (chainId: number) =>
  fetch(`${FARM_API}/v3/${chainId}/farms`)
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

export const useFarmsV3 = () => {
  const { chainId } = useActiveChainId()

  return useSWR('farmV3ApiFetch', () => farmV3ApiFetch(chainId), {
    refreshInterval: FAST_INTERVAL,
    fallbackData: {
      farmsWithPrice: [],
      poolLength: 0,
      latestPeriodCakePerSecond: '0',
    },
  })
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

  const inputs = useMemo(
    () => (stakedPositions ? stakedPositions.map(({ tokenId }) => [tokenId]) : []),
    [stakedPositions],
  )

  const tokenIdResults = useSingleContractMultipleData(masterchefV3, 'pendingCake', inputs)

  const pendingCakeByTokenIds = useMemo(
    () =>
      tokenIdResults.reduce<IPendingCakeByTokenId>((acc, ele, i) => {
        const position = stakedPositions[i]

        const [pendingCake] = ele?.result || []

        return pendingCake ? { ...acc, [position.tokenId.toString()]: BigNumber.from(pendingCake) } : acc
      }, {}),
    [stakedPositions, tokenIdResults],
  )

  // assume that if any of the tokenIds have a valid result, the data is ready
  const userDataLoaded = useMemo(() => tokenIdResults.some((c) => c.valid), [tokenIdResults])

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
          pendingCakeByTokenIds,
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
  const { data, isLoading } = useFarmsV3()

  return {
    ...usePositionsByUser(data.farmsWithPrice),
    poolLength: data.poolLength,
    isLoading,
  }
}
