import { describe, expect, it } from 'vitest'

import { getAptosAccounts, getAptosClient } from '../test'
import { Client, createClient, getClient } from './client'
import { MockConnector } from './connectors/mock'
import { createStorage } from './storage'

const provider = getAptosClient()

describe('createClient', () => {
  it('returns client', () => {
    const client = createClient({
      provider,
    })
    expect(client).toBeInstanceOf(Client)
  })

  describe('config', () => {
    describe('autoConnect', () => {
      describe('true', () => {
        it('disconnected', async () => {
          const client = createClient({
            autoConnect: true,
            provider,
          })
          expect(client.status).toMatchInlineSnapshot(`"connecting"`)
          await client.autoConnect()
          expect(client.status).toMatchInlineSnapshot(`"disconnected"`)
        })

        it('connected', async () => {
          const client = createClient({
            autoConnect: true,
            connectors: [
              new MockConnector({
                options: {
                  flags: { isAuthorized: true },
                  account: getAptosAccounts()[0],
                },
              }),
            ],
            provider,
          })
          expect(client.status).toMatchInlineSnapshot(`"connecting"`)
          await client.autoConnect()
          expect(client.status).toMatchInlineSnapshot(`"connected"`)
        })

        it('reconnected', async () => {
          const localStorage: Record<string, any> = {}
          const storage = createStorage({
            storage: {
              getItem: (key) => localStorage[key],
              // eslint-disable-next-line no-return-assign
              setItem: (key, value) => (localStorage[key] = JSON.stringify(value)),
              removeItem: (key) => delete localStorage[key],
            },
          })
          storage.setItem('store', {
            state: {
              data: {
                account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
              },
            },
          })
          const client = createClient({
            autoConnect: true,
            connectors: [
              new MockConnector({
                options: {
                  flags: { isAuthorized: true },
                  account: getAptosAccounts()[0],
                },
              }),
            ],
            provider,
            storage,
          })
          expect(client.status).toMatchInlineSnapshot(`"reconnecting"`)
          await client.autoConnect()
          expect(client.status).toMatchInlineSnapshot(`"connected"`)
        })
      })

      it('false', () => {
        const client = createClient({
          autoConnect: false,
          provider,
        })
        expect(client.status).toMatchInlineSnapshot(`"disconnected"`)
      })
    })

    describe('connectors', () => {
      it('default', () => {
        const client = createClient({
          provider,
        })
        expect(client.connectors.map((x) => x.name)).toMatchInlineSnapshot(`
          [
            "Petra",
          ]
        `)
      })

      it('custom', () => {
        const client = createClient({
          connectors: [
            new MockConnector({
              options: {
                account: getAptosAccounts()[0],
              },
            }),
          ],
          provider,
        })
        expect(client.connectors.map((x) => x.name)).toMatchInlineSnapshot(`
          [
            "Mock",
          ]
        `)
      })
    })

    describe('provider', () => {
      it('default', () => {
        const client = createClient({
          provider,
        })
        expect(client.provider).toBeDefined()
      })

      it('custom', () => {
        const client = createClient({
          provider,
        })
        expect(client.provider).toMatchInlineSnapshot(
          '"<AptosProvider url={https://fullnode.devnet.aptoslabs.com/v1} />"',
        )
      })
    })

    describe('storage', () => {
      it('default', () => {
        const client = createClient({
          provider,
        })
        expect(client.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `)
      })

      it('custom', () => {
        const client = createClient({
          provider,
          storage: createStorage({
            storage: window.localStorage,
          }),
        })
        expect(client.storage).toMatchInlineSnapshot(`
          {
            "getItem": [Function],
            "removeItem": [Function],
            "setItem": [Function],
          }
        `)
      })
    })
  })
})

describe('getClient', () => {
  it('returns default client', () => {
    expect(getClient()).toBeDefined()
  })

  it('returns created client', () => {
    const client = createClient({
      provider,
    })
    expect(getClient()).toEqual(client)
  })
})
