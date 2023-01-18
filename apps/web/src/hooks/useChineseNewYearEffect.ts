import { emojisplosions } from 'emojisplosion'
import { useEffect } from 'react'

const disableWhenNotCNY = () => {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  if (month === 1 && day > 15) {
    return false
  }

  return true
}

const useChineseNewYearEffect = () => {
  const isDisabled = disableWhenNotCNY && disableWhenNotCNY()

  useEffect(() => {
    const { cancel } = emojisplosions({
      interval() {
        if (isDisabled) {
          return 0
        }
        return 3000
      },
      uniqueness: 1,
      emojiCount: 8,
      emojis: ['🧧'],
    })

    return () => cancel()
  })
}

export default useChineseNewYearEffect
