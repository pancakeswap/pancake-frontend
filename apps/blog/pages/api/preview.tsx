import qs from 'qs'
import { NextApiRequest, NextApiResponse } from 'next'

import { z } from 'zod'

const zQuery = z.object({
  slug: z.string(),
})

const preview = (req: NextApiRequest, res: NextApiResponse) => {
  if (!req.query) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)

  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const { slug } = parsed.data
  res.setPreviewData({ slug })
  return res.redirect(`/articles/${slug}`)
}

export default preview
