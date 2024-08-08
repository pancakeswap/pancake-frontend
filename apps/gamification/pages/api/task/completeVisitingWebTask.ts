import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { TaskType } from 'views/DashboardQuestEdit/type'
import { withSiweAuth } from 'middlewares/withSiwe'

const handler = withSiweAuth(async (req, res) => {
  if (!GAMIFICATION_PUBLIC_API || !req.query || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const { account, questId, taskName, taskId } = req.query
  if (account !== req.siwe.address) {
    return res.status(400).json({ message: 'Invalid wallet address' })
  }
  if (taskName !== TaskType.VISIT_BLOG_POST) {
    return res.status(400).json({ message: 'Invalid task' })
  }

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
})

export default handler
