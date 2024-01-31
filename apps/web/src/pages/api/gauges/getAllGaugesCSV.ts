import { ChainId } from '@pancakeswap/chains'
import { getAllGauges } from '@pancakeswap/gauges'
import { NextApiHandler } from 'next'
import qs from 'qs'
import { getViemClients } from 'utils/viem.server'
import { stringify } from 'viem'

const MAX_CACHE_SECONDS = 60 * 5

const keys = [
  'pid',
  'gid',
  'pairName',
  'pairAddress',
  'hash',
  'chainId',
  'weight',
  'inCapWeight',
  'notInCapWeight',
  'boostMultiplier',
  'maxVoteCap',
  'type',
  'feeTier',
  'masterChef',
]

const handler: NextApiHandler = async (req, res) => {
  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)

  const testnet = Boolean(queryParsed.testnet ?? false)
  const inCap = Boolean(queryParsed.inCap ?? true)
  const bothCap = Boolean(queryParsed.bothCap ?? false)
  const killed = Boolean(queryParsed.killed ?? false)

  try {
    const gauges = await getAllGauges(
      getViemClients({
        chainId: testnet ? ChainId.BSC_TESTNET : ChainId.BSC,
      }),
      {
        testnet,
        inCap,
        bothCap,
        killed,
      },
    )

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
      error: JSON.parse(stringify(err)),
    })
  }
}

export default handler
