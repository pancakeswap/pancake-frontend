import { BuyButtonsEnum } from 'views/PancakeSquad/components/Buttons/types'
import { getBuyButton, getBuyButtonText } from 'views/PancakeSquad/components/Buttons/utils'
import { SaleStatusEnum } from 'views/PancakeSquad/types'

describe('PancakeSquad/buttons/utils/getBuyButtonText', () => {
  it('Should return Max purchased text', () => {
    // Given
    const canBuyTickets = false
    const saleStatus = SaleStatusEnum.Sale
    const numberTicketsOfUser = 3
    const t = (key) => key

    // When
    const result = getBuyButtonText({ canBuyTickets, saleStatus, numberTicketsOfUser, t })

    // Then
    expect(result).toEqual('Max purchased')
  })

  it('Should return Not eligible text', () => {
    // Given
    const canBuyTickets = false
    const saleStatus = SaleStatusEnum.Sale
    const numberTicketsOfUser = 0
    const t = (key) => key

    // When
    const result = getBuyButtonText({ canBuyTickets, saleStatus, numberTicketsOfUser, t })

    // Then
    expect(result).toEqual('Not eligible')
  })

  it('Should return Buy Tickets text', () => {
    // Given
    const canBuyTickets = true
    const saleStatus = SaleStatusEnum.Sale
    const numberTicketsOfUser = 0
    const t = (key) => key

    // When
    const result = getBuyButtonText({ canBuyTickets, saleStatus, numberTicketsOfUser, t })

    // Then
    expect(result).toEqual('Buy Tickets')
  })
})

describe('PancakeSquad/buttons/utils/getBuyButton', () => {
  it('Should return ENABLE button', () => {
    // Given
    const isApproved = false
    const isGen0User = false
    const isUserReady = false
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = 0
    const numberTicketsUsedForGen0 = 0

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.ENABLE)
  })

  it('Should return READY button', () => {
    // Given
    const isApproved = true
    const isGen0User = false
    const isUserReady = true
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = 0
    const numberTicketsUsedForGen0 = 0

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.READY)
  })

  it('Should return READY button for gen0 user', () => {
    // Given
    const isApproved = true
    const isGen0User = true
    const isUserReady = true
    const saleStatus = SaleStatusEnum.Presale
    const startTimestamp = 0
    const numberTicketsUsedForGen0 = 0

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.READY)
  })

  it('Should return BUY button', () => {
    // Given
    const isApproved = true
    const isGen0User = false
    const isUserReady = false
    const saleStatus = SaleStatusEnum.Sale
    const startTimestamp = new Date('06-08-2021').getDate()
    const numberTicketsUsedForGen0 = 0

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.BUY)
  })

  it('Should return BUY button for gen0 in preSale', () => {
    // Given
    const isApproved = true
    const isGen0User = true
    const isUserReady = false
    const saleStatus = SaleStatusEnum.Presale
    const startTimestamp = new Date(Date.now() + 30 * 60 * 1000).getTime()
    const numberTicketsUsedForGen0 = 0

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.BUY)
  })

  it('Should not return BUY button for gen0 in preSale when presale is over', () => {
    // Given
    const isApproved = true
    const isGen0User = true
    const isUserReady = false
    const saleStatus = SaleStatusEnum.Presale
    const startTimestamp = new Date(Date.now() + 10 * 60 * 1000).getTime()
    const numberTicketsUsedForGen0 = 0

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.NONE)
  })

  it('Should return BUY button for gen0 in preSale when all tickets are bought', () => {
    // Given
    const isApproved = true
    const isGen0User = false
    const isUserReady = false
    const saleStatus = SaleStatusEnum.Presale
    const startTimestamp = new Date(Date.now() + 30 * 60 * 1000).getTime()
    const numberTicketsUsedForGen0 = 2

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.BUY)
  })

  it('Should return NONE button afterward', () => {
    // Given
    const isApproved = true
    const isGen0User = false
    const isUserReady = false
    const saleStatus = SaleStatusEnum.Claim
    const startTimestamp = new Date('06-08-2021').getDate()
    const numberTicketsUsedForGen0 = 0

    // When
    const result = getBuyButton({
      isApproved,
      isGen0User,
      saleStatus,
      startTimestamp,
      isUserReady,
      numberTicketsUsedForGen0,
    })

    // Then
    expect(result).toEqual(BuyButtonsEnum.NONE)
  })
})
