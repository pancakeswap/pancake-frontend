import { configureStore } from '@reduxjs/toolkit'

export default function makeStore(reducer, preloadedState: any = undefined, extraArgument) {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument,
        },
      }),
    preloadedState,
  })
}
