import type { NextApiRequest, NextApiResponse } from 'next'

const userClaimFee = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.AFFILIATE_PROGRAM_API_URL && req.method === 'POST') {
    return res.status(400).json({ message: 'API URL Empty' })
  }

  const requestUrl = `${process.env.AFFILIATE_PROGRAM_API_URL}/user/fee/claim/request`
  const response = await fetch(requestUrl, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: req.body,
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const result = await response.json()

  return res.status(200).json(result)
}

export default userClaimFee
