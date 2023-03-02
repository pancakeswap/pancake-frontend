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
import { SerializedFarmPublicData } from '@pancakeswap/farms'
import { FARM_API } from 'config/constants/endpoints'

import { getStakedPositionsByUser } from './fetchMasterChefV3Subgraph'

const farmV3ApiFetch = (chainId: number) => fetch(`${FARM_API}/v3/${chainId}/farms`).then((res) => res.json())

interface FarmsV3State {
  farmsWithPrice: SerializedFarmV3[]
  poolLength: number
}

export const useFarmsV3 = () => {
  const { chainId } = useActiveChainId()

  const { data } = useSWRImmutable<FarmsV3State>('farmV3ApiFetch', () => farmV3ApiFetch(chainId))

  return useMemo(() => data ?? { farmsWithPrice: [], poolLength: 0 }, [data])
}

export const usePositionsByUser = (farmsV3: SerializedFarmPublicData[]) => {
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

  const farmsWithPositions = farmsV3.map((farm) => {
    const { token, quoteToken } = farm

    const idsOfFarmInV3Subgraph = stakedIds
      .filter((userPosition) => userPosition.pool.id === farm.pid.toString())
      .map(({ id }) => id)

    const unstaked = unstakedPositions.filter(
      (p) => toLower(p.token0) === toLower(token.address) || toLower(p.token1) === toLower(quoteToken.address),
    )
    const staked = stakedPositions.filter((p) => {
      const foundPosition = idsOfFarmInV3Subgraph.find((tokenId) => p.tokenId.eq(tokenId))

      if (foundPosition) return true

      return toLower(p.token0) === toLower(token.address) || toLower(p.token1) === toLower(quoteToken.address)
    })

    return {
      ...farm,
      unstakedPositions: unstaked,
      stakedPositions: staked,
    }
  })

  return farmsWithPositions
}

export interface SerializedFarmV3 extends SerializedFarmPublicData {
  unstakedPositions: PositionDetails[]
  stakedPositions: PositionDetails[]
}

export function useFarmsV3WithPositions(): SerializedFarmV3[] {
  const { farmsWithPrice } = useFarmsV3()
  return usePositionsByUser(farmsWithPrice)
}
