import { NextApiHandler, ServerRuntime } from 'next'

export const runtime: ServerRuntime = 'nodejs'

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

    // Cache the response for 10 seconds, revalidate in the background
    res.setHeader('Vercel-CDN-Cache-Control', 'max-age=10')
    res.setHeader('CDN-Cache-Control', 'max-age=10')
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate=10')

    return res.status(200).json({
      symbol: data.symbol,
      price: parseFloat(data.price), // Note: Binance API is providing price upto 2 decimals
    })
  } catch (error) {
    return res.status(500).json({ error })
  }
}

export default handler
