import { CompletionStatus, CompletionStatusIndex } from 'views/DashboardQuestEdit/type'

export const convertIndexToStatus = (state: CompletionStatusIndex): CompletionStatus => {
  switch (state) {
    case CompletionStatusIndex.ONGOING:
      return CompletionStatus.ONGOING
    case CompletionStatusIndex.SCHEDULED:
      return CompletionStatus.SCHEDULED
    case CompletionStatusIndex.FINISHED:
      return CompletionStatus.FINISHED
    case CompletionStatusIndex.DRAFTED:
      return CompletionStatus.DRAFTED
    default:
      throw new Error('Invalid StateType')
  }
}
