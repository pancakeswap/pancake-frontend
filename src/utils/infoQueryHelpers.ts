import { getUnixTime, subDays, subWeeks, startOfMinute } from 'date-fns'
import { request } from 'graphql-request'

export const multiQuery = async (queryConstructor, subqueries, endpoint, skipCount = 1000) => {
  let fetchedData = {}
  let allFound = false
  let skip = 0
  try {
    while (!allFound) {
      let end = subqueries.length
      if (skip + skipCount < subqueries.length) {
        end = skip + skipCount
      }
      const subqueriesSlice = subqueries.slice(skip, end)
      // eslint-disable-next-line no-await-in-loop
      const result = await request(endpoint, queryConstructor(subqueriesSlice))
      fetchedData = {
        ...fetchedData,
        ...result,
      }
      allFound = Object.keys(result).length < skipCount || skip + skipCount > subqueries.length
      skip += skipCount
    }
    return fetchedData
  } catch (error) {
    console.error('Failed to fetch info data', error)
    return null
  }
}

/**
 * Used to get large amounts of data when
 * @param query - gql`` query string
 * @param localClient
 * @param vars - any variables that are passed in every query
 * @param values - the keys that are used as the values to map over if
 * @param skipCount - amount of entities to skip per query
 */
// export const splitQuery = async (query: string, client: any, vars: any[], values: any[], skipCount = 1000) => {
//   let fetchedData = {}
//   let allFound = false
//   let skip = 0
//   try {
//     while (!allFound) {
//       let end = values.length
//       if (skip + skipCount < values.length) {
//         end = skip + skipCount
//       }
//       const sliced = values.slice(skip, end)
//       // eslint-disable-next-line no-await-in-loop
//       const result = await request(INFO_CLIENT, query(...vars, sliced))
//       fetchedData = {
//         ...fetchedData,
//         ...result.data,
//       }
//       if (Object.keys(result.data).length < skipCount || skip + skipCount > values.length) {
//         allFound = true
//       } else {
//         skip += skipCount
//       }
//     }
//     return fetchedData
//   } catch (e) {
//     console.error(e)
//     return undefined
//   }
// }

/**
 * Returns UTC timestamps for 24h ago, 48h ago and 7d ago relative to current date and time
 */
export const useDeltaTimestamps = (): [number, number, number, number] => {
  const utcCurrentTime = getUnixTime(new Date()) * 1000
  const t24h = getUnixTime(startOfMinute(subDays(utcCurrentTime, 1)))
  const t48h = getUnixTime(startOfMinute(subDays(utcCurrentTime, 2)))
  const t7d = getUnixTime(startOfMinute(subWeeks(utcCurrentTime, 1)))
  const t14d = getUnixTime(startOfMinute(subWeeks(utcCurrentTime, 2)))
  return [t24h, t48h, t7d, t14d]
}
