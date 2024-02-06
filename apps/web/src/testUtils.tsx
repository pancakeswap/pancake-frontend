/* eslint-disable class-methods-use-this */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render as rtlRender } from '@testing-library/react'
import Provider from 'Providers'
import { Provider as JotaiProvider } from 'jotai'
import { useHydrateAtoms } from 'jotai/utils'
import noop from 'lodash/noop'
import { RouterContext } from 'next/dist/shared/lib/router-context.shared-runtime'
import { NextRouter } from 'next/router'
import { initializeStore, makeStore } from 'state'
import { wagmiConfig } from 'utils/wagmi'
import { vi } from 'vitest'
import { WagmiConfig } from 'wagmi'

const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  forward: noop,
  query: {},
  push: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
}

export function renderWithProvider(
  ui,
  { preloadedState = undefined, store = initializeStore(preloadedState), router = {}, ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    return (
      <RouterContext.Provider value={{ ...mockRouter, ...router }}>
        <Provider store={store} dehydratedState={{}}>
          {children}
        </Provider>
      </RouterContext.Provider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

const HydrateAtoms = ({ initialValues, children }) => {
  // initialising on state with prop on render here
  useHydrateAtoms(initialValues)
  return children
}

export const createJotaiWrapper =
  (reduxState = undefined, testAtom, initState = undefined) =>
  ({ children }) =>
    (
      <Provider store={makeStore(reduxState)} dehydratedState={{}}>
        <JotaiProvider>
          {initState ? <HydrateAtoms initialValues={[[testAtom, initState]]}>{children}</HydrateAtoms> : children}
        </JotaiProvider>
      </Provider>
    )

export const createReduxWrapper =
  (initState = undefined) =>
  ({ children }) =>
    (
      <Provider store={makeStore(initState)} dehydratedState={{}}>
        {children}
      </Provider>
    )

export const createQueryClientWrapper =
  (queryClient) =>
  ({ children }) => {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

export const createWagmiWrapper =
  () =>
  ({ children }) => {
    const queryClient = new QueryClient()

    return (
      <QueryClientProvider client={queryClient}>
        <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      </QueryClientProvider>
    )
  }

// re-export everything
export * from '@testing-library/react'
