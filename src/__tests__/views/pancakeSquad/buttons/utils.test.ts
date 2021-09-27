import getBuyButtonText from 'views/PancakeSquad/components/Buttons/utils'
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
