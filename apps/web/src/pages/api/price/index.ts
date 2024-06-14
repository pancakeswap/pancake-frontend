import { NextApiHandler } from 'next'

export const config = {
  runtime: 'nodejs',
}

const handler: NextApiHandler = async (req, res) => {
  try {
    const { currencyA, currencyB } = req.query

    const symbol = `${currencyA}${currencyB}` // According to Binance API Spec

    // Fetch price from Binance API
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`)
    const data: {
      symbol: string
      price: string
    } = await response.json()

    console.log('Price API response from Binance API: ', response)

    // Cache the response for 10 seconds, revalidate in the background
    res.setHeader('Vercel-CDN-Cache-Control', 'max-age=10')
    res.setHeader('CDN-Cache-Control', 'max-age=10')
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=10')

    return res.status(response.status).json({
      currencyA,
      currencyB,
      price: parseFloat(data.price),
    })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export default handler
