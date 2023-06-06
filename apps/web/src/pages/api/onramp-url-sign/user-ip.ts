import { ZodError, object, string } from 'zod'
import { NextApiRequest, NextApiResponse } from 'next'
import geoip from 'geoip-lite'

const IpRequestSchema = object({
  headers: object({
    'x-forwarded-for': string().optional(),
  }),
  socket: object({
    remoteAddress: string().optional(),
  }),
})

const IpResponseSchema = object({
  country: string(),
  countryCode: string(),
})

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const validatedReq = IpRequestSchema.parse(req)

    const ipAddress = validatedReq.headers['x-forwarded-for'] || validatedReq.socket.remoteAddress
    const geo = geoip.lookup(ipAddress)

    if (!geo) {
      throw new Error('Failed to retrieve geolocation information')
    }

    const validatedRes = IpResponseSchema.parse({
      country: geo.country || 'Unknown',
      countryCode: geo.countryCode || 'Unknown',
    })

    res.status(200).json(validatedRes)
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: error.message })
    } else {
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
