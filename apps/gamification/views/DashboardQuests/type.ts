import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'

interface Pagination {
  page: number
  pageSize: number
  total: number
}

export interface AllSingleQuestData extends SingleQuestData {
  numberOfParticipants: number
}

export interface AllDashboardQuestsType {
  quests: AllSingleQuestData[]
  pagination: Pagination
}
