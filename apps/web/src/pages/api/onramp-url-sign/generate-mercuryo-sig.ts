import { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { z } from 'zod'

const payloadSchema = z.object({
  walletAddress: z.string(),
})

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

    const { walletAddress } = validPayload.data

    const hash = crypto.createHash('sha512').update(`${walletAddress}${process.env.MERCURYO_SECRET_KEY}`).digest('hex')

    res.json({ urlWithSignature: hash })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Bad Request' })
  }
}
