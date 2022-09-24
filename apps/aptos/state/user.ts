/* eslint-disable no-param-reassign */
import { SerializedToken } from '@pancakeswap/aptos-swap-sdk'
import { SerializedWrappedToken, deserializeToken } from '@pancakeswap/token-lists'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useNetwork'
import { atom, useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useCallback, useMemo } from 'react'

const userAudioPlayAtom = atomWithStorage<'0' | '1'>('pcs:audio-play', '0')

const userAudioAtomWithLocalStorage = atom(
  (get) => {
    const got = get(userAudioPlayAtom)
    if (got === '1') {
      return true
    }
    return false
  },
  (_get, set, mode: boolean) => {
    const on = mode ? '1' : '0'
    set(userAudioPlayAtom, on)
  },
)

export function useAudioPlay() {
  return useAtom(userAudioAtomWithLocalStorage)
}

const userSlippageAtom = atomWithStorage('pcs:slippage', INITIAL_ALLOWED_SLIPPAGE)

export const userSlippageAtomWithLocalStorage = atom(
  (get) => get(userSlippageAtom),
  (_get, set, slippage: number) => {
    if (typeof slippage === 'number') {
      set(userSlippageAtom, slippage)
    }
  },
)

export const useUserSlippage = () => {
  return useAtom(userSlippageAtomWithLocalStorage)
}

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
          delete s[chainId][address]
        }
        return s
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
