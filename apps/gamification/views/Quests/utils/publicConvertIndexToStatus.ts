import { CompletionStatus, CompletionStatusIndex } from 'views/DashboardQuestEdit/type'

export const publicConvertIndexToStatus = (state: CompletionStatusIndex): CompletionStatus => {
  switch (state) {
    case 0:
      return CompletionStatus.ONGOING
    case 1:
      return CompletionStatus.FINISHED
    default:
      throw new Error('Invalid StateType')
  }
}
