const formatLotteryDate = (lotteryDate: string) => {
  if (!lotteryDate) {
    return {}
  }

  const date = new Date(lotteryDate)

  const dateString = date.toDateString()
  const hours = date.getUTCHours()
  const monthAndDay = dateString.split(' ').splice(1, 2).join(' ')

  return { hours, monthAndDay }
}

export default formatLotteryDate
