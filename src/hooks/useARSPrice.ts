import { useEffect, useState } from 'react'

const URL = 'https://api.bluelytics.com.ar/v2/latest'

const useARSPrice = () => {
  const [price, setPrice] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL)
        const data = await response.json()
        setPrice(data.blue?.value_avg)
      } catch (error) {
        setPrice(0)
      }
    }
    fetchData()
  }, [])

  return price
}

export default useARSPrice
