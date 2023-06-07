import { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { string as zString, object as zObject } from 'zod'
import crypto from 'crypto'

type Chars<T extends string> = Record<T, string>

const zQuery = zObject({
  type: zString(),
  defaultCurrencyCode: zString(),
  redirectUrl: zString(),
  theme: zString(),
  walletAddresses: zString(),
  baseCurrencyCode: zString(),
  baseCurrencyAmount: zString(),
})

const chars: Chars<'{' | ':' | '}' | ',' | '"' | '#'> = {
  '{': '%7B',
  ':': '%3A',
  '}': '%7D',
  ',': '%2C',
  '"': '%22',
  '#': '%23',
}

const signMoonPayUrl = (req: NextApiRequest, res: NextApiResponse): void => {
  try {
    const queryString = qs.stringify(req.body)
    const queryParsed = qs.parse(queryString)
    const parsed = zQuery.safeParse(queryParsed)

    if (!parsed.success) {
      throw new Error('Invalid query')
    }

    const { walletAddresses, defaultCurrencyCode, baseCurrencyCode, baseCurrencyAmount, theme } = parsed.data

    const encodedWalletAddresses = walletAddresses.replace(/[{:},"]/g, (m: string) => chars[m])
    const originalUrl = `${process.env.MOONPAY_URL}&theme=${theme}&colorCode=%2382DBE3&defaultCurrencyCode=${defaultCurrencyCode}&baseCurrencyCode=${baseCurrencyCode}&baseCurrencyAmount=${baseCurrencyAmount}&walletAddresses=${encodedWalletAddresses}`

    const signature = crypto
      .createHmac('sha256', process.env.MOONPAY_TEST_SECRET_KEY || '')
      .update(new URL(originalUrl).search)
      .digest('base64')

    const returnData = `${originalUrl}&signature=${encodeURIComponent(signature)}`

    res.json({ urlWithSignature: returnData })
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Bad Request' })
  }
}

export default signMoonPayUrl
