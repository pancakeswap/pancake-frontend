import { recoverTypedDataAddress, zeroAddress } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { describe, expect, it } from 'vitest'
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
    const order = new ExclusiveDutchOrder(orderInfo, 97)
    const encoded = order.encode()
    const parsed = ExclusiveDutchOrder.parse(encoded, 97)
    expect(parsed.info).toEqual(orderInfo)
  })

  it('valid signature over info', async () => {
    const order = new ExclusiveDutchOrder(getOrderInfo({}), 97)

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
    const order = new ExclusiveDutchOrder(
      getOrderInfo({
        deadline: 100n,
        decayStartTime: 100n,
        decayEndTime: 100n,
      }),
      97,
    )

    expect(order.hash()).toMatchInlineSnapshot(`"0x7cef8eb26ac11e086c2784eb12d93cb9a4a68b3f04ce56b0858ff59829a13f0a"`)
  })

  it('decay', () => {
    const now = BigInt(Math.floor(new Date().getTime() / 1000) + 500)
    const order = new ExclusiveDutchOrder(getOrderInfo({}), 97)

    const decayInput = order.decayInput(now)
    const decayOutputs = order.decayOutputs(now)

    expect(decayInput).toEqual({
      ...order.info.input,
      currentAmount: 1000000n,
    })
    expect(decayOutputs).toEqual([
      {
        ...order.info.outputs[0],
        currentAmount: 950000000000000000n,
      },
    ])
  })
})
