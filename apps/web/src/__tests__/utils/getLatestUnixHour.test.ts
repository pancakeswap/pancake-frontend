import getLatestUnixHour from 'utils/getLatestUnixHour'
import dayjs from 'dayjs'

describe('getLatestUnixHour', () => {
  it('returns correct starting hour', () => {
    const sampleDate = dayjs.unix(1636390053) // 2021-11-8 04:47:33 PM GMT
    const expected = 1636387200 // 2021-11-8 04:00:00 PM GMT
    expect(getLatestUnixHour(sampleDate.toDate())).toBe(expected)
  })
})
