import { useCallback, useEffect } from 'react'
import semver from 'semver'
import mpService from '@binance/mp-service'
import { useWeb3React } from '@web3-react/core'

/* eslint max-classes-per-file: off -- noop */
import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'
import { captureException } from '@binance/sentry-miniapp'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'

const __DEV__ = process.env.NODE_ENV !== 'production'

class NoEthereumProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No Ethereum provider was found on getWeb3Provider.'
  }
}

class UserRejectedRequestError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'The user rejected the request.'
  }
}

class BnInjectedConnector extends AbstractConnector {
  bnEthereum: any

  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs)

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.bnEthereum = bn.getWeb3Provider()
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (__DEV__) {
      console.log("Handling 'accountsChanged' event with payload", accounts)
    }
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleNetworkChanged(networkId: string | number): void {
    if (__DEV__) {
      console.log("Handling 'networkChanged' event with payload", networkId)
    }
    this.emitUpdate({ chainId: networkId, provider: this.bnEthereum })
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.bnEthereum) {
      throw new NoEthereumProviderError()
    }

    this.bnEthereum.on('accountsChanged', this.handleAccountsChanged)
    this.bnEthereum.on('networkChanged', this.handleNetworkChanged)
    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await this.bnEthereum
        .request({
          method: 'eth_requestAccounts',
        })
        .then((sendReturn) => sendReturn[0])
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful')
    }
    return { provider: this.bnEthereum, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    return this.bnEthereum
  }

  public async getChainId(): Promise<number | string> {
    if (!this.bnEthereum) {
      throw new NoEthereumProviderError()
    }

    let chainId
    try {
      chainId = await this.bnEthereum.request({
        method: 'eth_chainId',
      })
    } catch (error) {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }
    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!this.bnEthereum) {
      throw new NoEthereumProviderError()
    }

    let account
    try {
      account = await this.bnEthereum
        .request({
          method: 'eth_accounts',
        })
        .then((sendReturn) => sendReturn[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful')
    }

    return account
  }

  public deactivate() {
    if (this.bnEthereum && this.bnEthereum.removeListener) {
      this.bnEthereum.removeListener('accountsChanged', this.handleAccountsChanged)
      this.bnEthereum.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  public async isAuthorized(): Promise<boolean> {
    if (!this.bnEthereum) {
      return false
    }

    try {
      return await this.bnEthereum
        .request({
          method: 'eth_accounts',
        })
        .then((sendReturn) => {
          if (sendReturn.length > 0) {
            return true
          }
          return false
        })
    } catch {
      return false
    }
  }
}

const injected = new BnInjectedConnector({ supportedChainIds: [56, 97] })

const useActive = () => {
  const { activate } = useWeb3React()
  return useCallback(
    () =>
      activate(injected, (error) => {
        console.log('🚀 ~ file: useEagerConnect.ts ~ line 183 ~ activate ~ error', error)
        captureException(error)
      }),
    [activate],
  )
}
export const useEagerConnect = () => {
  const handleActive = useActive()

  useEffect(() => {
    const main = async () => {
      const address = await injected.getAccount()
      if (address) {
        handleActive()
      }
    }
    main()
  }, [])
}

const isOldVersion = () => {
  const { version } = getSystemInfoSync()
  return semver.lt(version, '2.43.0')
}

export const useActiveHandle = () => {
  const handleActive = useActive()
  return async () => {
    /**
     *  backward
     */
    const address = await injected.getAccount()
    let isLogin = true
    if (!address && isOldVersion()) {
      injected.bnEthereum.ready = true
      injected.bnEthereum
        .request({
          method: 'personal_sign',
          params: ['test'],
        })
        .catch((error) => {
          if (error && error?._code === '600005') {
            isLogin = false
            mpService.login().then(() => {
              handleActive()
            })
          }
        })
      injected.bnEthereum.ready = false
    }
    if (isLogin) {
      handleActive()
    }
    console.log('🚀 ~ file: useEagerConnect.bmp.ts ~ line 199 v5 ~ return ~ address', address)
  }
}
export default useEagerConnect
