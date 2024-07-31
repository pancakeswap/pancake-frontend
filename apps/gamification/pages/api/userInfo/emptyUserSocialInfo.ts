import { GAMIFICATION_PUBLIC_API } from 'config/constants/endpoints'
import { withSiweAuth } from 'middlewares/withSiwe'

const handler = withSiweAuth(async (req, res) => {
  if (!GAMIFICATION_PUBLIC_API || !req.body || req.method !== 'POST') {
    return res.status(400).json({ message: 'API URL Empty / Method wrong' })
  }

  const response = await fetch(`${GAMIFICATION_PUBLIC_API}/userInfo/v1/emptyUserSocialInfo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: req.body,
  })

  if (!response.ok) {
    return res.status(400).json({ message: 'An error occurred please try again' })
  }

  return res.status(200).json(response)
})

export default handler
