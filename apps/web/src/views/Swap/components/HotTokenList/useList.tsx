import { PANCAKE_EXTENDED } from 'config/constants/lists'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { selectorByUrlsAtom } from 'state/lists/hooks'
import { multiChainName } from 'state/info/constant'
import { useTokenDatasQuery, useAllTokenHighLight } from 'state/info/hooks'
import { useTokensData } from 'views/V3Info/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/chains'
import { parseV3TokenData, parseV2TokenData } from './utils'

export const useChainWhiteList = (chainId?: number) => {
  const listsByUrl = useAtomValue(selectorByUrlsAtom)
  const whiteList = useMemo(() => {
    const list = listsByUrl[PANCAKE_EXTENDED]?.current
    return list ? list.tokens.map((t) => t.address.toLowerCase()) : []
  }, [listsByUrl])
  if (chainId !== ChainId.BSC) return null
  return whiteList
}

export const useTokenHighLightList = () => {
  const { chainId } = useActiveChainId()
  const chainWhiteList = useChainWhiteList(chainId)
  const allTokensFromWhiteList = useTokenDatasQuery(chainWhiteList || [], false)
  const allTokensFromChain = useAllTokenHighLight({
    enable: Boolean(!chainWhiteList && chainId),
    targetChainName: chainId ? multiChainName[chainId] : undefined,
  })
  const tokenAddresses: string[] = useMemo(
    () => allTokensFromChain?.map(({ address }) => address) || [],
    [allTokensFromChain],
  )
  const allV3TokensFromV3 = useTokensData(chainWhiteList || tokenAddresses, chainId)

  const tokens = useMemo(() => {
    return {
      v2Tokens: (allTokensFromWhiteList || allTokensFromChain)?.map(parseV2TokenData),
      v3Tokens: allV3TokensFromV3?.map(parseV3TokenData) ?? [],
    }
  }, [allTokensFromWhiteList, allTokensFromChain, allV3TokensFromV3])

  return tokens
}
