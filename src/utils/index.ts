import BigNumber from 'bignumber.js'

export { default as formatAddress } from './formatAddress'

export const bnToDec = (bn: BigNumber, decimals = 18): number => {
  return bn.dividedBy(new BigNumber(10).pow(decimals)).toNumber()
}

export const decToBn = (dec: string | BigNumber, decimals = 18): string => {
  return new BigNumber(dec).times(new BigNumber(10).pow(decimals)).toString()
}
