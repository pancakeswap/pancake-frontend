import { recoverTypedDataAddress, zeroAddress } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it, vi } from 'vitest'
import { ExclusiveDutchOrder, ExclusiveDutchOrderInfo } from './ExclusiveDutchOrder'

describe('ExclusiveDutchOrder', () => {
  const getOrderInfo = (data: Partial<ExclusiveDutchOrderInfo>): ExclusiveDutchOrderInfo => {
    return {
      deadline: BigInt(Math.floor(new Date().getTime() / 1000) + 1000),
      reactor: '0x0000000000000000000000000000000000000000',
      swapper: '0x0000000000000000000000000000000000000000',
      nonce: 10n,
      additionalValidationContract: zeroAddress,
      additionalValidationData: '0x',
      exclusiveFiller: zeroAddress,
      exclusivityOverrideBps: 0n,
      decayStartTime: BigInt(Math.floor(new Date().getTime() / 1000)),
      decayEndTime: BigInt(Math.floor(new Date().getTime() / 1000) + 1000),
      input: {
        token: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        startAmount: 1000000n,
        endAmount: 1000000n,
      },
      outputs: [
        {
          token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          startAmount: 1000000000000000000n,
          endAmount: 900000000000000000n,
          recipient: '0x0000000000000000000000000000000000000000',
        },
      ],
      ...data,
    }
  }

  it('parses a encoded order', () => {
    const orderInfo = getOrderInfo({})
    const order = new ExclusiveDutchOrder(orderInfo, 1)
    const encoded = order.encode()
    const parsed = ExclusiveDutchOrder.parse(encoded, 1)
    expect(parsed.info).toEqual(orderInfo)
  })

  it('valid signature over info', async () => {
    const order = new ExclusiveDutchOrder(getOrderInfo({}), 1)

    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)

    const { domain, types, values, primaryType } = order.permitData()

    const signature = await account.signTypedData({
      domain,
      types,
      message: values,
      primaryType,
    })

    const address = await recoverTypedDataAddress({
      domain,
      types,
      message: values,
      primaryType,
      signature,
    })
    expect(address).toEqual(account.address)
  })

  it('hash', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 6, 9))
    const order = new ExclusiveDutchOrder(getOrderInfo({}), 1)

    expect(order.hash()).toMatchInlineSnapshot(`"0x3a92ee468943d4fee71024a0535a9968ac85eb9068e6a10032856c75388847f8"`)
  })
})
