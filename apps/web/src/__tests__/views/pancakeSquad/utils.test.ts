import { SaleStatusEnum } from 'views/PancakeSquad/types'
import { getAltText, getEventStepStatus, getEventText } from 'views/PancakeSquad/utils'

const HOUR_IN_MS = 3600 * 1000

describe('PancakeSquad/utils/getEventStepStatus', () => {
  it('Should return past status', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Claim
    const startTimestamp = undefined

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('past')
  })

  it('Should return live status with a startTimestamp', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = new Date('06-08-2021').getDate()

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('live')
  })

  it('Should return live status with no startTimestamp', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = undefined

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('live')
  })

  it('Should return upcoming status', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Pending
    const startTimestamp = undefined

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('upcoming')
  })
})

describe('PancakeSquad/utils/getEventText', () => {
  it('Should return past status', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Claim
    const startTimestamp = undefined

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('past')
  })

  it('Should return live status with a startTimestamp', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = new Date('06-08-2021').getDate()

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('live')
  })

  it('Should return live status with no startTimestamp', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = undefined

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('live')
  })

  it('Should return upcoming status', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Pending
    const startTimestamp = undefined

    // When
    const result = getEventStepStatus({ eventStatus, saleStatus, startTimestamp })

    // Then
    expect(result).toEqual('upcoming')
  })
})

describe('PancakeSquad/utils/getEventText', () => {
  it('Should return DrawingRandomness live text', () => {
    // Given
    const eventStatus = [SaleStatusEnum.DrawingRandomness]
    const saleStatus = SaleStatusEnum.DrawingRandomness
    const startTimestamp = undefined
    const t = (key) => key

    // When
    const result = getEventText({ eventStatus, saleStatus, startTimestamp, t })

    // Then
    expect(result).toEqual('Public Sale: Sold Out!')
  })

  it('Should return live text', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = undefined
    const t = (key) => key

    // When
    const result = getEventText({ eventStatus, saleStatus, startTimestamp, t })

    // Then
    expect(result).toEqual('Public Sale: Now Live')
  })

  it('Should return upcoming text', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Pending
    const startTimestamp = undefined
    const t = (key) => key

    // When
    const result = getEventText({ eventStatus, saleStatus, startTimestamp, t })

    // Then
    expect(result).toEqual('Public Sale: ')
  })

  it('Should return past text', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Claim
    const startTimestamp = undefined
    const t = (key) => key

    // When
    const result = getEventText({ eventStatus, saleStatus, startTimestamp, t })

    // Then
    expect(result).toEqual('Public Sale')
  })
})

describe('PancakeSquad/utils/getAltText', () => {
  it('Should return upcoming claim phase text', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Claim]
    const saleStatus = SaleStatusEnum.DrawingRandomness
    const startTimestamp = undefined
    const t = (key) => key

    // When
    const result = getAltText({ eventStatus, saleStatus, startTimestamp, t })

    // Then
    expect(result).toEqual('Starting Soon')
  })

  it('Should return upcoming sale phase text', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Presale
    const startTimestamp = Date.now() + HOUR_IN_MS + HOUR_IN_MS / 2
    const t = (key) => key

    // When
    const result = getAltText({ eventStatus, saleStatus, startTimestamp, t })

    // Then
    expect(result).toContain('1h')
  })

  it('Should return undefined for past event', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Claim
    const startTimestamp = undefined
    const t = (key) => key

    // When
    const result = getAltText({ eventStatus, saleStatus, startTimestamp, t })

    // Then
    expect(result).toBeUndefined()
  })
})
