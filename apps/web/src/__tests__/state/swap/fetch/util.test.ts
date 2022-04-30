import { getIdsByTimeWindow, getPairSequentialId, pairHasEnoughLiquidity } from 'state/swap/fetch/utils'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import HOUR_PAIR from './__fixtures__/hour-pair-data.json'
import DAY_PAIR from './__fixtures__/day-pair-data.json'

describe('getPairSequentialId', () => {
  it('should get sequential id', () => {
    // Given
    const id = '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451496'
    const pairId = '0x00000cd505955c2aaefd16fc37a3fed35fd7b343'
    const expctedResult = '451496'

    // When
    const response = getPairSequentialId({ id, pairId })

    // Then
    expect(response).toEqual(expctedResult)
  })

  it('should return same string if id not found', () => {
    // Given
    const id = '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451496'
    const pairId = 'unknownId'
    const expctedResult = id

    // When
    const response = getPairSequentialId({ id, pairId })

    // Then
    expect(response).toEqual(expctedResult)
  })
})

describe('getIdsByTimeWindow', () => {
  it('should return an empty array for day time window', () => {
    // Given
    const pairAddress = '0x00000cd505955c2aaefd16fc37a3fed35fd7b343'
    const pairLastId = '451496'
    const timeWindow = PairDataTimeWindowEnum.DAY
    const idsCount = 24
    const expctedResult = []

    // When
    const response = getIdsByTimeWindow({ idsCount, pairAddress, pairLastId, timeWindow })

    // Then
    expect(response).toEqual(expctedResult)
  })

  it('should return 4 ids for week time window', () => {
    // Given
    const pairAddress = '0x00000cd505955c2aaefd16fc37a3fed35fd7b343'
    const pairLastId = '451496'
    const timeWindow = PairDataTimeWindowEnum.WEEK
    const idsCount = 4
    const expctedResult = [
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451496',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451490',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451484',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451478',
    ]

    // When
    const response = getIdsByTimeWindow({ idsCount, pairAddress, pairLastId, timeWindow })

    // Then
    expect(response).toEqual(expctedResult)
  })

  it('should return 4 ids for month time window', () => {
    // Given
    const pairAddress = '0x00000cd505955c2aaefd16fc37a3fed35fd7b343'
    const pairLastId = '451496'
    const timeWindow = PairDataTimeWindowEnum.MONTH
    const idsCount = 4
    const expctedResult = [
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451496',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451495',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451494',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451493',
    ]

    // When
    const response = getIdsByTimeWindow({ idsCount, pairAddress, pairLastId, timeWindow })

    // Then
    expect(response).toEqual(expctedResult)
  })

  it('should return 4 ids for year time window', () => {
    // Given
    const pairAddress = '0x00000cd505955c2aaefd16fc37a3fed35fd7b343'
    const pairLastId = '451495'
    const timeWindow = PairDataTimeWindowEnum.YEAR
    const idsCount = 4
    const expctedResult = [
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451495',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451480',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451465',
      '0x00000cd505955c2aaefd16fc37a3fed35fd7b343-451450',
    ]

    // When
    const response = getIdsByTimeWindow({ idsCount, pairAddress, pairLastId, timeWindow })

    // Then
    expect(response).toEqual(expctedResult)
  })
})

// only happy path
describe('pairHasEnoughLiquidity', () => {
  it('should return true if has enough liquidity', () => {
    expect(pairHasEnoughLiquidity(HOUR_PAIR.data, PairDataTimeWindowEnum.DAY)).toBeTruthy()
  })
  it('should return true if has enough liquidity', () => {
    expect(pairHasEnoughLiquidity(DAY_PAIR.data, PairDataTimeWindowEnum.YEAR)).toBeTruthy()
  })
})
