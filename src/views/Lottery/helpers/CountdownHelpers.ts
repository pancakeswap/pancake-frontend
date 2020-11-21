// @ts-nocheck
const getMinutes = (msTimeValue) => Math.floor((msTimeValue % 3600000) / 60000)
const getHours = (msTimeValue) => Math.floor((msTimeValue % (3600000 * 24)) / 3600000)
const hoursAndMinutesString = (hours, minutes) => `${parseInt(hours)}h, ${parseInt(minutes)}m`
const getNextTicketSaleTime = (currentTime) => (parseInt(currentTime / 3600000) + 1) * 3600000
const getNextLotteryDrawTime = (currentTime) => (parseInt(currentTime / 21600000) + 1) * 21600000

export const getTicketSaleTime = (currentTime): string => {
  const nextTicketSaleTime = getNextTicketSaleTime(currentTime)
  const timeUntilNextTicketSale = nextTicketSaleTime - currentTime
  const minutes = getMinutes(timeUntilNextTicketSale)
  const hours = getHours(timeUntilNextTicketSale)
  return hoursAndMinutesString(hours, minutes)
}

export const getLotteryDrawTime = (currentTime): string => {
  // lottery is every 6 hrs (21600000 ms)
  // so they are at 00:00, 06:00, 12:00, 18:00
  // break the current time into chunks of 6hrs (/ 21600000), add one more 6hr unit, multiply by 6hrs to get it back to current timex
  const nextLotteryDrawTime = getNextLotteryDrawTime(currentTime)
  const timeUntilLotteryDraw = nextLotteryDrawTime - currentTime
  const minutes = getMinutes(timeUntilLotteryDraw)
  const hours = getHours(timeUntilLotteryDraw)
  return hoursAndMinutesString(hours, minutes)
}

export const getTicketSaleStep = () => {
  const msBetweenLotteries = 21600000
}

export const getLotteryDrawStep = (currentTime) => {
  const msBetweenLotteries = 21600000
  const endTime = currentTime / 21600 + 1 * 21600 + 7200
  const msUntilLotteryDraw = (endTime - currentTime) * 1000
  return (msUntilLotteryDraw / msBetweenLotteries) * 100
}
