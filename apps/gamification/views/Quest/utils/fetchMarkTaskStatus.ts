import { TaskType } from 'views/DashboardQuestEdit/type'

export const fetchMarkTaskStatus = async (account: string, questId: string, taskName: TaskType, taskId: string) => {
  const queryString = new URLSearchParams({
    account,
    questId,
    taskId,
    taskName,
  }).toString()

  const response = await fetch(`/api/userInfo/markTaskStatus?${queryString}`, {
    method: 'POST',
  })

  return response
}
