import { Coin, Pair } from '@pancakeswap/aptos-swap-sdk'
import { deserializeToken, SerializedWrappedToken } from '@pancakeswap/token-lists'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config/constants/exchange'
import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { atomWithStorage, useAtomValue, useReducerAtom } from 'jotai/utils'
import flatMap from 'lodash/flatMap'
import { useCallback, useMemo } from 'react'

export interface SerializedPair {
  token0: SerializedWrappedToken
  token1: SerializedWrappedToken
}

interface AddedPairsState {
  [chainId: number]: {
    // keyed by token0Address:token1Address
    [key: string]: SerializedPair
  }
}

const initialState: AddedPairsState = {}

export const addSerializedPair = createAction<{ serializedPair: SerializedPair }>('user/addSerializedPair')
export const removeSerializedPair = createAction<{ chainId: number; tokenAAddress: string; tokenBAddress: string }>(
  'user/removeSerializedPair',
)

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
}

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(addSerializedPair, (state, { payload: { serializedPair } }) => {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.address !== serializedPair.token1.address
      ) {
        const { chainId } = serializedPair.token0
        state[chainId] = state[chainId] || {}
        state[chainId][pairKey(serializedPair.token0.address, serializedPair.token1.address)] = serializedPair
      }
    })
    .addCase(removeSerializedPair, (state, { payload: { chainId, tokenAAddress, tokenBAddress } }) => {
      if (state[chainId]) {
        // just delete both keys if either exists
        delete state[chainId][pairKey(tokenAAddress, tokenBAddress)]
        delete state[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
    })
})

const userAddPairsAtom = atomWithStorage<AddedPairsState>('pcs:user-add-pairs', initialState)

// TODO: aptos merged
export function useTrackedTokenPairs(): [Coin, Coin][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useOfficialsAndUserAddedTokens()

  // pinned pairs
  const pinnedPairs = useMemo(() => (chainId ? PINNED_PAIRS[chainId] ?? [] : []), [chainId])

  // pairs for every token against every base
  const generatedPairs: [Coin, Coin][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop through all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null
                  }
                  return [base, token]
                })
                .filter((p): p is [Coin, Coin] => p !== null)
            )
          })
        : [],
    [tokens, chainId],
  )

  const savedSerializedPairs = useAtomValue(userAddPairsAtom)

  const userPairs: [Coin, Coin][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [deserializeToken(forChain[pairId].token0), deserializeToken(forChain[pairId].token1)]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () => userPairs.concat(generatedPairs).concat(pinnedPairs),
    [generatedPairs, pinnedPairs, userPairs],
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Coin, Coin] }>((memo, [tokenA, tokenB]) => {
      const sorted = tokenA.sortsBefore(tokenB)
      const key = sorted ? `${tokenA.address}:${tokenB.address}` : `${tokenB.address}:${tokenA.address}`
      if (memo[key]) return memo
      memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
      return memo
    }, {})

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

function serializePair(pair: Pair): SerializedPair {
  return {
    token0: pair.token0.serialize,
    token1: pair.token1.serialize,
  }
}

export function usePairAdder(): (pair: Pair) => void {
  const [, dispatch] = useReducerAtom(userAddPairsAtom, reducer)

  return useCallback(
    (pair: Pair) => {
      dispatch(addSerializedPair({ serializedPair: serializePair(pair) }))
    },
    [dispatch],
  )
}
