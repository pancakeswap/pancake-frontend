import { ONRAMP_API_BASE_URL } from 'config/constants/endpoints'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const xForwardedFor = req.headers['x-forwarded-for']
    const userIp = xForwardedFor ? (xForwardedFor as string).split(',')[0].trim() : null

    const response = await fetch(`${ONRAMP_API_BASE_URL}/fetch-provider-availability-get?userIp=${userIp}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()
    res.status(200).json({ result: data.result, userIp })
  } catch (error) {
    console.error('Error in Provider availability API handler:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
