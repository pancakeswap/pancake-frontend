/* eslint-disable class-methods-use-this */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-unresolved */
import { render as rtlRender } from '@testing-library/react'
import Provider from 'Providers'
import { initializeStore, makeStore } from 'state'
import { RouterContext } from 'next/dist/shared/lib/router-context'
import { NextRouter } from 'next/router'
import ganache from 'ganache'
import { Web3Provider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'

const ganacheProvider = ganache.provider({
  chain: {
    chainId: 56,
  },
  wallet: {
    totalAccounts: 3,
  },
  fork: {
    url: 'https://bsc-dataseed1.defibit.io',
  },
})
const accounts = ganacheProvider.getInitialAccounts()
export const web3Provider = new Web3Provider(ganacheProvider as any)

export const wallets: Wallet[] = []

for (const account in accounts) {
  wallets.push(new Wallet(accounts[account].secretKey, web3Provider))
}

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

class TestConnector extends AbstractConnector {
  constructor() {
    super({ supportedChainIds: [56] })
  }

  public async activate() {
    return { provider: web3Provider, chainId: 56, account: wallets[0].address }
  }

  public async getProvider() {
    return web3Provider
  }

  public async getChainId(): Promise<number | string> {
    return 56
  }

  public async getAccount(): Promise<null | string> {
    return wallets[0].address
  }

  public deactivate() {
    //
  }
}

export const testConnector = new TestConnector()

export const useMockAccount = () => {
  const { activate, account } = useWeb3React()

  return {
    login: () => activate(testConnector),
    account,
  }
}

export const createWrapper =
  (initState = undefined) =>
  ({ children }) =>
    (
      <Provider store={makeStore(initState)} getLibrary={() => web3Provider}>
        {children}
      </Provider>
    )

// re-export everything
export * from '@testing-library/react'
