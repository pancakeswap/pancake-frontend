/* eslint-disable no-param-reassign */
import { SerializedToken } from '@pancakeswap/aptos-swap-sdk'
import { SerializedWrappedToken, deserializeToken } from '@pancakeswap/token-lists'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useNetwork'
import { atom, useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useCallback, useMemo } from 'react'

const USER_AUDIO_PLAY_KEY = 'pcs:audio-play'

const userAudioPlayAtom = atom('0')

const userAudioAtomWithLocalStorage = atom(
  (get) => get(userAudioPlayAtom),
  (_get, set, mode: boolean) => {
    const on = mode ? '1' : '0'
    set(userAudioPlayAtom, on)
    localStorage.setItem(USER_AUDIO_PLAY_KEY, on)
  },
)

userAudioAtomWithLocalStorage.onMount = (set) => {
  const item = localStorage.getItem(USER_AUDIO_PLAY_KEY)
  if (item && (item === '0' || item === '1')) {
    set(item === '1')
  }
}

export function useAudioPlay() {
  return useAtom(userAudioAtomWithLocalStorage)
}

const USER_SLIPPAGE_KEY = 'pcs:slippage'
const userSlippageAtom = atom(INITIAL_ALLOWED_SLIPPAGE)

export const userSlippageAtomWithLocalStorage = atom(
  (get) => get(userSlippageAtom),
  (_get, set, slippage: number) => {
    if (typeof slippage === 'number') {
      set(userSlippageAtom, slippage)
      localStorage.setItem(USER_SLIPPAGE_KEY, String(slippage))
    }
  },
)

userSlippageAtomWithLocalStorage.onMount = (set) => {
  const item = localStorage.getItem(USER_SLIPPAGE_KEY)
  if (item && Number.isFinite(+item)) {
    set(+item)
  }
}

export const useUserSlippage = () => {
  return useAtom(userSlippageAtomWithLocalStorage)
}

const USER_ADD_TOKENS = 'pcs:user-add-tokens'

const storage = createJSONStorage<UserAddedTokens>(() => localStorage)

type UserAddedTokens = {
  [chainId: number]: {
    [address: string]: SerializedWrappedToken
  }
}

const userAddTokensAtom = atomWithStorage<UserAddedTokens>(USER_ADD_TOKENS, {}, storage)

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
        state[serializedToken.chainId] = state[serializedToken.chainId] || {}
        state[serializedToken.chainId][serializedToken.address] = serializedToken

        return state
      })
    },
    [set],
  )
}
