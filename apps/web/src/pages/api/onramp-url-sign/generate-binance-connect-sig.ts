import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { z } from 'zod'

const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAMfRrRXD0Jw4+5sO
nrwdyUPirVRSw6L15ZNIMCuRA+XNo2+fUVCsbamdJhyn37uNaUswsba99oOzNztO
pKcMnu/YnGMowdci5IIp8luPJjdQSTgy1WlHTCCuIenddNUQ9X3RNNlwTxxUYMnz
IJe27LQUw92zjaCd0GNVsFxiGLixAgMBAAECgYEAimannSipCFvLogWJWsDC09tg
tMQyr1/kKJRakQJ7kaNSbZELEHat6kpnyHdaVxzGbocGwI1o/qWWPuTk1LPALSTh
2VS5ePLRxRfXXYgfEcTeJ3/50INlq+A9pRRG1dFQLfxlv5jbu8nWCSIaQCpX6QhU
MzduJIrwFl9mlzWcvbUCQQDsAtX+RH/NcT2aYMz9I5fQnZbfxrwoD6k3ipQunjPk
qQ63s+e9p+br0mKpDlnCuhIqKE3MVQwp99d28XPdXDKjAkEA2L4hAAqK5TTH+N/6
xnpgLV8ksvOxh/DNwu6VbZ9DxjFmyggMGtf0OOhwwHqYqJBvNvpyJ/1+WyEjVL/r
gxKwmwJAeMtuyYg3vWfTNtuKr5lzD3RJD1nBXeO+IU5NT5rrRoJ8pOtwlfKEz3hL
xOkyaecgevFL+GQjKKvQXPFx8v9IbwJAGzs4FjM85DNPdJtffJRfhRPRHpKzmWrN
z1H+gDlkYIBQc82zB6ReUNATant8tqD++B9bPF8DAxwUvk8mnd85RQJAViywe5re
NeMQGmKxmovZYfzo6oVveJrTSMG4srQBpw5EmpVS3kdqbS2HhhcAtrY7Aikpj4EG
/mQfNAwqvKi8wQ==
-----END PRIVATE KEY-----`

const payloadSchema = z.object({
  walletAddress: z.string(),
  cryptoCurrency: z.string(),
  fiatCurrency: z.string(),
  amount: z.string(),
})

function sign(srcData: string, privateKey: string): string {
  const key = crypto.createPrivateKey(privateKey)
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(srcData)
  const signature = signer.sign(key)
  return signature.toString('base64')
}

export default function handler(req: NextApiRequest, res: NextApiResponse): void {
  try {
    const payload = req.body
    if (!payload) {
      throw new Error('Payload is required.')
    }
    const validPayload = payloadSchema.safeParse(payload)
    if (!validPayload.success) {
      throw new Error('payload has the incorrect shape. please check you types')
    }
    const { walletAddress, cryptoCurrency, fiatCurrency, amount } = validPayload.data

    const merchantCode = 'pancake_swap_test'
    const timestamp = Date.now().toString()

    const contentToSign = `cryptoAddress=${walletAddress}&cryptoNetwork=ERC20&merchantCode=${merchantCode}&timestamp=${timestamp}`
    const signature = sign(contentToSign, PRIVATE_KEY || '')
    const returnData = `https://sandbox.bifinity.org/en/pre-connect?cryptoCurrency=${cryptoCurrency}&fiatCurrency=${fiatCurrency}&orderAmount=${amount}&cryptoAddress=${walletAddress}&cryptoNetwork=BNB&merchantCode=pancake_swap_test&timestamp=${timestamp}&signature=${signature}`

    res.json({ urlWithSignature: returnData })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Bad Request' })
  }
}
