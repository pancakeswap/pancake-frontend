export interface AkkaRouterArgsResponseType {
  amountIn: string
  amountOutMin: string
  bridge: []
  data: []
  dstData: []
  to: string
}
export interface AkkaRouterInfoResponseType {
  input_amount: string
  return_amount: string
}

export interface AkkaRouterTrade {
  route: AkkaRouterInfoResponseType
  args: AkkaRouterArgsResponseType
}