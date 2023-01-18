import { emojisplosions } from 'emojisplosion'

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

  if (!isDisabled) {
    emojisplosions({
      interval: 10000,
      uniqueness: 1,
      emojiCount: 8,
      emojis: ['🧧'],
    })
  }
}

export default useChineseNewYearEffect
