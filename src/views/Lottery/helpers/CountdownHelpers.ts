// @ts-nocheck
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

const getMinutes = (msTimeValue) => Math.floor((msTimeValue / (1000 * 60)) % 60)
const getHours = (msTimeValue) => Math.floor((msTimeValue / (1000 * 60 * 60)) % 24)
const hoursAndMinutesString = (hours, minutes) => `${parseInt(hours)}h, ${parseInt(minutes)}m`

export const getTicketSaleTime = (currentTime): string => {
  const nextTicketSaleTime = getNextTicketSaleTime(currentTime)
  const timeUntilNextTicketSale = nextTicketSaleTime - currentTime
  const minutes = getMinutes(timeUntilNextTicketSale)
  const hours = getHours(timeUntilNextTicketSale)
  return hoursAndMinutesString(hours, minutes)
}

export const getLotteryDrawTime = (currentTime): string => {
  const nextLotteryDrawTime = getNextLotteryDrawTime(currentTime)
  const timeUntilLotteryDraw = nextLotteryDrawTime - currentTime
  const minutes = getMinutes(timeUntilLotteryDraw)
  const hours = getHours(timeUntilLotteryDraw)
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
