import qs from 'qs'
import { z } from 'zod'

const zAddress = z.string().regex(/^0x[a-fA-F0-9]{40}$/)
const zChainIdOptional = z
  .string()
  .optional()
  .refine(
    (val) => {
      if (!val) return true // Allow empty string
      const chainIds = val.split(',')
      // eslint-disable-next-line no-restricted-globals
      return chainIds.every((id) => !isNaN(Number(id))) // Ensure all elements are numbers
    },
    {
      message: 'Invalid chainId format',
    },
  )

const zQuery = z.object({
  address: zAddress,
  chainId: zChainIdOptional,
  completionStatus: z.string(),
  page: z.coerce.number().nullable(),
  pageSize: z.coerce.number().max(100).nullable(),
})

const handler = async (req, res) => {
  if (!process.env.GAMIFICATION_DASHBOARD_API || !req.query || req.method !== 'GET') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  if (!req?.headers?.authorization) {
    return res.status(400).json({ message: 'Header Authorization Empty' })
  }

  const queryString = qs.stringify(req.query, { arrayFormat: 'comma' })
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)

  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const response = await fetch(
    `${process.env.GAMIFICATION_DASHBOARD_API}/quests/org/${queryParsed.address}?${queryString}`,
    {
      method: 'GET',
      headers: {
        Authorization: req?.headers?.authorization as string,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  )

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  const data = await response.json()

  return res.status(200).json(data)
}

export default handler
