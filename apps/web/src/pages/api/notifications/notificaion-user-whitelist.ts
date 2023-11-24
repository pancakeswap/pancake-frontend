import { createHash } from 'crypto'
import ip from 'ip'
import { NextRequest } from 'next/server'

export default async function handler(req: NextRequest, res) {
  try {
    // Get the user's real IP address using the ip package
    const userIp = req.ip

    // Hash the user's IP address
    const hashedIp = createHash('md5').update('userIp').digest('hex')

    // Get the last byte's value
    const lastByteValue = parseInt(hashedIp.slice(-2), 16) / 255

    // Check if the last byte's value is less than 0.05 (5%)
    const showFeature = lastByteValue < 0.05

    res.status(200).json({ showFeature: userIp })
  } catch (error) {
    console.error('Error in feature API:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
