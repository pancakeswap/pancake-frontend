import BigNumber from 'bignumber.js'

export const displayBalance = (balance: any | undefined, decimals?: number, fixed?: number) => {
  if (!balance || balance === 'NaN') {
    return new BigNumber('0').toFormat(3)
  }

  // eslint-disable-next-line no-param-reassign
  decimals = decimals || 18
  // eslint-disable-next-line no-param-reassign
  fixed = fixed === undefined ? 3 : fixed
  // return new BigNumber(balance).dividedBy(new BigNumber('10').pow(decimals)).toFixed(fixed, BigNumber.ROUND_DOWN)
  return new BigNumber(balance).dividedBy(new BigNumber('10').pow(decimals)).toFormat(fixed, BigNumber.ROUND_DOWN)
}
