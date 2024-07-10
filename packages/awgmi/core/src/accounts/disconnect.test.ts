import { beforeEach, describe, expect, it } from 'vitest'

import { getAptosAccounts, setupClient } from '../../test'
import { Client } from '../client'
import { MockConnector } from '../connectors/mock'
import { connect } from './connect'
import { disconnect } from './disconnect'

const connector = new MockConnector({
  options: { account: getAptosAccounts()[0] },
})

describe('disconnect', () => {
  let client: Client
  beforeEach(() => {
    client = setupClient()
  })

  describe('behavior', () => {
    it('can disconnect connected account', async () => {
      await connect({ connector })
      expect(client.data?.account).toMatchInlineSnapshot(`
        {
          "address": "0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493",
          "publicKey": "0x008ecf7d835b65f8a7252ec49563b84b37f37c76077962ccfef752fd0b8bb960",
        }
      `)

      await disconnect()
      expect(client.data?.account).toMatchInlineSnapshot(`undefined`)
    })

    it('not connected', async () => {
      await disconnect()
      expect(client.data?.account).toMatchInlineSnapshot(`undefined`)
    })
  })
})
