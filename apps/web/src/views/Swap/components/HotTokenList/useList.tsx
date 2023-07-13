import { TokenInfo } from '@pancakeswap/token-lists'
import { COINGECKO, COINGECKO_ETH, PANCAKE_ETH_DEFAULT, PANCAKE_ETH_MM, PANCAKE_EXTENDED } from 'config/constants/lists'

import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { useAllTokenDataSWR } from 'state/info/hooks'
import { multiChainName } from 'state/info/constant'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { useTopTokensData } from 'views/V3Info/hooks'
import { parseV2TokenData, parseV3TokenData } from './utils'

export const multiChainTokenList: Record<number, string[]> = {
  [ChainId.BSC]: [PANCAKE_EXTENDED, COINGECKO],
  [ChainId.ETHEREUM]: [PANCAKE_ETH_MM, PANCAKE_ETH_DEFAULT, COINGECKO_ETH],
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

  const tokenList: Record<string, string> = useMemo(() => {
    if (!lists) return []
    return lists?.map((d) => d.address.toLowerCase()).reduce((a, v) => ({ ...a, [v]: v }), {})
  }, [lists])

  return tokenList
}

export const useTokenHighLightList = () => {
  const { chainId } = useActiveChainId()
  const whiteList = useMultiChianWhiteList(chainId)

  const allTokensFromV2 = useAllTokenDataSWR(multiChainName[chainId])
  const allV3TokensFromV3 = useTopTokensData(chainId)

  const tokens = useMemo(() => {
    return {
      v2Tokens:
        Object.values(allTokensFromV2 ?? {})
          ?.map((d) => d.data)
          ?.filter((d) => whiteList[d.address.toLowerCase()])
          ?.map(parseV2TokenData) ?? [],
      v3Tokens:
        Object.values(allV3TokensFromV3 ?? {})
          ?.filter((d) => whiteList[d.address.toLowerCase()])
          ?.map(parseV3TokenData) ?? [],
    }
  }, [allTokensFromV2, allV3TokensFromV3, whiteList])

  return tokens
}
