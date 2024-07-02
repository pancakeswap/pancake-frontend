import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { TaskType } from 'views/DashboardQuestEdit/type'

export const fetchBlogMarkTaskStatus = async (account: string, questId: string) => {
  const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/markTaskStatus/${account}/${questId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      taskName: TaskType.VISIT_BLOG_POST,
      isCompleted: true,
    }),
  })

  return response
}
