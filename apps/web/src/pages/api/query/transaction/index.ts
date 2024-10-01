import { gql } from 'graphql-request'
import { bitQueryServerClient } from 'utils/graphql'

const cache = {}

const CACHE_EXPIRATION_TIME = 15 * 60 * 1000

const cleanUpCache = () => {
  const now = Date.now()
  for (const key in cache) {
    if (cache[key].timestamp + CACHE_EXPIRATION_TIME < now) {
      delete cache[key]
    }
  }
}

const GET_TRANSACTIONS = gql`
  query GetTransactions($sender: String!, $to: String!) {
    ethereum(network: bsc) {
      transactions(txSender: { is: $sender }, txTo: { is: $to }) {
        hash
      }
    }
  }
`

export default async function handler(req, res) {
  const { sender, to } = req.query

  if (!sender || !to) {
    return res.status(400).json({ error: 'Sender and To addresses are required.' })
  }

  // Clean up stale cache entries before processing the request
  cleanUpCache()

  // Create a unique cache key based on the query parameters
  const cacheKey = `${sender}_${to}`

  // Check if data is in the cache and if it's still valid
  const cachedData = cache[cacheKey]
  const isCacheValid = cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION_TIME

  if (isCacheValid) {
    res.setHeader('Cache-Control', 'public, max-age=900') // Cache for 15 minutes
    return res.status(200).json(cachedData.response)
  }

  try {
    // Execute the query
    const data = await bitQueryServerClient.request(GET_TRANSACTIONS, { sender, to })
    const hashes = data.ethereum.transactions.map((tx) => tx.hash)

    const responseToCache = { hashes }
    cache[cacheKey] = { response: responseToCache, timestamp: Date.now() }

    res.setHeader('Cache-Control', 'public, max-age=900') // Cache for 15 minutes
    return res.status(200).json(responseToCache)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Failed to fetch transaction data.' })
  }
}
