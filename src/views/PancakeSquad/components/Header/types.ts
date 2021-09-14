import { SaleStatusEnum } from 'views/PancakeSquad/types'

export type FixedSaleInfos = {
  canClaimGen0: boolean | null
  maxSupply: number | null
  maxPerAddress: number | null
  pricePerTicket: number | null
  startTimestamp: string | null
}

export type DynamicSaleInfos = {
  saleStatus: SaleStatusEnum | null
  totalTicketsDistributed: number | null
}
