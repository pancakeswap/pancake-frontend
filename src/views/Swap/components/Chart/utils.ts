import { BNB_ADDRESS } from './constants'

export const getTimewindowChange = (lineChartData) => {
  if (lineChartData.length > 0) {
    const firstValue = lineChartData[0].value
    const lastValue = lineChartData[lineChartData.length - 1].value
    const changeValue = lastValue - firstValue
    return {
      changeValue,
      changePercentage: (changeValue / firstValue).toFixed(2),
    }
  }

  return {
    changeValue: 0,
    changePercentage: 0,
  }
}

export const getTokenAddress = (tokenAddress: undefined | string) => {
  if (!tokenAddress) {
    return ''
  }
  const lowerCaseAddress = tokenAddress.toLowerCase()
  if (lowerCaseAddress === 'bnb') {
    return BNB_ADDRESS
  }

  return lowerCaseAddress
}
