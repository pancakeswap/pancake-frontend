import { TokenInfo } from '@pancakeswap/token-lists'
import { COINGECKO, COINGECKO_ETH, PANCAKE_ETH_DEFAULT, PANCAKE_ETH_MM, PANCAKE_EXTENDED } from 'config/constants/lists'

import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useTokenDatasSWR } from 'state/info/hooks'
import { multiChainName } from 'state/info/constant'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { useTokensData } from 'views/V3Info/hooks'
import { parseV2TokenData, parseV3TokenData } from './utils'

export const multiChainTokenList: Record<number, string[]> = {
  [ChainId.BSC]: [PANCAKE_EXTENDED, COINGECKO],
  [ChainId.ETHEREUM]: [PANCAKE_ETH_MM, PANCAKE_ETH_DEFAULT],
  [ChainId.ZKSYNC]: [],
  [ChainId.POLYGON_ZKEVM]: [],
  [ChainId.ARBITRUM_ONE]: [],
}

export const useMultiChianWhiteList = (chainId: ChainId) => {
  const listsByUrl = useAtomValue(selectorByUrlsAtom)
  const whiteLists = multiChainTokenList[chainId]
  const lists = useMemo(() => {
    let multiList: TokenInfo[] = []
    whiteLists.forEach((whiteList) => {
      const list = listsByUrl?.[whiteList]?.current
      multiList = [...multiList, ...(list?.tokens ?? [])]
    })
    return multiList
  }, [whiteLists, listsByUrl])

  const tokenList: string[] = useMemo(() => {
    if (!lists) return []
    return [...new Set(lists?.map((d) => d.address.toLowerCase()))]
  }, [lists])

  return tokenList
}

export const useTokenHighLightList = () => {
  const { chainId } = useActiveChainId()
  const whiteList = useMultiChianWhiteList(chainId)
  const allTokensFromV2 = useTokenDatasSWR(whiteList, true, multiChainName[chainId])
  const allV3TokensFromV3 = useTokensData(whiteList, chainId)

  const tokens = useMemo(() => {
    return {
      v2Tokens: allTokensFromV2?.map(parseV2TokenData) ?? [],
      v3Tokens: allV3TokensFromV3?.map(parseV3TokenData) ?? [],
    }
  }, [allTokensFromV2, allV3TokensFromV3])

  return tokens
}
