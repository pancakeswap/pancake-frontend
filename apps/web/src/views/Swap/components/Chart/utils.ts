import { NATIVE, WNATIVE } from '@pancakeswap/sdk'

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
      isChangePositive: changeValue >= 0,
    }
  }

  return {
    changeValue: 0,
    changePercentage: 0,
    isChangePositive: true,
  }
}

export const getTokenAddress = (chainId: number | undefined, tokenAddress: string | undefined) => {
  if (!tokenAddress || !chainId) {
    return ''
  }
  const lowerCaseAddress = tokenAddress.toLowerCase()
  const nativeToken = NATIVE[chainId]
  const nativeSymbol = nativeToken?.symbol?.toLowerCase() || ''
  if (lowerCaseAddress === nativeSymbol) {
    return WNATIVE[chainId].address.toLowerCase()
  }

  return lowerCaseAddress
}
