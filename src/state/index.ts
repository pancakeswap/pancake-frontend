import { combineReducers, configureStore, createAction, CombinedState } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
  createMigrate,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import burn, { BurnState } from './burn/reducer'
import farmsReducer from './farms'
import { updateVersion } from './global/actions'
import infoReducer from './info'
import lists, { ListsState } from './lists/reducer'
import lotteryReducer from './lottery'
import mint, { MintState } from './mint/reducer'
import multicall, { MulticallState } from './multicall/reducer'
import nftMarketReducer from './nftMarket/reducer'
import poolsReducer, { initialPoolVaultState } from './pools'
import predictionsReducer from './predictions'
import swap, { SwapState } from './swap/reducer'
import transactions, { TransactionState } from './transactions/reducer'
import user, { UserState } from './user/reducer'
import { SerializedFarmsState, PoolsState, PredictionsState, LotteryState } from './types'
import { InfoState } from './info/types'
import { State } from './nftMarket/types'

const PERSISTED_KEYS: string[] = ['user', 'transactions', 'lists']

export const resetUserState = createAction<void>('global/resetUserState')

const migrations = {
  0: (state) => {
    // migration add userPredictionChainlinkChartDisclaimerShow
    return {
      ...state,
      user: {
        ...state?.user,
        userPredictionChainlinkChartDisclaimerShow: true,
      },
    }
  },
}

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  blacklist: ['profile'],
  storage,
  version: 0,
  migrate: createMigrate(migrations, { debug: false }),
}

const allReducers = combineReducers({
  farms: farmsReducer,
  pools: poolsReducer,
  predictions: predictionsReducer,
  lottery: lotteryReducer,
  info: infoReducer,
  nftMarket: nftMarketReducer,

  // Exchange
  user,
  transactions,
  swap,
  mint,
  burn,
  multicall,
  lists,
})

const rootReducer = (state, action) => {
  if (action.type === 'global/resetUserState') {
    // eslint-disable-next-line no-param-reassign
    state = {
      ...state,
      farms: {
        ...state.farms,
        data: state.farms.data.map((farm) => {
          return {
            ...farm,
            userData: {
              allowance: '0',
              tokenBalance: '0',
              stakedBalance: '0',
              earnings: '0',
            },
          }
        }),
        userDataLoaded: false,
      },
      pools: {
        ...state.pools,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data: state.pools.data.map(({ userData, ...pool }) => ({ ...pool })),
        userDataLoaded: false,
        cakeVault: { ...state.pools.cakeVault, userData: initialPoolVaultState.userData },
        ifoPool: { ...state.pools.ifoPool, userData: initialPoolVaultState.userData },
      },
    } as CombinedState<{
      farms: SerializedFarmsState
      pools: PoolsState
      predictions: PredictionsState
      lottery: LotteryState
      info: InfoState
      nftMarket: State
      user: UserState
      transactions: TransactionState
      swap: SwapState
      mint: MintState
      burn: BurnState
      multicall: MulticallState
      lists: ListsState
    }>
  }

  return allReducers(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore>

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
    store.dispatch(updateVersion())
  }

  return _store
}

store = initializeStore()

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export default store

export const persistor = persistStore(store)

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
