import { ChainId } from '@pancakeswap/chains'
import { enumValues } from '@pancakeswap/utils/enumValues'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

type TokenAndPoolList = Record<ChainId, Record<'tokens' | 'pools', string[]>>

const createDefaultTokenAndPoolList = () => {
  const list = {} as TokenAndPoolList
  for (const chainId of enumValues(ChainId)) {
    list[chainId] = {
      pools: [],
      tokens: [],
    }
  }
  return list
}

const defaultTokenAndPoolList = createDefaultTokenAndPoolList()

const tokensAtom = atomWithStorage('pcs:infoSavedTOkensAndPools', defaultTokenAndPoolList)

/**
 * @deprecated
 */
const useInfoUserSavedTokensAndPools = (chainId: ChainId) => {
  const [lists, setLists] = useAtom(tokensAtom)

  const addToken = (newToken: string) => {
    setLists({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        tokens: new Set([newToken.toLowerCase(), ...lists[chainId].tokens]),
      },
    })
  }

  const removeToken = (token: string) => {
    setLists(() => ({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        tokens: lists[chainId].tokens.filter((t) => t !== token.toLowerCase()),
      },
    }))
  }

  const addPool = (newPool: string) => {
    setLists({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        pools: [...new Set([newPool.toLowerCase(), ...lists[chainId].pools])],
      },
    })
  }

  const removePool = (pool: string) => {
    setLists(() => ({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        pools: lists[chainId].pools.filter((p) => p !== pool.toLowerCase()),
      },
    }))
  }

  return {
    savedTokens: useMemo(() => [...new Set(lists[chainId]?.tokens ?? [])], [lists, chainId]),
    addToken,
    removeToken,
    savedPools: useMemo(() => [...new Set(lists[chainId]?.pools ?? [])], [lists, chainId]),
    addPool,
    removePool,
  }
}

export default useInfoUserSavedTokensAndPools
