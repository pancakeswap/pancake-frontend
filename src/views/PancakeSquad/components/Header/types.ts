import { BigNumber } from '@ethersproject/bignumber'
import { SaleStatusEnum } from 'views/PancakeSquad/types'

export type FixedSaleInfos = {
  maxSupply: BigNumber
  maxPerAddress: BigNumber
  maxPerTransaction: BigNumber
  pricePerTicket: BigNumber
  startTimestamp: string
}

export type DynamicSaleInfos = {
  saleStatus: SaleStatusEnum
  totalTicketsDistributed: BigNumber
  canClaimForGen0: boolean
  numberTicketsForGen0: BigNumber
  numberTicketsUsedForGen0: BigNumber
  numberTicketsOfUser: BigNumber
  ticketsOfUser: BigNumber[]
  totalSupplyMinted: BigNumber
  numberTokensOfUser: BigNumber
}
