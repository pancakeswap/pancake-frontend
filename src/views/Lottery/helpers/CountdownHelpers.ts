// @ts-nocheck
const getMinutes = (msTimeValue) => Math.floor((msTimeValue % 3600000) / 60000)
const getHours = (msTimeValue) => Math.floor((msTimeValue % (3600000 * 24)) / 3600000)
const getNextTicketSaleTime = (currentTime) => (parseInt(currentTime / 3600000) + 1) * 3600000
// lottery is every 6 hrs (21600000 ms)
// lottery draws UTC: 02:00 (10:00 SGT), 08:00 (16:00 SGT), 14:00 (22:00 SGT), 20:00 (04:00 SGT)
// break the current time into chunks of 6hrs (/ 21600000), add one more 6hr unit, multiply by 6hrs to get it back to current time, add 2 hrs to get it relative to SGT
const getNextLotteryDrawTime = (currentTime) => {
  return (parseInt(currentTime / 21600000) + 1) * 21600000 + 7200000
}
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

export const getTicketSaleStep = () => (3600000 / 21600000) * 100

export const getLotteryDrawStep = (currentTime) => {
  const msBetweenLotteries = 21600000
  const endTime = getNextLotteryDrawTime(currentTime)
  const msUntilLotteryDraw = endTime - currentTime
  const percentageRemaining = (msUntilLotteryDraw / msBetweenLotteries) * 100
  return 100 - percentageRemaining
}
