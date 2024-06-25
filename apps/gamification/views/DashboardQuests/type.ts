import { SingleQuestData } from 'views/DashboardQuestEdit/hooks/useGetSingleQuestData'

export interface Pagination {
  page: number
  pageSize: number
  total: number
  dataInPage: number
}

export interface AllDashboardQuestsType {
  quests: SingleQuestData[]
  pagination: Pagination
}
