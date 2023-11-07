import BigNumber from 'bignumber.js'

interface FetchAlpBoostedPool {
  totalStaked: number
  stakingTokenPrice: number
}

export const fetchAlpBoostedPoolApr = async ({ totalStaked, stakingTokenPrice }: FetchAlpBoostedPool) => {
  const api = 'https://perp.pancakeswap.finance/bapi/futures/v1/public/future/apx/fee/info?chain=ARB'
  const totalValue = new BigNumber(totalStaked).times(stakingTokenPrice)

  try {
    const response = await fetch(api)
    const result = await response.json()
    const { alpFundingFee, alpTradingFee, alpLipFee } = result.data
    const fee = new BigNumber(alpFundingFee).plus(alpTradingFee).plus(alpLipFee)
    const feeApr = fee.div(totalValue)
    return feeApr.toNumber()
  } catch (error) {
    console.info('Fetch ALP boosted fee error: ', error)
    return 0
  }
}
