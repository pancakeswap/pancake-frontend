import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { TaskType } from 'views/DashboardQuestEdit/type'

export const fetchMarkTaskStatus = async (account: string, questId: string, taskName: TaskType) => {
  const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/markTaskStatus/${account}/${questId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      taskName,
      isCompleted: true,
    }),
  })

  return response
}
