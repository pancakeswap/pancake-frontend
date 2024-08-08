import { ChainId } from '@pancakeswap/chains'
import { QuestRewardType } from 'views/DashboardQuestEdit/context/types'
import { CompletionStatus } from 'views/DashboardQuestEdit/type'

export interface CampaignRewardType extends QuestRewardType {}

export interface CampaignStateType {
  chainId: ChainId
  completionStatus: CompletionStatus.DRAFTED
  title: string
  description: string
  startDate: null | Date
  startTime: null | Date
  endDate: null | Date
  endTime: null | Date
  pickedQuests: Array<string>
  thumbnail: {
    id: string
    url: string
  }
  reward: undefined | CampaignRewardType
}
