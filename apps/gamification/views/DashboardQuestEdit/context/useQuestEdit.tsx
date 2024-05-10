import { useContext } from 'react'
import { QuesEditContext } from './index'

export const useQuestEdit = () => {
  const context = useContext(QuesEditContext)
  if (!context) {
    throw new Error('Quest Edit context undefined')
  }
  return context
}
