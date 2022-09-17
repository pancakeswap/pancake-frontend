/* eslint-disable no-param-reassign */
import { SerializedToken } from '@pancakeswap/swap-sdk-core'
import { SerializedWrappedToken, deserializeToken } from '@pancakeswap/token-lists'
import { useActiveChainId } from 'hooks/useNetwork'
import { atom, useAtom } from 'jotai'
import { atomWithStorage, createJSONStorage } from 'jotai/utils'
import { useCallback, useMemo } from 'react'

const USER_AUDIO_PLAY_KEY = 'pcs:audio-play'

const userAudioPlayAtom = atom('0')

export const userAtomWithLocalStorage = atom(
  (get) => get(userAudioPlayAtom),
  (_get, set, mode: boolean) => {
    const on = mode ? '1' : '0'
    set(userAudioPlayAtom, on)
    localStorage.setItem(USER_AUDIO_PLAY_KEY, on)
  },
)

userAtomWithLocalStorage.onMount = (set) => {
  const item = localStorage.getItem(USER_AUDIO_PLAY_KEY)
  if (item && (item === '0' || item === '1')) {
    set(item === '1')
  }
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
          // eslint-disable-next-line no-param-reassign
          state = {}
        }
        state[serializedToken.chainId] = state[serializedToken.chainId] || {}
        state[serializedToken.chainId][serializedToken.address] = serializedToken

        return state
      })
    },
    [set],
  )
}
