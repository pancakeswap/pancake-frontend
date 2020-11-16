export type IfoStatus = 'coming_soon' | 'live' | 'finished'

export type Ifo = {
  id: string
  isActive: boolean
  status: IfoStatus
  name: string
  subTitle?: string
  description?: string
  launchDate: string
  launchTime: string
  saleAmount: string
  raiseAmount: string
  cakeToBurn: string
  projectSiteUrl: string
}
