import { useContext } from 'react'
import { QuestEditContext } from './index'

export const useQuestEdit = () => {
  const context = useContext(QuestEditContext)
  if (!context) {
    throw new Error('Quest Edit context undefined')
  }
  return context
}
