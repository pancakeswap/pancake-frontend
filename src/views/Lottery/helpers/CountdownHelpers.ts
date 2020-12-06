// @ts-nocheck
import getTimePeriods from 'utils/getTimePeriods'

// lottery draws UTC: 02:00 (10:00 SGT), 08:00 (16:00 SGT), 14:00 (22:00 SGT), 20:00 (04:00 SGT)
const lotteryDrawHoursUtc = [2, 8, 14, 20]

const getClosestLotteryHour = (currentHour) => {
  switch (true) {
    case currentHour < lotteryDrawHoursUtc[0] || currentHour >= lotteryDrawHoursUtc[3]:
      return lotteryDrawHoursUtc[0]
    case currentHour < lotteryDrawHoursUtc[1]:
      return lotteryDrawHoursUtc[1]
    case currentHour < lotteryDrawHoursUtc[2]:
      return lotteryDrawHoursUtc[2]
    case currentHour < lotteryDrawHoursUtc[3]:
      return lotteryDrawHoursUtc[3]
    default:
      return 0
  }
}

const getNextLotteryDrawTime = (currentMillis) => {
  const date = new Date(currentMillis)
  const currentHour = date.getUTCHours()
  const nextLotteryHour = getClosestLotteryHour(currentHour)
  const nextLotteryIsTomorrow = nextLotteryHour === 2 && currentHour <= 23
  let millisTimeOfNextDraw = date.setUTCHours(nextLotteryHour, 0, 0, 0)

  if (nextLotteryIsTomorrow) {
    const tomorrow = new Date(millisTimeOfNextDraw)
    const nextDay = tomorrow.getUTCDate() + 1
    tomorrow.setUTCDate(nextDay)
    millisTimeOfNextDraw = tomorrow.getTime()
  }

  return millisTimeOfNextDraw
}

const getNextTicketSaleTime = (currentMillis) => (parseInt(currentMillis / 3600000) + 1) * 3600000
const hoursAndMinutesString = (hours, minutes) => `${parseInt(hours)}h, ${parseInt(minutes)}m`

export const getTicketSaleTime = (currentMillis): string => {
  const nextTicketSaleTime = getNextTicketSaleTime(currentMillis)
  const msUntilNextTicketSale = nextTicketSaleTime - currentMillis
  const { minutes } = getTimePeriods(msUntilNextTicketSale/1000)
  const { hours } = getTimePeriods(msUntilNextTicketSale/1000)
  return hoursAndMinutesString(hours, minutes)
}

export const getLotteryDrawTime = (currentMillis): string => {
  const nextLotteryDrawTime = getNextLotteryDrawTime(currentMillis)
  const msUntilLotteryDraw = nextLotteryDrawTime - currentMillis
  const { minutes } = getTimePeriods(msUntilLotteryDraw/1000)
  const { hours } = getTimePeriods(msUntilLotteryDraw/1000)
  return hoursAndMinutesString(hours, minutes)
}

export const getTicketSaleStep = () => (1 / 6) * 100

export const getLotteryDrawStep = (currentMillis) => {
  const sBetweenLotteries = 21600000
  const endTime = getNextLotteryDrawTime(currentMillis)
  const sUntilLotteryDraw = endTime - currentMillis
  const percentageRemaining = (sUntilLotteryDraw / sBetweenLotteries) * 100
  return 100 - percentageRemaining
}
