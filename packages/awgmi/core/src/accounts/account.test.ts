import { beforeEach, describe, expect, it } from 'vitest'

import { getAptosAccounts, setupClient } from '../../test'
import { MockConnector } from '../connectors/mock'
import { connect } from './connect'
import { getAccount } from './account'

const connector = new MockConnector({
  options: { account: getAptosAccounts()[0] },
})

describe('getAccount', () => {
  beforeEach(() => {
    setupClient()
  })

  describe('behavior', () => {
    it('not connected', async () => {
      expect(getAccount()).toMatchInlineSnapshot(`
        {
          "account": undefined,
          "connector": undefined,
          "isConnected": false,
          "isConnecting": false,
          "isDisconnected": true,
          "isReconnecting": false,
          "status": "disconnected",
        }
      `)
    })

    it('connected', async () => {
      await connect({ connector })
      expect(getAccount()).toMatchInlineSnapshot(`
        {
          "account": {
            "address": "0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493",
            "publicKey": "0x008ecf7d835b65f8a7252ec49563b84b37f37c76077962ccfef752fd0b8bb960",
          },
          "connector": "<MockConnector>",
          "isConnected": true,
          "isConnecting": false,
          "isDisconnected": false,
          "isReconnecting": false,
          "status": "connected",
        }
      `)
    })
  })
})
