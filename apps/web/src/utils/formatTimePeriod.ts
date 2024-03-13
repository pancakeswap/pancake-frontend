import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

/**
 * @param {Object} periods Return value from getTimePeriods
 * @param excludePeriods Key list for the object values of that exclude the periods
 * @return {string} '14h 3m 4s'
 */
const formatTimePeriod = (periods: ReturnType<typeof getTimePeriods>, excludePeriods?: string[]) => {
  const textArr: string[] = []

  Object.keys(periods).forEach((period: string) => {
    if (periods[period] > 0 && !excludePeriods?.includes(period)) {
      textArr.push(`${periods[period]}${period.substring(0, 1)}`)
    }
  })

  if (textArr.length === 0) {
    return null
  }

  return textArr.join(' ')
}

export default formatTimePeriod
