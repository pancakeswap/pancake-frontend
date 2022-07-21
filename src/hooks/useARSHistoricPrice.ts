import { useEffect, useState } from 'react'

const URL = 'https://api.bluelytics.com.ar/v2/evolution.json'

const useARSHistoricPrice = () => {
  const [prices, setPrices] = useState([])
  const fetchData = async () => {
    const response = await fetch(URL)
    const data = await response.json()
    if (data) {
      const bluePrices = data.filter((priceObj: { source: string }) => {
        return priceObj.source === 'Blue'
      })
      // eslint-disable-next-line camelcase
      const averagePrices = bluePrices.map((priceObj: { date: string; value_buy: number; value_sell: number }) => {
        return { date: priceObj.date, price: (priceObj?.value_buy + priceObj?.value_sell) / 2 }
      })
      setPrices(averagePrices)
    } else {
      setPrices([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return prices
}

export default useARSHistoricPrice
