// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'
import { Eip1193Bridge } from '@ethersproject/experimental/lib/eip1193-bridge'

/**
 * This is random key from https://asecuritysite.com/encryption/ethadd
 * One test in swap.test.ts requires to have some BNB amount available to test swap confirmation modal
 * Seems that there are some problems with usying Cypress.env('INTEGRATION_TEST_PRIVATE_KEY') in CI
 * And sharing some key here is not safe as somebody can empty it and test will fail
 * For now that test is skipped
 */
const TEST_PRIVATE_KEY = '0x60aec29d4b415dfeff21e7f7d07ff2aca0e26f129fe52fc4e86f1b943748ff96'

// address of the above key
export const TEST_ADDRESS_NEVER_USE = new Wallet(TEST_PRIVATE_KEY).address

export const TEST_ADDRESS_NEVER_USE_SHORTENED = `0x...${TEST_ADDRESS_NEVER_USE.substr(-4, 4)}`

class CustomizedBridge extends Eip1193Bridge {
  async sendAsync(...args) {
    console.debug('sendAsync called', ...args)
    return this.send(...args)
  }

  async send(...args) {
    console.debug('send called', ...args)
    const isCallbackForm = typeof args[0] === 'object' && typeof args[1] === 'function'
    let callback
    let method
    let params
    if (isCallbackForm) {
      callback = args[1]
      // eslint-disable-next-line prefer-destructuring
      method = args[0].method
      // eslint-disable-next-line prefer-destructuring
      params = args[0].params
    } else {
      method = args[0]
      params = args[1]
    }
    if (method === 'eth_requestAccounts' || method === 'eth_accounts') {
      if (isCallbackForm) {
        return callback({ result: [TEST_ADDRESS_NEVER_USE] })
      }
      return Promise.resolve([TEST_ADDRESS_NEVER_USE])
    }
    if (method === 'eth_chainId') {
      if (isCallbackForm) {
        return callback(null, { result: '0x38' })
      }
      return Promise.resolve('0x38')
    }
    try {
      const result = await super.send(method, params)
      console.debug('result received', method, params, result)
      if (isCallbackForm) {
        return callback(null, { result })
      }
      return result
    } catch (error) {
      if (isCallbackForm) {
        return callback(error, null)
      }
      throw error
    }
  }
}

// sets up the injected provider to be a mock ethereum provider with the given mnemonic/index
Cypress.Commands.overwrite('visit', (original, url, options) => {
  return original(url, {
    ...options,
    onBeforeLoad(win) {
      if (options && options.onBeforeLoad) {
        options.onBeforeLoad(win)
      }
      win.localStorage.clear()
      const provider = new JsonRpcProvider('https://bsc-dataseed.binance.org/', 56)
      const signer = new Wallet(TEST_PRIVATE_KEY, provider)
      // eslint-disable-next-line no-param-reassign
      win.ethereum = new CustomizedBridge(signer, provider)
      win.localStorage.setItem('connectorIdv2', 'injected')
    },
  })
})

Cypress.on('uncaught:exception', () => {
  // returning false here prevents Cypress from failing the test
  // Needed for trading competition page since it throws unhandled rejection error
  return false
})

Cypress.Commands.add('getBySel', (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args)
})

Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message))

/* eslint-disable */
Cypress.on('window:before:load', (win) => {
  win.sfHeader = Cypress.env('SF_HEADER')
})
