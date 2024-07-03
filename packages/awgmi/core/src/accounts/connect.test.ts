import { beforeEach, describe, expect, it } from 'vitest'

import { getAptosAccounts, setupClient } from '../../test'
import { getClient } from '../client'
import { MockConnector } from '../connectors/mock'
import { connect } from './connect'

const connector = new MockConnector({
  options: { account: getAptosAccounts()[0] },
})

describe('connect', () => {
  beforeEach(() => {
    setupClient()
  })

  describe('args', () => {
    it('connector', async () => {
      expect(await connect({ connector })).toMatchInlineSnapshot(`
        {
          "account": {
            "address": "0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493",
            "publicKey": "0x008ecf7d835b65f8a7252ec49563b84b37f37c76077962ccfef752fd0b8bb960",
          },
          "connector": "<MockConnector>",
          "network": "devnet",
          "provider": "<MockProvider>",
        }
      `)
    })
  })

  describe('behavior', () => {
    it('connects to supported chain', async () => {
      const result = await connect({ connector })
      expect(result).toMatchInlineSnapshot(`
        {
          "account": {
            "address": "0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493",
            "publicKey": "0x008ecf7d835b65f8a7252ec49563b84b37f37c76077962ccfef752fd0b8bb960",
          },
          "connector": "<MockConnector>",
          "network": "devnet",
          "provider": "<MockProvider>",
        }
      `)
    })

    it('status changes on connection', async () => {
      expect(getClient().status).toEqual('disconnected')
      setTimeout(() => expect(getClient().status).toEqual('connecting'), 0)
      await connect({ connector })
      expect(getClient().status).toEqual('connected')
    })

    it('is already connected', async () => {
      await connect({ connector })
      await expect(connect({ connector })).rejects.toThrowErrorMatchingInlineSnapshot(
        `[ConnectorAlreadyConnectedError: Connector already connected]`,
      )
    })

    it('throws when user rejects request', async () => {
      await expect(
        connect({
          connector: new MockConnector({
            options: {
              flags: { failConnect: true },
              account: getAptosAccounts()[0],
            },
          }),
        }),
      ).rejects.toThrowErrorMatchingInlineSnapshot(`[UserRejectedRequestError: User rejected request]`)
      expect(getClient().status).toEqual('disconnected')
    })

    it('status changes on user rejection', async () => {
      expect(getClient().status).toEqual('disconnected')
      await expect(
        connect({
          connector: new MockConnector({
            options: {
              flags: { failConnect: true },
              account: getAptosAccounts()[0],
            },
          }),
        }),
      ).rejects.toThrowError()
      expect(getClient().status).toEqual('disconnected')
    })
  })
})
