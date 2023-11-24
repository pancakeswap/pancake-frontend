import { createHash } from 'crypto'
import ip from 'ip'

export default async function handler(req, res) {
  try {
    // Get the user's real IP address using the ip package
    const userIp = ip.address()
    const hashedIp = createHash('md5').update(userIp).digest('hex')
    const lastByteValue = parseInt(hashedIp.slice(-2), 16) / 255
    const showFeature = lastByteValue < 0.05

    res.status(200).json({ showFeature })
  } catch (error) {
    console.error('Error in feature API:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
