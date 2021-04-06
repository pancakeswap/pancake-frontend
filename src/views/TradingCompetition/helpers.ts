export const localiseTradingVolume = (value: number, decimals = 0) => {
  return value.toLocaleString('en-US', { maximumFractionDigits: decimals })
}

export const accountEllipsis = (account: string) =>
  `${account.substring(0, 4)}...${account.substring(account.length - 4)}`

export default localiseTradingVolume
