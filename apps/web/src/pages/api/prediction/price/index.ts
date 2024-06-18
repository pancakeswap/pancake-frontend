import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

const handler = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const currencyA = searchParams.get('currencyA')
    const currencyB = searchParams.get('currencyB')

    const symbol = `${currencyA}${currencyB}` // According to Binance API Spec

    // Fetch price from Binance API
    const response = await fetch(`https://data-api.binance.vision/api/v3/ticker/price?symbol=${symbol}`)
    const data: {
      symbol: string
      price: string
    } = await response.json()

    return NextResponse.json(
      {
        currencyA,
        currencyB,
        price: parseFloat(data.price),
      },
      {
        status: response.status,
        statusText: response.statusText,
        headers: {
          'CDN-Cache-Control': 'max-age=10',
          'Vercel-CDN-Cache-Control': 'max-age=10',
          'Cache-Control': 's-maxage=10, stale-while-revalidate=10',
        },
      },
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}

export default handler
