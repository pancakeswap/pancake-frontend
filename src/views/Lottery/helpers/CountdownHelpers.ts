// @ts-nocheck
const getMinutes = (msTimeValue) => Math.floor((msTimeValue % 3000) / 60)
const getHours = (msTimeValue) => Math.floor((msTimeValue % (3600 * 24)) / 3600)
const getNextTicketSaleTime = (currentTime) => (parseInt(currentTime / 3600) + 1) * 3600
// lottery is every 6 hrs (21600 s)
// lottery draws UTC: 02:00 (10:00 SGT), 08:00 (16:00 SGT), 14:00 (22:00 SGT), 20:00 (04:00 SGT)
// break the current time into chunks of 6hrs (/ 21600), add one more 6hr unit, multiply by 6hrs to get it back to current time, add 2 hrs to get it relative to SGT
const getNextLotteryDrawTime = (currentTime) => {
  return (parseInt(currentTime / 21600) + 1) * 21600 + 7200
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

export const getTicketSaleStep = () => (3600 / 21600) * 100

export const getLotteryDrawStep = (currentTime) => {
  const sBetweenLotteries = 21600
  const endTime = getNextLotteryDrawTime(currentTime)
  const msUntilLotteryDraw = endTime - currentTime
  const percentageRemaining = (msUntilLotteryDraw / sBetweenLotteries) * 100
  return 100 - percentageRemaining
}
