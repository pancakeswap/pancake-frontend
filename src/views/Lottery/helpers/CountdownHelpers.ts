// @ts-nocheck
import getTimePeriods from 'utils/getTimePeriods'

export const getUtcTimeNow = (date: Date) => {
  const utcTimeStamp = Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
    date.getMilliseconds())
  return utcTimeStamp
} 


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

const getNextLotteryDrawTime = (currentTime) => {
  const date = new Date(currentTime)
  const currentHour = date.getHours()
  const nextLotteryHour = getClosestLotteryHour(currentHour)
  const nextLotteryIsTomorrow = nextLotteryHour === 2 && currentHour <= 23

  let timeOfNextDraw = date.setHours(nextLotteryHour, 0, 0, 0)

  if (nextLotteryIsTomorrow) {
    const tomorrow = new Date(timeOfNextDraw)
    tomorrow.setDate(tomorrow.getDate() + 1)
    timeOfNextDraw = tomorrow.getTime()
  }

  return timeOfNextDraw
}

const getNextTicketSaleTime = (currentTime) => (parseInt(currentTime / 3600000) + 1) * 3600000
const hoursAndMinutesString = (hours, minutes) => `${parseInt(hours)}h, ${parseInt(minutes)}m`

export const getTicketSaleTime = (currentTime): string => {
  const nextTicketSaleTime = getNextTicketSaleTime(currentTime)
  const msUntilNextTicketSale = nextTicketSaleTime - currentTime
  const { minutes } = getTimePeriods(msUntilNextTicketSale/1000)
  const { hours } = getTimePeriods(msUntilNextTicketSale/1000)
  return hoursAndMinutesString(hours, minutes)
}

export const getLotteryDrawTime = (currentTime): string => {
  const nextLotteryDrawTime = getNextLotteryDrawTime(currentTime)
  const msUntilLotteryDraw = nextLotteryDrawTime - currentTime
  const { minutes } = getTimePeriods(msUntilLotteryDraw/1000)
  const { hours } = getTimePeriods(msUntilLotteryDraw/1000)
  return hoursAndMinutesString(hours, minutes)
}

export const getTicketSaleStep = () => (1 / 6) * 100

export const getLotteryDrawStep = (currentTime) => {
  const sBetweenLotteries = 21600000
  const endTime = getNextLotteryDrawTime(currentTime)
  const sUntilLotteryDraw = endTime - currentTime
  const percentageRemaining = (sUntilLotteryDraw / sBetweenLotteries) * 100
  return 100 - percentageRemaining
}
