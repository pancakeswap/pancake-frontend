import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { zAddress, zQuestId } from 'config/validations'
import { withSiweAuth } from 'middlewares/withSiwe'
import qs from 'qs'
import { object as zObject } from 'zod'

const zQuery = zObject({
  userId: zAddress,
  questId: zQuestId,
})

const handler = withSiweAuth(async (req, res) => {
  if (!GAMIFICATION_PUBLIC_API || req.method !== 'POST') {
    return res.status(400).json({ message: 'Invalid request method' })
  }

  const { userId, questId } = req.query
  const queryString = qs.stringify(req.query)
  const queryParsed = qs.parse(queryString)
  const parsed = zQuery.safeParse(queryParsed)
  if (parsed.success === false) {
    return res.status(400).json({ message: 'Invalid query', reason: parsed.error })
  }

  const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/linkUserToQuest/${userId}/${questId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const message = await response.text()
  if (!response.ok) {
    return res.status(response.status).json({ message })
  }

  return res.status(200).json({ message })
})

export default handler
