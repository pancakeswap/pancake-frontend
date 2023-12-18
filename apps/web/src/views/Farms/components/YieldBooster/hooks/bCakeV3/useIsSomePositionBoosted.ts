import { PositionDetails } from '@pancakeswap/farms'
import { useMemo } from 'react'

export const useIsSomePositionBoosted = (stakedPositions: PositionDetails[], tokenIds: number[]) => {
  const isBoosted = useMemo(() => {
    const tokenIdMap = stakedPositions.reduce((acc, cur) => Object.assign(acc, { [cur.tokenId.toString()]: true }), {})
    return Boolean(tokenIds.some((tokenId) => tokenIdMap[tokenId] === true))
  }, [stakedPositions, tokenIds])
  return { isBoosted }
}
