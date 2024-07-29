import { TaskType } from 'views/DashboardQuestEdit/type'

export const completeVisitingWebTask = async (account: string, questId: string, taskId: string) => {
  const queryString = new URLSearchParams({
    account,
    questId,
    taskId,
    taskName: TaskType.VISIT_BLOG_POST,
  }).toString()

  const response = await fetch(`/api/task/completeVisitingWebTask?${queryString}`, {
    method: 'POST',
  })

  return response
}
