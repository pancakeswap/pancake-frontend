export const getTimewindowChange = (lineChartData) => {
  if (lineChartData.length > 0) {
    const firstValue = lineChartData[0].value
    const lastValue = lineChartData[lineChartData.length - 1].value
    const changeValue = lastValue - firstValue
    return {
      changeValue: changeValue.toFixed(3),
      changePercentage: (changeValue / firstValue).toFixed(2),
    }
  }

  return {
    changeValue: 0,
    changePercentage: 0,
  }
}
