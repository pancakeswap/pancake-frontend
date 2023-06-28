import { PANCAKE_EXTENDED } from 'config/constants/lists'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { multiChainName } from 'state/info/constant'
import { useTokenDatasSWR, useAllTokenHighLight } from 'state/info/hooks'
import { useTokensData } from 'views/V3Info/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/sdk'
import { parseV3TokenData, parseV2TokenData } from './utils'

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
  const allTokensFromETH = useAllTokenHighLight(multiChainName[chainId])
  const allV3TokensFromV3 = useTokensData(chainId === ChainId.BSC ? bscWhiteList : [], chainId)

  const tokens = useMemo(() => {
    return {
      v2Tokens: (chainId === ChainId.BSC ? allTokensFromBSC : allTokensFromETH)?.map(parseV2TokenData),
      v3Tokens: allV3TokensFromV3?.map(parseV3TokenData) ?? [],
    }
  }, [allTokensFromBSC, allTokensFromETH, allV3TokensFromV3, chainId])

  return tokens
}
