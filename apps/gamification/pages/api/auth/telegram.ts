import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'

const TELEGRAM_BOT_TOKEN = '7140457343:AAFWaqWpI2gvLjmMB-Lp9slsAbd0T5NW_Pg'

const preview = (req: NextApiRequest, res: NextApiResponse) => {
  const { hash, ...user } = req.query
  const secret = crypto.createHash('sha256').update(TELEGRAM_BOT_TOKEN).digest()
  const checkString = Object.keys(user)
    .sort()
    .map((k) => `${k}=${user[k]}`)
    .join('\n')
  const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex')

  if (hmac === hash) {
    console.log('sss', user)
    // Authentication successful
    res.json({ success: true, user })
  } else {
    // Authentication failed
    res.status(401).json({ success: false, message: 'Authentication failed' })
  }
}

export default preview
