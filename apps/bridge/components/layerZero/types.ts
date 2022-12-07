export interface TokenInfo {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: string
}

export interface AptosBridgeForm {
  srcCurrency: null | TokenInfo
  dstCurrency: null | TokenInfo
}
