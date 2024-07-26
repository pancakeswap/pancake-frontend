import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!GAMIFICATION_PUBLIC_API || !req.query || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const { account, questId, taskName, taskId } = req.query

  const response = await fetch(
    `${GAMIFICATION_PUBLIC_API}/userInfo/v1/user/${account}/quest/${questId}/mark-task-status`,
    {
      method: 'POST',
      headers: {
        Authorization: process.env.TASK_STATUS_TOKEN as string,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        taskName,
        taskId,
        isCompleted: true,
      }),
    },
  )

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  return res.status(200).json(response)
}
