import { SaleStatusEnum } from 'views/PancakeSquad/types'

export type FixedSaleInfos = {
  maxSupply: number | null
  maxPerAddress: number | null
  pricePerTicket: number | null
  startTimestamp: string | null
}

export type DynamicSaleInfos = {
  saleStatus: SaleStatusEnum | null
  totalTicketsDistributed: number | null
  canClaimForGen0: boolean | null
  numberTicketsForGen0: number | null
  numberTicketsUsedForGen0: number | null
  numberTicketsOfUser: number | null
  ticketsOfUser: number[] | null
  totalSupplyMinted: number | null
  numberTokensOfUser: number | null
  hasActiveProfile: boolean | null
}
