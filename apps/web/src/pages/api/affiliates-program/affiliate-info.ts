import type { NextApiRequest, NextApiResponse } from 'next'

const affiliateInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!process.env.AFFILIATE_PROGRAM_API_URL || !req.query) {
    return res.status(400).json({ message: 'API URL Empty' })
  }

  const requestUrl = `${process.env.AFFILIATE_PROGRAM_API_URL}/affiliate`
  const response = await fetch(requestUrl)

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const result = await response.json()
  return res.status(200).json(result)
}

export default affiliateInfo
