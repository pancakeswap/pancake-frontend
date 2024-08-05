import { useContext } from 'react'
import { CampaignEditContext } from './index'

export const useCampaignEdit = () => {
  const context = useContext(CampaignEditContext)
  if (!context) {
    throw new Error('Campaign Edit context undefined')
  }
  return context
}
