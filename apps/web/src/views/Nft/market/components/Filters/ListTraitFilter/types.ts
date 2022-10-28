import { NftAttribute } from 'state/nftMarket/types'

export interface Item {
  label: string
  attr: NftAttribute
  count?: number
  image?: string
}
