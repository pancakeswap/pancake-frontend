import { ButtonsEnum } from 'views/PancakeSquad/components/Header/types'
import { getCurrentButton } from 'views/PancakeSquad/components/Header/utils'
import { SaleStatusEnum, UserStatusEnum } from 'views/PancakeSquad/types'

describe('PancakeSquad/Header/utils/getCurrentButton', () => {
  it('Should return ACTIVATE button', () => {
    // Given
    const saleStatus = SaleStatusEnum.Pending
    const userStatus = UserStatusEnum.NO_PROFILE
    const numberTicketsOfUser = 0

    // When
    const result = getCurrentButton({
      saleStatus,
      numberTicketsOfUser,
      userStatus,
    })

    // Then
    expect(result).toEqual(ButtonsEnum.ACTIVATE)
  })

  it('Should return BUY button', () => {
    // Given
    const saleStatus = SaleStatusEnum.Sale
    const userStatus = UserStatusEnum.PROFILE_ACTIVE
    const numberTicketsOfUser = 0

    // When
    const result = getCurrentButton({
      saleStatus,
      numberTicketsOfUser,
      userStatus,
    })

    // Then
    expect(result).toEqual(ButtonsEnum.BUY)
  })

  it('Should return MINT button', () => {
    // Given
    const saleStatus = SaleStatusEnum.Claim
    const userStatus = UserStatusEnum.PROFILE_ACTIVE
    const numberTicketsOfUser = 3

    // When
    const result = getCurrentButton({
      saleStatus,
      numberTicketsOfUser,
      userStatus,
    })

    // Then
    expect(result).toEqual(ButtonsEnum.MINT)
  })

  it('Should return END button', () => {
    // Given
    const saleStatus = SaleStatusEnum.Claim
    const userStatus = UserStatusEnum.PROFILE_ACTIVE
    const numberTicketsOfUser = 0

    // When
    const result = getCurrentButton({
      saleStatus,
      numberTicketsOfUser,
      userStatus,
    })

    // Then
    expect(result).toEqual(ButtonsEnum.END)
  })
})
