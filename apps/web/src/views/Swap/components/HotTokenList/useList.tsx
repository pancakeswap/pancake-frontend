import { PANCAKE_EXTENDED } from 'config/constants/lists'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { useTokenDatasSWR, useAllTokenHighLight } from 'state/info/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/sdk'

export const useBSCWhiteList = () => {
  const listsByUrl = useAtomValue(selectorByUrlsAtom)
  const { current: list } = listsByUrl[PANCAKE_EXTENDED]
  const whiteList = useMemo(() => {
    return list ? list.tokens.map((t) => t.address.toLowerCase()) : []
  }, [list])
  return whiteList
}

export const useTokenHighLightList = () => {
  const { chainId } = useActiveChainId()
  const bscWhiteList = useBSCWhiteList()
  const allTokensFromBSC = useTokenDatasSWR(chainId === ChainId.BSC ? bscWhiteList : [], false)
  const allTokensFromETH = useAllTokenHighLight()

  return chainId === ChainId.BSC ? allTokensFromBSC : allTokensFromETH
}
