import { BigNumber } from '@ethersproject/bignumber'
import { SaleStatusEnum } from 'views/PancakeSquad/types'

export type FixedSaleInfos = {
  maxSupply: number
  maxPerAddress: number
  maxPerTransaction: number
  pricePerTicket: BigNumber
}

export type DynamicSaleInfos = {
  saleStatus: SaleStatusEnum
  totalTicketsDistributed: number
  canClaimForGen0: boolean
  numberTicketsForGen0: number
  numberTicketsUsedForGen0: number
  numberTicketsOfUser: number
  ticketsOfUser: BigNumber[]
  totalSupplyMinted: number
  numberTokensOfUser: number
  startTimestamp: number
}
