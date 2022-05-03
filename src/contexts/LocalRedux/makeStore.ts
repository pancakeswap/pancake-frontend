import { configureStore } from '@reduxjs/toolkit'

export default function makeStore(reducer, preloadedState = undefined) {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
      }),
    preloadedState,
  })
}
