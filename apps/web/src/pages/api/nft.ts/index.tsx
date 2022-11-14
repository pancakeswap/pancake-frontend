import { NextApiResponse, NextApiRequest } from 'next'

export default function handler(
    _req: NextApiRequest,
    res: NextApiResponse
  ) {
    return res.status(200).json({ name: 'John Doe' })
  }