import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { object as zObject, string as zString } from 'zod'

const zQuery = zObject({
  id: zString(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || !req.query || req.method !== 'DELETE') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const response = await fetch(`${process.env.GAMIFICATION_DASHBOARD_API}/quests/${queryParsed.id}/delete`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-secure-token': process.env.DASHBOARD_TOKEN as string,
    },
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const data = await response.json()

  return res.status(200).json(data)
}
