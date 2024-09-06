import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { zAddress, zQuestId } from 'config/validations'
import qs from 'qs'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { object as zObject, string as zString } from 'zod'

const zQuery = zObject({
  account: zAddress,
  questId: zQuestId,
  taskId: zQuestId,
  taskName: zString(),
})

const handler = async (req, res) => {
  if (!GAMIFICATION_PUBLIC_API || !req.query || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  if (!req?.headers?.authorization) {
    return res.status(400).json({ message: 'Header Authorization Empty' })
  }

  const { account, questId, taskName, taskId } = req.query
  if (taskName !== TaskType.VISIT_BLOG_POST) {
    return res.status(400).json({ message: 'Invalid task' })
  }

  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const response = await fetch(
    `${GAMIFICATION_PUBLIC_API}/userInfo/v1/user/${account}/quest/${questId}/mark-task-status`,
    {
      method: 'POST',
      headers: {
        Authorization: req?.headers?.authorization as string,
        'x-secure-token': process.env.TASK_STATUS_TOKEN as string,
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

export default handler
