import { useEffect, useState } from 'react'

const URL = 'https://api.bluelytics.com.ar/v2/evolution.json'

const useARSHistoricPrice = () => {
  const [prices, setPrices] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(URL)
      const data = await response.json()
      if (data) {
        const bluePrices = data.filter((priceObj) => {
          return priceObj.source === 'Blue'
        })
        const averagePrices = bluePrices.map((priceObj) => {
          return { date: priceObj.date, price: (priceObj?.value_buy + priceObj?.value_sell) / 2 }
        })
        setPrices(averagePrices)
      } else {
        setPrices([])
      }
    }
    fetchData()
  }, [])

  return prices
}

export default useARSHistoricPrice
