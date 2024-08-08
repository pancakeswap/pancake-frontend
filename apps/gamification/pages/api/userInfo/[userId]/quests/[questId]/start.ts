import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { zAddress, zQuestId } from 'config/validations'
import { withSiweAuth } from 'middlewares/withSiwe'

const handler = withSiweAuth(async (req, res) => {
  const { userId, questId } = req.query
  if (
    !GAMIFICATION_PUBLIC_API ||
    !zAddress.safeParse(userId).success ||
    !zQuestId.safeParse(questId).success ||
    !questId ||
    req.method !== 'POST'
  ) {
    return res.status(400).json({ message: 'Invalid request params / Invalid request method' })
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
