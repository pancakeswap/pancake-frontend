import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { z } from 'zod'

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
    if (!payload) {
      throw new Error('Payload is required.')
    }

    const validPayload = payloadSchema.parse(payload)

    const merchantCode = 'pancake_swap_test'
    const timestamp = Date.now().toString()

    const payloadString = JSON.stringify(validPayload)
    const contentToSign = `${payloadString}&merchantCode=${merchantCode}&timestamp=${timestamp}`
    const signature = sign(contentToSign, process.env.PRIVATE_KEY || '')

    res.status(200).json({ signature, merchantCode, timestamp })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Bad Request' })
  }
}
