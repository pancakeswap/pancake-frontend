import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import Contracts from './lib/contracts'
import { Account } from './lib/accounts'
import EVM from './lib/evm'
import { contractAddresses } from './lib/constants'

export default class Sushi {
  constructor(provider, networkId, testing, options) {
    let realProvider

    if (typeof provider === 'string') {
      if (provider.includes('wss')) {
        realProvider = new Web3.providers.WebsocketProvider(provider, options.ethereumNodeTimeout || 10000)
      } else {
        realProvider = new Web3.providers.HttpProvider(provider, options.ethereumNodeTimeout || 10000)
      }
    } else {
      realProvider = provider
    }

    this.web3 = new Web3(realProvider)

    if (testing) {
      this.testing = new EVM(realProvider)
      this.snapshot = this.testing.snapshot()
    }

    if (options.defaultAccount) {
      this.web3.eth.defaultAccount = options.defaultAccount
    }
    this.contracts = new Contracts(realProvider, networkId, this.web3, options)
    this.sushiAddress = contractAddresses.sushi[networkId]
    this.masterChefAddress = contractAddresses.masterChef[networkId]
    this.wbnbAddress = contractAddresses.wbnb[networkId]
    this.syrupAddress = contractAddresses.syrup[networkId]
    this.sousChefAddress = contractAddresses.sousChef[networkId]
  }

  async resetEVM() {
    this.testing.resetEVM(this.snapshot)
  }

  addAccount(address, number) {
    this.accounts.push(new Account(this.contracts, address, number))
  }

  setProvider(provider, networkId) {
    this.web3.setProvider(provider)
    this.contracts.setProvider(provider, networkId)
    this.operation.setNetworkId(networkId)
  }

  setDefaultAccount(account) {
    this.web3.eth.defaultAccount = account
    this.contracts.setDefaultAccount(account)
  }

  getDefaultAccount() {
    return this.web3.eth.defaultAccount
  }

  loadAccount(account) {
    const newAccount = this.web3.eth.accounts.wallet.add(account.privateKey)

    if (!newAccount || (account.address && account.address.toLowerCase() !== newAccount.address.toLowerCase())) {
      throw new Error(`Loaded account address mismatch.
        Expected ${account.address}, got ${newAccount ? newAccount.address : null}`)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  toBigN(a) {
    return BigNumber(a)
  }
}
