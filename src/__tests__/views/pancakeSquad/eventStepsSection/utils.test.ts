import { getStepperStatus } from 'views/PancakeSquad/components/EventStepsSection/utils'
import { SaleStatusEnum } from 'views/PancakeSquad/types'

describe('PancakeSquad/EventStepsSection/utils/getStepperStatus', () => {
  it('Should return future text', () => {
    // Given
    const eventStatus = []
    const saleStatus = SaleStatusEnum.Pending
    const hasProfileActivated = false
    const numberTicketsOfUser = 0
    const isLastPhase = false

    // When
    const result = getStepperStatus({
      hasProfileActivated,
      eventStatus,
      isLastPhase,
      saleStatus,
      numberTicketsOfUser,
    })

    // Then
    expect(result).toEqual('future')
  })

  it('Should return past text', () => {
    // Given
    const eventStatus = []
    const saleStatus = SaleStatusEnum.Claim
    const hasProfileActivated = true
    const numberTicketsOfUser = 0
    const isLastPhase = false

    // When
    const result = getStepperStatus({
      hasProfileActivated,
      eventStatus,
      isLastPhase,
      saleStatus,
      numberTicketsOfUser,
    })

    // Then
    expect(result).toEqual('past')
  })

  it('Should return current text', () => {
    // Given
    const eventStatus = [SaleStatusEnum.Presale, SaleStatusEnum.Sale]
    const saleStatus = SaleStatusEnum.Sale
    const hasProfileActivated = true
    const numberTicketsOfUser = 0
    const isLastPhase = false

    // When
    const result = getStepperStatus({
      hasProfileActivated,
      eventStatus,
      isLastPhase,
      saleStatus,
      numberTicketsOfUser,
    })

    // Then
    expect(result).toEqual('current')
  })
})
