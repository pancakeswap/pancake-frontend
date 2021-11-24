import { BNB_ADDRESS } from './constants'

const MIN_VALUE_DISPLAYED = 0.001

export const getTimeWindowChange = (lineChartData) => {
  if (lineChartData.length > 0) {
    const firstValue = lineChartData.find(({ value }) => !!value && value > 0)?.value ?? 0
    const lastValue = lineChartData[lineChartData.length - 1].value
    const changeValue = lastValue - firstValue

    return {
      changeValue:
        changeValue > 0 ? Math.max(changeValue, MIN_VALUE_DISPLAYED) : Math.min(changeValue, MIN_VALUE_DISPLAYED * -1),
      changePercentage: ((changeValue / firstValue) * 100).toFixed(2),
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
