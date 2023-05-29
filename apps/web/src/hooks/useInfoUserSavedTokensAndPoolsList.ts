import { ChainId } from '@pancakeswap/sdk'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

type TokenAndPoolList = Record<ChainId, Record<'tokens' | 'pools', string[]>>

const defaultTokenAndPoolList: TokenAndPoolList = {
  [ChainId.ETHEREUM]: {
    tokens: [],
    pools: [],
  },
  [ChainId.BSC]: {
    tokens: [],
    pools: [],
  },
  [ChainId.GOERLI]: {
    tokens: [],
    pools: [],
  },
  [ChainId.BSC_TESTNET]: {
    tokens: [],
    pools: [],
  },
  [ChainId.ARBITRUM_ONE]: {
    tokens: [],
    pools: [],
  },
  [ChainId.ARBITRUM_GOERLI]: {
    tokens: [],
    pools: [],
  },
  [ChainId.POLYGON_ZKEVM]: {
    tokens: [],
    pools: [],
  },
  [ChainId.POLYGON_ZKEVM_TESTNET]: {
    tokens: [],
    pools: [],
  },
  [ChainId.ZKSYNC]: {
    tokens: [],
    pools: [],
  },
  [ChainId.ZKSYNC_TESTNET]: {
    tokens: [],
    pools: [],
  },
  [ChainId.LINEA_TESTNET]: {
    tokens: [],
    pools: [],
  },
}

const tokensAtom = atomWithStorage('pcs:infoSavedTOkensAndPools', defaultTokenAndPoolList)

const useInfoUserSavedTokensAndPools = (chainId: ChainId) => {
  const [lists, setLists] = useAtom(tokensAtom)

  const addToken = (newToken: string) => {
    setLists({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        tokens: [newToken, ...lists[chainId].tokens],
      },
    })
  }

  const removeToken = (token: string) => {
    setLists(() => ({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        tokens: lists[chainId].tokens.filter((t) => t !== token),
      },
    }))
  }

  const addPool = (newPool: string) => {
    setLists({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        pools: [newPool, ...lists[chainId].pools],
      },
    })
  }

  const removePool = (pool: string) => {
    setLists(() => ({
      ...lists,
      [chainId]: {
        ...lists[chainId],
        pools: lists[chainId].pools.filter((p) => p !== pool),
      },
    }))
  }

  return {
    savedTokens: lists[chainId]?.tokens ?? [],
    addToken,
    removeToken,
    savedPools: lists[chainId]?.pools ?? [],
    addPool,
    removePool,
  }
}

export default useInfoUserSavedTokensAndPools
