/* eslint-disable class-methods-use-this */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
import { render as rtlRender } from '@testing-library/react'
import Provider from 'Providers'
import { initializeStore, makeStore } from 'state'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { NextRouter } from 'next/router'
import { SWRConfig } from 'swr'

const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
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
        <Provider store={store}>{children}</Provider>
      </RouterContext.Provider>
    )
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}

export const createReduxWrapper =
  (initState = undefined) =>
  ({ children }) =>
    <Provider store={makeStore(initState)}>{children}</Provider>

export const createSWRWrapper =
  (fallbackData = undefined) =>
  ({ children }) =>
    <SWRConfig value={{ fallback: fallbackData }}>{children}</SWRConfig>

// re-export everything
export * from '@testing-library/react'
