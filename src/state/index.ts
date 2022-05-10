import { combineReducers, configureStore } from '@reduxjs/toolkit'
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
import IndexedDBStorage from 'utils/IndexedDBStorage'
import burn from './burn/reducer'
import farmsReducer from './farms'
import farmsReducerV1 from './farmsV1'
import { updateVersion } from './global/actions'
import infoReducer from './info'
import lists from './lists/reducer'
import lotteryReducer from './lottery'
import mint from './mint/reducer'
import multicall from './multicall/reducer'
import nftMarketReducer from './nftMarket/reducer'
import poolsReducer from './pools'
import swap from './swap/reducer'
import transactions from './transactions/reducer'
import user from './user/reducer'
import limitOrders from './limitOrders/reducer'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

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
  1: (state) => {
    return {
      ...state,
    }
  },
}

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  blacklist: ['profile'],
  storage,
  version: 1,
  migrate: createMigrate(migrations, { debug: false }),
}

const ListsConfig = {
  key: 'lists',
  version: 1,
  serialize: false,
  deserialize: false,
  storage: IndexedDBStorage('lists'),
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    farms: farmsReducer,
    farmsV1: farmsReducerV1,
    pools: poolsReducer,
    lottery: lotteryReducer,
    info: infoReducer,
    nftMarket: nftMarketReducer,

    limitOrders,

    // Exchange
    user,
    transactions,
    swap,
    mint,
    burn,
    multicall,
    lists: persistReducer(ListsConfig, lists),
  }),
)

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
  }

  return _store
}

store = initializeStore()

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store

export const persistor = persistStore(store, undefined, () => {
  store.dispatch(updateVersion())
})

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
