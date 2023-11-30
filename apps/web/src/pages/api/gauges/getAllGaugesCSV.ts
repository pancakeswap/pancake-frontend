import { getAllGauges } from '@pancakeswap/gauges'
import { NextApiHandler } from 'next'
import qs from 'qs'

const MAX_CACHE_SECONDS = 60 * 5

const keys = [
  'pid',
  'gid',
  'pairName',
  'pairAddress',
  'hash',
  'chainId',
  'weight',
  'boostMultiplier',
  'maxVoteCap',
  'type',
  'feeTier',
  'masterChef',
]

const handler: NextApiHandler = async (req, res) => {
  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  try {
    const gauges = await getAllGauges({
      testnet: Boolean(queryParsed.testnet),
      inCap: Boolean(queryParsed.inCap),
    })

    res.setHeader('Cache-Control', `max-age=0, s-maxage=${MAX_CACHE_SECONDS}, stale-while-revalidate`)
    const data = [keys.join(',')] as unknown[]
    gauges.forEach((gauge) => {
      const row = [] as unknown[]
      keys.forEach((key) => {
        row.push(gauge[key])
      })
      data.push(row.join(','))
    })
    return res.status(200).send(data.join('\n'))
  } catch (err) {
    return res.status(500).json({
      error: err,
    })
  }
}

export default handler
