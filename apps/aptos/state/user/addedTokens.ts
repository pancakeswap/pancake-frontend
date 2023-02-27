import { SerializedToken } from '@pancakeswap/aptos-swap-sdk'
import { SerializedWrappedToken, deserializeToken } from '@pancakeswap/token-lists'
import { useActiveChainId } from 'hooks/useNetwork'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useMemo } from 'react'

const USER_ADD_TOKENS = 'pcs:user-add-tokens'

type UserAddedTokens = {
  [chainId: number]: {
    [address: string]: SerializedWrappedToken
  }
}

const userAddTokensAtom = atomWithStorage<UserAddedTokens>(USER_ADD_TOKENS, {})

export const useRemoveUserAddedToken = () => {
  const [, set] = useAtom(userAddTokensAtom)

  return useCallback(
    (chainId: number, address: string) => {
      set((s) => {
        if (!s) {
          return {}
        }
        if (s?.[chainId]?.[address]) {
          // eslint-disable-next-line no-param-reassign
          delete s[chainId][address]
        }
        return { ...s }
      })
    },
    [set],
  )
}

export const useUserAddedTokens = () => {
  const chainId = useActiveChainId()
  const [userAdded] = useAtom(userAddTokensAtom)

  return useMemo(
    () => (chainId ? Object.values(userAdded[chainId] ?? {}) : []).map(deserializeToken),
    [chainId, userAdded],
  )
}

export const useAddUserToken = () => {
  const [, set] = useAtom(userAddTokensAtom)

  return useCallback(
    (serializedToken: SerializedToken) => {
      set((state) => {
        if (!state) {
          return {}
        }
        return {
          ...state,
          [serializedToken.chainId]: {
            ...(state[serializedToken.chainId] || {}),
            [serializedToken.address]: serializedToken,
          },
        }
      })
    },
    [set],
  )
}
