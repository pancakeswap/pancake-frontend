import { BigNumber } from '@ethersproject/bignumber'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useV3PositionsFromTokenIds, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import useSWRImmutable from 'swr/immutable'
import _sortedUniqBy from 'lodash/sortedUniqBy'
import _partition from 'lodash/partition'
import _toLower from 'lodash/toLower'
import { PositionDetails } from 'hooks/v3/types'
import { SerializedFarmPublicData } from '@pancakeswap/farms'
import { getStakedPositionsByUser } from './fetchMasterChefV3Subgraph'
import { farmSelector } from './selectors'

export const useFarmsV3 = () => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => farmSelector(chainId), [chainId]))
}

export const usePositionsByUser = () => {
  const { account } = useActiveWeb3React()

  const { data: stakedTokenIds } = useSWRImmutable(account ? ['getStakedPositionsByUser', account] : null, () =>
    getStakedPositionsByUser(account),
  )

  const stakedIds = useMemo(
    () => (stakedTokenIds ? stakedTokenIds.map(({ id }) => BigNumber.from(id)) : []),
    [stakedTokenIds],
  )

  const { tokenIds } = useV3TokenIdsByAccount(account)

  const uniqueTokenIds = useMemo(
    () => _sortedUniqBy([...stakedIds, ...tokenIds], (v: BigNumber) => v.toString()),
    [stakedIds, tokenIds],
  )

  const { positions } = useV3PositionsFromTokenIds(uniqueTokenIds)

  // return [unstakedPositions, stakedPositions]
  return useMemo(() => {
    return _partition(positions, (p) => tokenIds.find((i) => i.eq(p.tokenId)))
  }, [positions, tokenIds])
}

export interface SerializedFarmV3 extends SerializedFarmPublicData {
  unstakedPositions: PositionDetails[]
  stakedPositions: PositionDetails[]
}

export function useFarmsV3WithPositions(): SerializedFarmV3[] {
  const { data: farmsV3 } = useFarmsV3()
  const [unstakedPositions, stakedPositions] = usePositionsByUser()

  const farmsWithPositions = farmsV3.map((farm) => {
    const { token, quoteToken } = farm

    const unstaked = unstakedPositions.filter(
      (p) => _toLower(p.token0) === _toLower(token.address) || _toLower(p.token1) === _toLower(quoteToken.address),
    )
    const staked = stakedPositions.filter(
      (p) => _toLower(p.token0) === _toLower(token.address) || _toLower(p.token1) === _toLower(quoteToken.address),
    )

    return {
      ...farm,
      unstakedPositions: unstaked,
      stakedPositions: staked,
    }
  })

  return farmsWithPositions
}
