import { NextApiRequest, NextApiResponse } from 'next'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.clearPreviewData()
  res.end('Preview Mode End')
}

export default handler
