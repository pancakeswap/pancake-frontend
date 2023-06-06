import type { NextApiRequest, NextApiResponse } from 'next'
import qs from 'qs'
import { string as zString, object as zObject } from 'zod'
import crypto from 'crypto'

type Chars<T extends string> = Record<T, string>
// type OnrampProviders = 'MOONPAY' | 'MERCURYO' | 'BINANCE_CONNECT'

const zQuery = zObject({
  type: zString(),
  defaultCurrencyCode: zString(),
  redirectUrl: zString(),
  theme: zString(),
  walletAddresses: zString(),
})

const chars: Chars<'{' | ':' | '}' | ',' | '"' | '#'> = {
  '{': '%7B',
  ':': '%3A',
  '}': '%7D',
  ',': '%2C',
  '"': '%22',
  '#': '%23',
}

const signMoonPayUrl = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const queryString = qs.stringify(req.body)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }
  const { walletAddresses, defaultCurrencyCode, theme } = parsed.data

  let returnData = null
  const doc = ''
  const pub = ''
  const p = ''
  if (parsed.data.type === 'MERCURYO') {
    returnData = crypto.createHmac('sha512', `${walletAddresses}${'9r8egtsb27bzr101em7uw7zhcrlwdbp'}`)
  } else if (parsed.data.type === 'BINANCE_CONNECT') {
    const priv = crypto.createPrivateKey({
      key: Buffer.from(p, 'base64'),
      type: 'pkcs8',
      format: 'der',
    })

    const sign = crypto.createSign('SHA256')
    sign.update(doc)
    sign.end()
    const sig = sign.sign(priv).toString('base64')

    const publick = crypto.createPublicKey({
      key: Buffer.from(pub, 'base64'),
      type: 'spki',
      format: 'der',
    })

    const verify = crypto.createVerify('SHA256')
    verify.update(doc)
    verify.end()

    returnData = verify.verify(publick, Buffer.from(sig, 'base64'))
  } else {
    const encodedwalletAddresses = walletAddresses.replace(/[{:},"]/g, (m: string) => chars[m])
    const originalUrl = `${process.env.MOONPAY_URL}&theme=${theme}&colorCode=%2382DBE3&defaultCurrencyCode=${defaultCurrencyCode}&walletAddresses=${encodedwalletAddresses}`

    const signature = crypto
      .createHmac('sha256', process.env.MOONPAY_TEST_SECRET_KEY)
      .update(new URL(originalUrl).search)
      .digest('base64')

    returnData = `${originalUrl}&signature=${encodeURIComponent(signature)}`
  }

  return res.json({ urlWithSignature: returnData })
}

export default signMoonPayUrl
