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
  const isDisabled = disableWhenNotCNY()

  useEffect(() => {
    const { cancel } = emojisplosions({
      interval: () => (isDisabled ? 0 : 1600),
      uniqueness: 1,
      emojiCount: 10,
      emojis: ['🧧'],
    })

    return () => cancel()
  }, [])
}

export default useChineseNewYearEffect
