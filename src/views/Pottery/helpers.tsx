export const remainTimeToNextFriday = (): number => {
  // Get current date and time
  const today = new Date()

  // Get number of days to Friday
  const dayNum = today.getDay()
  const daysToFri = 5 - (dayNum < 5 ? dayNum : dayNum - 7)

  // Get milliseconds to noon friday
  const fridayNoon = new Date(+today)
  fridayNoon.setDate(fridayNoon.getDate() + daysToFri)
  fridayNoon.setUTCHours(12, 0, 0, 0)

  // Round up ms remaining
  const secondsRemaining = Math.ceil((fridayNoon.getTime() - today.getTime()) / 1000)
  return secondsRemaining
}
