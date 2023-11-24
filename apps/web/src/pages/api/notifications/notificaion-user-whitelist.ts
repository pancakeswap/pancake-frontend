import { NextApiRequest, NextApiResponse } from 'next'
import requestIp from 'request-ip'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use the requestIp.mw middleware to add the client's IP address to req.clientIp
  requestIp.mw()(req)

  // @ts-ignore
  const clientIp = req.clientIp || null

  if (clientIp) {
    console.log(`Client IP: ${clientIp}`)
  } else {
    console.warn('Unable to determine client IP')
  }

  // Rest of your API route logic
  res.status(200).json({ clientIp })
}
