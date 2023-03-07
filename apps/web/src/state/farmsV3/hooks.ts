import { BigNumber } from '@ethersproject/bignumber'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import sortedUniqBy from 'lodash/sortedUniqBy'
import partition from 'lodash/partition'
import toLower from 'lodash/toLower'
import { PositionDetails } from 'hooks/v3/types'
import { FarmPriceV3, FarmsV3Response, FarmV3DataWithPrice } from '@pancakeswap/farms'
import { FARM_API } from 'config/constants/endpoints'
import { useMasterchefV3 } from 'hooks/useContract'
import { useSingleContractMultipleData } from 'state/multicall/hooks'

import { getStakedPositionsByUser } from './fetchMasterChefV3Subgraph'

const farmV3ApiFetch = (chainId: number) => fetch(`${FARM_API}/v3/${chainId}/farms`).then((res) => res.json())

export const useFarmsV3 = () => {
  const { chainId } = useActiveChainId()

  const { data } = useSWRImmutable<FarmsV3Response>('farmV3ApiFetch', () => farmV3ApiFetch(chainId))

  return useMemo(
    () => ({ farmsWithPrice: data?.farmsWithPrice || [], poolLength: data?.poolLength || 0 }),
    [data?.farmsWithPrice, data?.poolLength],
  )
}

export type IPendingCakeByTokenId = Record<string, BigNumber>

export interface SerializedFarmV3 extends FarmPriceV3 {
  unstakedPositions: PositionDetails[]
  stakedPositions: PositionDetails[]
  pendingCakeByTokenIds: IPendingCakeByTokenId
}

export const usePositionsByUser = (farmsV3: FarmV3DataWithPrice[]): SerializedFarmV3[] => {
  const { account } = useActiveWeb3React()

  const pids = farmsV3.map((farm) => farm.pid)

  const { data: stakedTokenIds } = useSWRImmutable(
    account && pids?.length ? ['getStakedPositionsByUser', account, pids?.join(',')] : null,
    () => getStakedPositionsByUser(account, pids),
  )

  const stakedIds = useMemo(() => stakedTokenIds || [], [stakedTokenIds])

  const { tokenIds } = useV3TokenIdsByAccount(account)

  const uniqueTokenIds = useMemo(
    () => sortedUniqBy([...stakedIds.map(({ id }) => BigNumber.from(id)), ...tokenIds], (v: BigNumber) => v.toString()),
    [stakedIds, tokenIds],
  )

  const { positions } = useV3PositionsFromTokenIds(uniqueTokenIds)

  const [unstakedPositions, stakedPositions] = useMemo(() => {
    return partition(positions, (p) => tokenIds.find((i) => i.eq(p.tokenId)))
  }, [positions, tokenIds])

  const masterchefV3 = useMasterchefV3()

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

  return useMemo(
    () =>
      farmsV3.map((farm) => {
        const { token, quoteToken, feeAmount } = farm

        const idsOfFarmInV3Subgraph = stakedIds
          .filter((userPosition) => userPosition.pool.id === farm.pid.toString())
          .map(({ id }) => id)

        const unstaked = unstakedPositions.filter(
          (p) =>
            toLower(p.token0) === toLower(token.address) &&
            toLower(p.token1) === toLower(quoteToken.address) &&
            feeAmount === p.fee,
        )
        const staked = stakedPositions.filter((p) => {
          const foundPosition = idsOfFarmInV3Subgraph.find((tokenId) => p.tokenId.eq(tokenId))

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
}

export function useFarmsV3WithPositions(): SerializedFarmV3[] {
  const { farmsWithPrice } = useFarmsV3()

  return usePositionsByUser(farmsWithPrice)
}
