import { AbstractConnectorArguments, ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import warning from 'tiny-warning'

import { SendReturnResult, SendReturn, Send, SendOld } from './types'
import NoBscProviderError from './noBscProviderError'
import UserRejectedRequestError from './userRejectedRequestError'

const binanceChain = window.BinanceChain as any

function parseSendReturn(sendReturn: SendReturnResult | SendReturn): any {
  // eslint-disable-next-line no-prototype-builtins
  return sendReturn.hasOwnProperty('result') ? sendReturn.result : sendReturn
}
class BscConnector extends AbstractConnector {
  private ethAccount: string

  private ethChainId: string

  constructor(kwargs: AbstractConnectorArguments) {
    super(kwargs)

    this.handleNetworkChanged = this.handleNetworkChanged.bind(this)
    this.handleChainChanged = this.handleChainChanged.bind(this)
    this.handleAccountsChanged = this.handleAccountsChanged.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.ethAccount = 'eth_accounts'
    this.ethChainId = 'eth_chainId'
  }

  private handleChainChanged(chainId: string | number): void {
    this.emitUpdate({ chainId, provider: binanceChain })
  }

  private handleAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      this.emitDeactivate()
    } else {
      this.emitUpdate({ account: accounts[0] })
    }
  }

  private handleClose(): void {
    this.emitDeactivate()
  }

  private handleNetworkChanged(networkId: string | number): void {
    this.emitUpdate({ chainId: networkId, provider: binanceChain })
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!binanceChain) {
      throw new NoBscProviderError()
    }

    if (binanceChain.on) {
      binanceChain.on('chainChanged', this.handleChainChanged)
      binanceChain.on('accountsChanged', this.handleAccountsChanged)
      binanceChain.on('close', this.handleClose)
      binanceChain.on('networkChanged', this.handleNetworkChanged)
    }

    if (binanceChain.isMetaMask) {
      binanceChain.autoRefreshOnNetworkChange = false
    }

    // try to activate + get account via eth_requestAccounts
    let account
    try {
      account = await (binanceChain.send as Send)('eth_requestAccounts').then(
        (sendReturn) => parseSendReturn(sendReturn)[0],
      )
    } catch (error) {
      if ((error as any).code === 4001) {
        throw new UserRejectedRequestError()
      }
      warning(false, 'eth_requestAccounts was unsuccessful, falling back to enable')
    }

    // if unsuccessful, try enable
    if (!account) {
      // if enable is successful but doesn't return accounts, fall back to getAccount (not happy i have to do this...)
      account = await binanceChain.enable().then((sendReturn) => sendReturn && parseSendReturn(sendReturn)[0])
    }

    return { provider: binanceChain, ...(account ? { account } : {}) }
  }

  public async getProvider(): Promise<any> {
    this.ethChainId = 'eth_chainId'
    return binanceChain
  }

  public async getChainId(): Promise<number | string> {
    if (!binanceChain) {
      throw new NoBscProviderError()
    }

    let chainId
    try {
      chainId = await (binanceChain.send as Send)(this.ethChainId).then(parseSendReturn)
    } catch {
      warning(false, 'eth_chainId was unsuccessful, falling back to net_version')
    }

    if (!chainId) {
      try {
        chainId = await (binanceChain.send as Send)('net_version').then(parseSendReturn)
      } catch {
        warning(false, 'net_version was unsuccessful, falling back to net version v2')
      }
    }

    if (!chainId) {
      try {
        chainId = parseSendReturn((binanceChain.send as SendOld)({ method: 'net_version' }))
      } catch {
        warning(false, 'net_version v2 was unsuccessful, falling back to manual matches and static properties')
      }
    }

    if (!chainId) {
      if ((binanceChain as any).isDapper) {
        chainId = parseSendReturn((binanceChain as any).cachedResults.net_version)
      } else {
        chainId =
          (binanceChain as any).chainId ||
          (binanceChain as any).netVersion ||
          (binanceChain as any).networkVersion ||
          (binanceChain as any)._chainId
      }
    }

    return chainId
  }

  public async getAccount(): Promise<null | string> {
    if (!binanceChain) {
      throw new NoBscProviderError()
    }

    let account
    try {
      account = await (binanceChain.send as Send)(this.ethAccount).then((sendReturn) => parseSendReturn(sendReturn)[0])
    } catch {
      warning(false, 'eth_accounts was unsuccessful, falling back to enable')
    }

    if (!account) {
      try {
        account = await binanceChain.enable().then((sendReturn) => parseSendReturn(sendReturn)[0])
      } catch {
        warning(false, 'enable was unsuccessful, falling back to eth_accounts v2')
      }
    }

    if (!account) {
      account = parseSendReturn((binanceChain.send as SendOld)({ method: this.ethAccount }))[0]
    }

    return account
  }

  public deactivate() {
    if (binanceChain && binanceChain.removeListener) {
      binanceChain.removeListener('chainChanged', this.handleChainChanged)
      binanceChain.removeListener('accountsChanged', this.handleAccountsChanged)
      binanceChain.removeListener('close', this.handleClose)
      binanceChain.removeListener('networkChanged', this.handleNetworkChanged)
    }
  }

  public static async isAuthorized(): Promise<boolean> {
    if (!binanceChain) {
      return false
    }

    try {
      return await (binanceChain.send as Send)('eth_accounts').then((sendReturn) => {
        if (parseSendReturn(sendReturn).length > 0) {
          return true
        }
        return false
      })
    } catch {
      return false
    }
  }
}

export default BscConnector
