import { zQuestId } from 'config/validations'
import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { object as zObject } from 'zod'

const zQuery = zObject({
  id: zQuestId,
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!process.env.GAMIFICATION_DASHBOARD_API || !req.query || req.method !== 'PUT') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  if (!req?.headers?.authorization) {
    return res.status(400).json({ message: 'Header Authorization Empty' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const response = await fetch(`${process.env.GAMIFICATION_DASHBOARD_API}/quests/${queryParsed.id}/update`, {
    method: 'PUT',
    headers: {
      Authorization: req?.headers?.authorization as string,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-secure-token': process.env.DASHBOARD_TOKEN as string,
    },
    body: req.body,
  })

  const data = await response.json()

  if (!response.ok) {
    return res.status(400).json(data)
  }

  return res.status(200).json(data)
}
