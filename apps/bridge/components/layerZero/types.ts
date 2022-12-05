export interface TokenInfo {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
}

export interface AptosBridgeForm {
  evmAddress: string
  aptosAddress: string
  inputAmount: string
  srcCurrency: null | TokenInfo
  dstCurrency: null | TokenInfo
}
