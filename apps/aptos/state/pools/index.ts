import { atomWithReducer, selectAtom } from 'jotai/utils'
import { createAction, createReducer } from '@reduxjs/toolkit'
import { CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'
import { Pool, PoolSyrupUserResource } from './types'
import { getSyrupUserAddress } from './utils'

export interface PoolsState {
  data: Pool[]
  userDataLoaded: boolean
}

const initialState: PoolsState = {
  data: [],
  userDataLoaded: true,
}

export const fetchPoolListAction = createAction<Pool[]>('pools/fetchList')

export const setUserDataAction = createAction<Record<string, PoolSyrupUserResource>>('pools/setUserData')

const poolsReducer = createReducer<PoolsState>(initialState, (builder) =>
  builder
    .addCase(fetchPoolListAction, (state, { payload }) => {
      console.log('pools', payload)
      return {
        ...state,
        data: payload,
      }
    })
    .addCase(setUserDataAction, (state, { payload }) => {
      state.data.forEach((pool) => {
        const syrupUserAddress = getSyrupUserAddress(pool.stakingToken, pool.earningToken)
        const poolSyrupUserResource = payload[syrupUserAddress]
        if (poolSyrupUserResource) {
          // eslint-disable-next-line no-param-reassign
          pool.userData = {
            stakedBalance: CurrencyAmount.fromRawAmount(pool.stakingToken, poolSyrupUserResource.data.amount),
            pendingReward: CurrencyAmount.fromRawAmount(pool.earningToken, poolSyrupUserResource.data.reward_debt),
          }
        }
      })
      return state
    }),
)

export const poolsStateAtom = atomWithReducer(initialState, poolsReducer)

export const poolsListAtom = selectAtom(poolsStateAtom, (s) => s.data)

export const poolsUserDataLoaded = selectAtom(poolsStateAtom, (s) => s.userDataLoaded)
