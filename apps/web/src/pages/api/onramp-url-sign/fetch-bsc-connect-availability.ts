import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { z } from 'zod'
import axios from 'axios'

const payloadSchema = z.object({
  clientUserIp: z.string(),
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

    const merchantCode = 'pancake_swap_test'
    const timestamp = Date.now().toString()

    const payloadString = JSON.stringify(validPayload.data)
    const contentToSign = `${payloadString}&merchantCode=${merchantCode}&timestamp=${timestamp}`
    const signature = sign(contentToSign, process.env.PRIVATE_KEY || '')
    const endpoint = 'https://sandbox.bifinitypay.com/bapi/fiat/v1/public/open-api/connect/check-ip-address'

    axios
      .post(endpoint, payload, {
        headers: {
          'Content-Type': 'application/json',
          merchantCode,
          timestamp,
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
