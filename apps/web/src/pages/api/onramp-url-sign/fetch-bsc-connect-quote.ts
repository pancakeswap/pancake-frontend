import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { z } from 'zod'
import axios from 'axios'

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
  fiatCurrency: z.string(),
  cryptoCurrency: z.string(),
  fiatAmount: z.string(),
  cryptoNetwork: z.string(),
  paymentMethod: z.string(),
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

    console.log(payload)

    if (!payload) {
      throw new Error('Payload is required.')
    }

    // const validPayload = payloadSchema.parse(payload);

    const merchantCode = 'pancake_swap_test'
    const timestamp = Date.now().toString()

    const payloadString = JSON.stringify(payload)
    const contentToSign = `${payloadString}&merchantCode=${merchantCode}&timestamp=${timestamp}`
    const signature = sign(contentToSign, PRIVATE_KEY)
    const endpoint = 'https://sandbox.bifinitypay.com/bapi/fiat/v1/public/open-api/connect/get-quote'

    axios
      .post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          merchantCode: merchantCode,
          timestamp: timestamp,
          'x-api-signature': signature,
        },
      })
      .then((response) => {
        res.status(response.status).json(response.data)
      })
      .catch((error) => {
        if (error.response) {
          res.status(error.response.status).json(error.response.data)
        } else {
          res.status(500).json({ error: 'Internal Server Error' })
        }
      })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Bad Request' })
  }
}
