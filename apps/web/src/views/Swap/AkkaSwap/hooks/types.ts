export interface AkkaRouterArgsResponseType {
  amountIn: string
  amountOutMin: string
  bridge: []
  data: []
  dstData: []
  to: string
  value: string
  value_hex: string
}
export interface AkkaRouterTrade {
  route: AkkaRouterInfoResponseType
  args: AkkaRouterArgsResponseType
}

export interface AkkaRouterInfoResponseType {
  input_amount: string
  input_amount_wei: number
  best_alt: number
  price_impact: number
  return_amount: string
  return_amount_wei: string
  return_amount_in_usd: number
  routes: BitgertRouteResponseDto
}
export interface BitgertRouteResponseDto {
  bitgert: Array<VolumeSpilitedRouteRoutes>
}
export interface VolumeSpilitedRouteRoutes {
  gas_fee_in_usd: number
  input_amount: number
  input_amount_in_usd: number
  input_amount_wei: number
  price_impact: number
  return_amount: number
  return_amount_in_usd: number
  return_amount_wei: string
  routes: Array<RouteRoutes>
}
export interface RouteRoutes {
  input_amount: number
  input_amount_wei: number
  operations: Array<RouteRegularOperations>
  operations_seperated: Array<RouteOperationsSeparated>
  return_amount: number
  return_amount_wei: string
}

export class RouteRegularOperations {
  constructor(partial: Partial<RouteRegularOperations> = {}) {
    Object.assign(this, partial)
  }
  amount_in: number
  amount_in_wei: string
  amount_out: number
  amount_out_wei: string
  ask_token: Array<string>
  contract_addr: string
  exchange: string
  offer_token: Array<string>
  router_addr: string
}

export enum NetworkName {
  BSC = 'BSC',
  FTM = 'FANTOM',
  BITGERT = 'BITGERT',
  BRIDGE = 'BRIDGE',
}

export enum ChainId {
  BSC = 56,
  FTM = 250,
  BRISE = 32520,
}
export interface RouteOperationsSeparated {
  chain: NetworkName
  chain_id?: number
  gas_fee?: number
  operations: Array<RouteRegularOperations>
}

export enum TokenEnum{
  NativeToken = 'BRISE',
  NativeTokenAdress = '0x0000000000000000000000000000000000000000'
}