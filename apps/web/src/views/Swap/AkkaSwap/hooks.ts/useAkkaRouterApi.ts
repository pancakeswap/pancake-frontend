import { Currency } from "@pancakeswap/sdk"
import { useEffect, useState } from "react"

export const useAkkaRouterRoute = (token0: Currency, token1: Currency, amount: string, slippage: number = 0) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://www.apiv2.akka.finance/swap?token0=${token0}&chain0=bitgert&token1=${token1}&chain1=bitgert&amount=${amount}&slipage=${slippage}&use_split=true`)
                const responseData = await response.json()

                setData(responseData)
            } catch (error) {
                console.error('Unable to fetch data:', error)
            }
        }

        fetchData()

    }, [setData])

    return data
}