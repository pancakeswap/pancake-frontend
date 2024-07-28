/* eslint-disable @typescript-eslint/no-shadow */
import { Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MockConnector } from './connector'

// default generated account for testing
const accounts = [
  {
    privateKey: new Ed25519PrivateKey('0xd7238892323a3440282657b1ebe046c16357521333003783596da9c2cb26a485'),
    address: '0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493',
  },
]

describe('MockConnector', () => {
  let connector: MockConnector
  let account: Account
  beforeEach(() => {
    account = Account.fromPrivateKeyAndAddress(accounts[0])

    connector = new MockConnector({
      options: { account },
    })
  })

  it('constructor', () => {
    expect(connector.name).toEqual('Mock')
    expect(connector.ready).toEqual(true)
  })

  describe('connect', () => {
    it('succeeds', async () => {
      const onChange = vi.fn()
      connector.on('change', onChange)

      expect(await connector.connect()).toMatchInlineSnapshot(`
        {
          "account": {
            "address": "0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493",
            "publicKey": "0x008ecf7d835b65f8a7252ec49563b84b37f37c76077962ccfef752fd0b8bb960",
          },
          "network": "devnet",
          "provider": "<MockProvider>",
        }
      `)
      expect(onChange).toBeCalledTimes(1)
      expect(await connector.isConnected()).toEqual(true)
    })

    it('fails', async () => {
      const connector = new MockConnector({
        options: {
          flags: { failConnect: true },
          account,
        },
      })
      await expect(connector.connect()).rejects.toThrowErrorMatchingInlineSnapshot(
        `[UserRejectedRequestError: User rejected request]`,
      )
    })
  })

  it('disconnect', async () => {
    const onDisconnect = vi.fn()
    connector.on('disconnect', onDisconnect)

    await connector.connect()
    await connector.disconnect()
    expect(onDisconnect).toBeCalledTimes(1)
  })

  describe('account', () => {
    it('succeeds', async () => {
      await connector.connect()
      expect(await connector.account()).toMatchInlineSnapshot(`
        {
          "address": "0x2cf744dc90acb87c3bbf5f034b37c3718ac10a56e5181c1b43923e5c3623b493",
          "publicKey": "0x008ecf7d835b65f8a7252ec49563b84b37f37c76077962ccfef752fd0b8bb960",
        }
      `)
    })

    it('fails', async () => {
      await expect(connector.account()).rejects.toThrowErrorMatchingInlineSnapshot(
        `[UserRejectedRequestError: User rejected request]`,
      )
    })
  })

  it('getProvider', async () => {
    expect(await connector.getProvider()).toMatchInlineSnapshot(`"<MockProvider>"`)
  })

  describe('isConnected', () => {
    it('true', async () => {
      await connector.connect()
      expect(await connector.isConnected()).toMatchInlineSnapshot(`true`)
    })

    it('false', async () => {
      expect(await connector.isConnected()).toMatchInlineSnapshot(`false`)
    })
  })
})
